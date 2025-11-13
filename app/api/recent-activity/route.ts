import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Completion from '@/lib/models/Completion';
import Problem from '@/lib/models/Problem';
import User from '@/lib/models/User';
import Topic from '@/lib/models/Topic';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    // Ensure models are loaded
    if (!User || !Problem || !Topic) {
      console.error('Models not loaded');
    }

    // Get last 10 completions from all users
    const recentCompletions = await Completion.find()
      .populate('userId', 'username')
      .populate({
        path: 'problemId',
        select: 'name difficulty topicId',
        populate: {
          path: 'topicId',
          select: 'name',
        },
      })
      .sort({ completedAt: -1 })
      .limit(10);

    const activities = recentCompletions
      .filter((completion) => completion.problemId && completion.userId)
      .map((completion) => ({
        id: (completion._id as any).toString(),
        problemId: ((completion.problemId as any)._id as any).toString(),
        problemName: (completion.problemId as any).name,
        difficulty: (completion.problemId as any).difficulty,
        topicName: (completion.problemId as any).topicId?.name || 'Unknown',
        username: (completion.userId as any).username,
        completedAt: completion.completedAt,
      }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Get recent activity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

