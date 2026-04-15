import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '../../../../../../auth';
import { unlink } from 'fs/promises';
import path from 'path';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: { select: { email: true, role: true } },
      },
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Must be the owner to edit
    if (message.sender.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot edit file attachments text
    if (message.fileUrl) {
      return NextResponse.json({ error: 'Cannot edit message with attachment' }, { status: 400 });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error editing message:', error);
    return NextResponse.json({ error: 'Failed to edit message' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: { select: { email: true, role: true } },
      },
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Must be the owner to delete
    if (message.sender.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the file if it exists
    if (message.fileName && message.fileUrl) {
      try {
        const urlParts = message.fileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1]; // e.g. uuid.ext
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadsDir, fileName);
        await unlink(filePath);
      } catch (fsError) {
        console.error('Error deleting physical file:', fsError);
        // Continue to delete DB record even if file deletion fails
      }
    }

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
