import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Problem from '@/lib/models/Problem';
import Completion from '@/lib/models/Completion';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    // Get all users
    const users = await User.find().select('_id username');

    // Get total problems count
    const totalProblems = await Problem.countDocuments();

    // Get completion counts for each user
    const leaderboardData = await Promise.all(
      users.map(async (dbUser) => {
        const completionCount = await Completion.countDocuments({
          userId: (dbUser._id as any),
        });

        const completionPercentage =
          totalProblems > 0 ? Math.round((completionCount / totalProblems) * 100) : 0;

        return {
          userId: (dbUser._id as any).toString(),
          username: dbUser.username,
          problemsSolved: completionCount,
          completionPercentage,
        };
      })
    );

    // Sort by problems solved (descending)
    leaderboardData.sort((a, b) => b.problemsSolved - a.problemsSolved);

    // Add rank
    const leaderboard = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      isCurrentUser: entry.userId === user.userId,
    }));

    return NextResponse.json({
      leaderboard,
      totalProblems,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

