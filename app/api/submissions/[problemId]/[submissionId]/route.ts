import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Submission from '@/lib/models/Submission';

// PUT update a submission
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ problemId: string; submissionId: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { submissionId } = await context.params;
    const { code, language, notes } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find submission
    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Check if user owns this submission
    if ((submission.userId as any).toString() !== user.userId) {
      return NextResponse.json(
        { error: 'You can only edit your own submissions' },
        { status: 403 }
      );
    }

    // Update submission
    submission.code = code;
    submission.language = language;
    submission.notes = notes || '';
    await submission.save();

    return NextResponse.json({
      success: true,
      submission: {
        id: (submission._id as any).toString(),
        code: submission.code,
        language: submission.language,
        notes: submission.notes,
      },
    });
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

