import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Problem from '@/lib/models/Problem';
import Completion from '@/lib/models/Completion';
import User from '@/lib/models/User';

// GET problems for a topic
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: topicId } = await context.params;

    await connectDB();
    
    // Ensure User model is loaded
    if (!User) {
      console.error('User model not loaded');
    }

    const problems = await Problem.find({ topicId })
      .populate('createdBy', 'username')
      .sort({ order: 1, createdAt: 1 });

    // Get user's completions
    const completions = await Completion.find({ userId: user.userId });
    const completedProblemIds = new Set(
      completions.map((c) => (c.problemId as any).toString())
    );

    // Get all completions for these problems with user info
    const allCompletions = await Completion.find({
      problemId: { $in: problems.map(p => p._id) }
    }).populate('userId', 'username');

    // Group completions by problem
    const completionsByProblem = new Map();
    for (const completion of allCompletions) {
      const problemId = (completion.problemId as any).toString();
      if (!completionsByProblem.has(problemId)) {
        completionsByProblem.set(problemId, []);
      }
      completionsByProblem.get(problemId).push({
        username: (completion.userId as any).username,
      });
    }

    const problemsWithStatus = problems.map((problem) => ({
      id: (problem._id as any).toString(),
      name: problem.name,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags,
      externalLink: problem.externalLink,
      order: problem.order,
      isRecommended: problem.isRecommended,
      isCompleted: completedProblemIds.has((problem._id as any).toString()),
      completedBy: completionsByProblem.get((problem._id as any).toString()) || [],
      createdBy: {
        id: (problem.createdBy._id as any).toString(),
        username: problem.createdBy.username,
      },
    }));

    return NextResponse.json({ problems: problemsWithStatus });
  } catch (error) {
    console.error('Get topic problems error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new problem in topic
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: topicId } = await context.params;
    const { name, description, difficulty, tags, externalLink, order, isRecommended } =
      await request.json();

    if (!name || !difficulty || !externalLink) {
      return NextResponse.json(
        { error: 'Name, difficulty, and external link are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Ensure User model is loaded
    if (!User) {
      console.error('User model not loaded');
    }

    const problem = await Problem.create({
      name,
      description: description || '',
      difficulty,
      tags: tags || [],
      externalLink,
      topicId,
      order: order || 0,
      isRecommended: isRecommended || false,
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
        order: populatedProblem!.order,
        isRecommended: populatedProblem!.isRecommended,
        isCompleted: false,
        completedBy: [],
        createdBy: {
          id: (populatedProblem!.createdBy._id as any).toString(),
          username: populatedProblem!.createdBy.username,
        },
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

