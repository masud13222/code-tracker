import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Problem from '@/lib/models/Problem';
import Completion from '@/lib/models/Completion';

// GET all problems
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const tag = searchParams.get('tag');

    await connectDB();

    let query: any = {};
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (tag) {
      query.tags = tag;
    }

    const problems = await Problem.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    // Get user's completions
    const completions = await Completion.find({ userId: user.userId });
    const completedProblemIds = new Set(
      completions.map((c) => (c.problemId as any).toString())
    );

    // Add completion status to each problem
    const problemsWithStatus = problems.map((problem) => ({
      id: (problem._id as any).toString(),
      name: problem.name,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags,
      externalLink: problem.externalLink,
      createdBy: {
        id: (problem.createdBy._id as any).toString(),
        username: (problem.createdBy as any).username,
      },
      createdAt: problem.createdAt,
      isCompleted: completedProblemIds.has((problem._id as any).toString()),
    }));

    return NextResponse.json({ problems: problemsWithStatus });
  } catch (error) {
    console.error('Get problems error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new problem
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, description, difficulty, tags, externalLink } = await request.json();

    // Validation
    if (!name || !description || !difficulty || !externalLink) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    await connectDB();

    const problem = await Problem.create({
      name,
      description,
      difficulty,
      tags: tags || [],
      externalLink,
      createdBy: user.userId,
    });

    const populatedProblem = await Problem.findById(problem._id).populate(
      'createdBy',
      'username'
    );

    return NextResponse.json({
      success: true,
      problem: {
        id: (populatedProblem!._id as any).toString(),
        name: populatedProblem!.name,
        description: populatedProblem!.description,
        difficulty: populatedProblem!.difficulty,
        tags: populatedProblem!.tags,
        externalLink: populatedProblem!.externalLink,
        createdBy: {
          id: (populatedProblem!.createdBy._id as any).toString(),
          username: (populatedProblem!.createdBy as any).username,
        },
        createdAt: populatedProblem!.createdAt,
        isCompleted: false,
      },
    });
  } catch (error) {
    console.error('Create problem error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

