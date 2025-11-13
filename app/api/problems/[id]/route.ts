import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Problem from '@/lib/models/Problem';
import Completion from '@/lib/models/Completion';
import Submission from '@/lib/models/Submission';

// DELETE a problem
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: problemId } = await context.params;

    await connectDB();

    // Find the problem
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Check if user is the creator
    if ((problem.createdBy as any).toString() !== user.userId) {
      return NextResponse.json(
        { error: 'You can only delete problems you created' },
        { status: 403 }
      );
    }

    // Delete all related completions
    await Completion.deleteMany({ problemId });

    // Delete all related submissions
    await Submission.deleteMany({ problemId });

    // Delete the problem
    await Problem.findByIdAndDelete(problemId);

    return NextResponse.json({
      success: true,
      message: 'Problem and all related data deleted successfully',
    });
  } catch (error) {
    console.error('Delete problem error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

