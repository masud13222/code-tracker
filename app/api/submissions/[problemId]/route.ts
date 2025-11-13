import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Submission from '@/lib/models/Submission';
import Completion from '@/lib/models/Completion';
import Problem from '@/lib/models/Problem';
import User from '@/lib/models/User';

// GET all submissions for a problem
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ problemId: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { problemId } = await context.params;

    await connectDB();
    
    // Ensure User model is loaded
    if (!User) {
      console.error('User model not loaded');
    }

    // Get problem details
    const problem = await Problem.findById(problemId);

    // Get all submissions
    const submissions = await Submission.find({ problemId })
      .populate('userId', 'username')
      .sort({ submittedAt: -1 });

    // Get completions
    const completions = await Completion.find({ problemId });
    const completedUserIds = new Set(
      completions.map((c) => c.userId.toString())
    );

    const submissionsWithStatus = submissions.map((sub) => ({
      id: (sub._id as any).toString(),
      code: sub.code,
      language: sub.language,
      notes: sub.notes,
      submittedAt: sub.submittedAt,
      user: {
        id: (sub.userId._id as any).toString(),
        username: sub.userId.username,
      },
      isCompleted: completedUserIds.has((sub.userId._id as any).toString()),
      isCurrentUser: (sub.userId._id as any).toString() === user.userId,
    }));

    return NextResponse.json({ 
      submissions: submissionsWithStatus,
      problem: problem ? {
        id: (problem._id as any).toString(),
        name: problem.name,
        description: problem.description,
        difficulty: problem.difficulty,
        externalLink: problem.externalLink,
      } : null
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

