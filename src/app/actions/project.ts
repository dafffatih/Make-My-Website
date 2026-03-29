"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function getUserProjects() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function createProject(data: {
  name: string;
  package: string;
  formDetails: any;
  basePrice: number;
  addonsPrice: number;
  maxRevisions: number;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: data.name,
      package: data.package,
      status: 2, // Move to Payment stage
      formDetails: data.formDetails,
      basePrice: data.basePrice,
      addonsPrice: data.addonsPrice,
      totalAmount: data.basePrice + data.addonsPrice,
      maxRevisions: data.maxRevisions,
      revisionTickets: data.maxRevisions,
    },
  });

  revalidatePath("/chat");
  return project;
}

export async function updateProjectStage(id: string, newStage: number) {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }
    
    const project = await prisma.project.update({
        where: { id },
        data: { status: newStage }
    });

    revalidatePath("/chat");
    return project;
}

export async function processPayment(id: string, amountToPay: number, payDomainSetup: boolean, domainFee: number) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const currentProject = await prisma.project.findUnique({ where: { id }});
  
  if (!currentProject) throw new Error("Project not found");

  const newAmountPaid = currentProject.amountPaid + amountToPay;
  const pd = currentProject.paidDomain || payDomainSetup;
  
  const isFullyPaid = newAmountPaid >= currentProject.totalAmount;

  // Let's decide stage. If we were in stage 2 (Deposit) and now paid 
  let newStatus = currentProject.status;
  if (currentProject.status === 2 && newAmountPaid > 0) {
      newStatus = 3; // In development
  } else if (currentProject.status === 4 && isFullyPaid) {
      newStatus = 5; // Revisions? Actually, if 4 is Final Payment, maybe it goes to deployment. Or Revisions. Revisions naturally.
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      amountPaid: newAmountPaid,
      paidDomain: pd,
      domainFee: domainFee > 0 ? domainFee : currentProject.domainFee, // just record it if passed
      status: newStatus
    },
  });

  revalidatePath("/chat");
  return project;
}

export async function submitRevision(id: string, details: string) {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const currentProject = await prisma.project.findUnique({ where: { id }});
    if (!currentProject || currentProject.revisionTickets <= 0) {
        throw new Error("Not enough revision tickets");
    }

    const project = await prisma.project.update({
        where: { id },
        data: {
            revisionTickets: currentProject.revisionTickets - 1
        }
    })

    revalidatePath("/chat");
    return project;
}
