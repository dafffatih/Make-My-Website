import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '../../../../../auth';

// GET messages for a conversation
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');

  if (!conversationId) {
    return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Verify access: admin can access any, customer can only access their own
  if (user.role !== 'admin') {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, customerId: user.id },
    });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
  }

  const cursor = searchParams.get('cursor');
  const take = 50;

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take,
  });

  return NextResponse.json(messages);
}

// POST send a new message
export async function POST(req: Request) {
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

  try {
    const body = await req.json();
    const { conversationId, content, fileUrl, fileName, fileType, fileSize } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    if (!content && !fileUrl) {
      return NextResponse.json({ error: 'Message content or file is required' }, { status: 400 });
    }

    // Verify access
    if (user.role !== 'admin') {
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, customerId: user.id },
      });
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: content || null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        fileSize: fileSize || null,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
