import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma"; // Kita buat alias ini jika ada, jika tidak, kita akan gunakan path relatif, tapi next.js biasanya ada alias @/. Nanti kita fix jika error. Coba import dari "../../../../lib/prisma" dulu untuk aman.

import prismaClient from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Cek apakah user sudah ada
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Buat user baru di database
    const newUser = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Jangan kembalikan password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
