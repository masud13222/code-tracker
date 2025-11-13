import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Completion from '@/lib/models/Completion';
import Problem from '@/lib/models/Problem';

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { problemId } = await request.json();

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Check if completion exists
    const existingCompletion = await Completion.findOne({
      userId: user.userId,
      problemId,
    });

    if (existingCompletion) {
      // Remove completion (toggle off)
      await Completion.deleteOne({ _id: existingCompletion._id });
      return NextResponse.json({
        success: true,
        isCompleted: false,
      });
    } else {
      // Add completion (toggle on)
      await Completion.create({
        userId: user.userId,
        problemId,
      });
      return NextResponse.json({
        success: true,
        isCompleted: true,
      });
    }
  } catch (error) {
    console.error('Toggle completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

