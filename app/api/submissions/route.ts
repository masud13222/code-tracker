import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Submission from '@/lib/models/Submission';
import User from '@/lib/models/User';

// POST submit code
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { problemId, code, language, notes } = await request.json();

    if (!problemId || !code) {
      return NextResponse.json(
        { error: 'Problem ID and code are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Ensure User model is loaded
    if (!User) {
      console.error('User model not loaded');
    }

    // Check if submission already exists
    const existingSubmission = await Submission.findOne({
      userId: user.userId,
      problemId,
    });

    let submission;
    if (existingSubmission) {
      // Update existing submission
      existingSubmission.code = code;
      existingSubmission.language = language || 'cpp';
      existingSubmission.notes = notes || '';
      existingSubmission.submittedAt = new Date();
      await existingSubmission.save();
      submission = existingSubmission;
    } else {
      // Create new submission
      submission = await Submission.create({
        userId: user.userId,
        problemId,
        code,
        language: language || 'cpp',
        notes: notes || '',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Code submitted successfully',
    });
  } catch (error) {
    console.error('Submit code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

