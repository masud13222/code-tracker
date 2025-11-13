import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Topic from '@/lib/models/Topic';
import Problem from '@/lib/models/Problem';
import Completion from '@/lib/models/Completion';

// GET all topics with progress
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    const topics = await Topic.find().sort({ createdAt: 1 });

    // Get problem counts and completion counts for each topic
    const topicsWithProgress = await Promise.all(
      topics.map(async (topic) => {
        const totalProblems = await Problem.countDocuments({ topicId: topic._id });
        
        // Get all problems for this topic
        const problems = await Problem.find({ topicId: topic._id });
        const problemIds = problems.map(p => p._id);
        
        // Count completions for this user
        const completedCount = await Completion.countDocuments({
          userId: user.userId,
          problemId: { $in: problemIds },
        });

        return {
          id: (topic._id as any).toString(),
          name: topic.name,
          description: topic.description,
          icon: topic.icon,
          totalProblems,
          completedProblems: completedCount,
          progress: totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0,
        };
      })
    );

    return NextResponse.json({ topics: topicsWithProgress });
  } catch (error) {
    console.error('Get topics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new topic
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, description, icon } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Topic name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const topic = await Topic.create({
      name,
      description: description || '',
      icon: icon || '📚',
      createdBy: user.userId,
    });

    return NextResponse.json({
      success: true,
      topic: {
        id: (topic._id as any).toString(),
        name: topic.name,
        description: topic.description,
        icon: topic.icon,
        totalProblems: 0,
        completedProblems: 0,
        progress: 0,
      },
    });
  } catch (error) {
    console.error('Create topic error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

