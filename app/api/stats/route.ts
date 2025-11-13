import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Problem from '@/lib/models/Problem';
import Completion from '@/lib/models/Completion';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    
    // Ensure User model is loaded
    if (!User) {
      console.error('User model not loaded');
    }

    // Total problems (only count actual problems, not topics)
    const totalProblems = await Problem.countDocuments({ topicId: { $exists: true, $ne: null } });

    // User's completions
    const userCompletions = await Completion.find({ userId: user.userId })
      .populate('problemId')
      .sort({ completedAt: -1 })
      .limit(5);

    const completedCount = await Completion.countDocuments({ userId: user.userId });

    // Completion by difficulty
    const completions = await Completion.find({ userId: user.userId }).populate('problemId');
    
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;

    completions.forEach((completion: any) => {
      if (completion.problemId) {
        if ((completion.problemId as any).difficulty === 'Easy') easyCount++;
        else if ((completion.problemId as any).difficulty === 'Medium') mediumCount++;
        else if ((completion.problemId as any).difficulty === 'Hard') hardCount++;
      }
    });

    const recentCompletions = userCompletions.map((completion: any) => ({
      id: (completion._id as any).toString(),
      problemId: ((completion.problemId as any)._id as any).toString(),
      problemName: (completion.problemId as any).name,
      difficulty: (completion.problemId as any).difficulty,
      completedAt: completion.completedAt,
    }));

    const completionPercentage = totalProblems > 0 
      ? Math.round((completedCount / totalProblems) * 100) 
      : 0;

    return NextResponse.json({
      totalProblems,
      completedProblems: completedCount,
      pendingProblems: totalProblems - completedCount,
      completionPercentage,
      difficultyBreakdown: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
      },
      recentCompletions,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

