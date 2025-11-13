import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Completion from '@/lib/models/Completion';
import Problem from '@/lib/models/Problem';
import Topic from '@/lib/models/Topic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: userId } = await context.params;

    await connectDB();

    // Ensure models are loaded
    if (!User || !Problem || !Topic) {
      console.error('Models not loaded');
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all completions for this user
    const completions = await Completion.find({ userId }).populate({
      path: 'problemId',
      select: 'name difficulty topicId',
      populate: {
        path: 'topicId',
        select: 'name',
      },
    });

    // Count by difficulty
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;

    for (const completion of completions) {
      if (completion.problemId) {
        switch (completion.problemId.difficulty) {
          case 'Easy':
            easyCount++;
            break;
          case 'Medium':
            mediumCount++;
            break;
          case 'Hard':
            hardCount++;
            break;
        }
      }
    }

    // Count by topic
    const topicMap = new Map<string, { name: string; count: number }>();
    for (const completion of completions) {
      if (completion.problemId && completion.problemId.topicId) {
        const topicId = (completion.problemId.topicId._id as any).toString();
        const topicName = completion.problemId.topicId.name;
        
        if (topicMap.has(topicId)) {
          topicMap.get(topicId)!.count++;
        } else {
          topicMap.set(topicId, { name: topicName, count: 1 });
        }
      }
    }

    const topicStats = Array.from(topicMap.values()).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      user: {
        id: (user._id as any).toString(),
        username: user.username,
        createdAt: user.createdAt,
      },
      stats: {
        totalSolved: completions.length,
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
      },
      topicStats,
    });
  } catch (error) {
    console.error('Get user details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

