import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '../../../../../auth';

// GET conversations
// - Admin: gets all conversations with customer info
// - Customer: gets their own conversation (or null)
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.role === 'admin') {
    // Admin sees all conversations
    const conversations = await prisma.conversation.findMany({
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            sender: { select: { name: true, role: true } },
            fileName: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(conversations);
  } else {
    // Customer sees only their conversation
    const conversation = await prisma.conversation.findFirst({
      where: { customerId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json(conversation);
  }
}

// POST create a new conversation (customer only)
export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if conversation already exists
  const existing = await prisma.conversation.findFirst({
    where: { customerId: user.id },
  });

  if (existing) {
    return NextResponse.json(existing);
  }

  const conversation = await prisma.conversation.create({
    data: {
      customerId: user.id,
      subject: `Chat with ${user.name || user.email}`,
    },
  });

  return NextResponse.json(conversation, { status: 201 });
}
