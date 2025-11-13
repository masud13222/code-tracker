'use client';

import { useState, useEffect } from 'react';
import { Code2, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalProblems: number;
  completedProblems: number;
  pendingProblems: number;
  completionPercentage: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  recentCompletions: Array<{
    id: string;
    problemId: string;
    problemName: string;
    difficulty: string;
    completedAt: Date;
  }>;
}

interface RecentActivity {
  id: string;
  problemId: string;
  problemName: string;
  difficulty: string;
  topicName: string;
  username: string;
  completedAt: Date;
}

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/recent-activity');
      const data = await response.json();

      if (response.ok) {
        setRecentActivity(data.activities);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your coding progress and achievements
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Problems"
          value={stats.totalProblems}
          icon={Code2}
          description="Available problems"
        />
        <StatsCard
          title="Completed"
          value={stats.completedProblems}
          icon={CheckCircle2}
          description={`${stats.completionPercentage}% completion rate`}
        />
        <StatsCard
          title="Pending"
          value={stats.pendingProblems}
          icon={Clock}
          description="Problems to solve"
        />
        <StatsCard
          title="Progress"
          value={`${stats.completionPercentage}%`}
          icon={TrendingUp}
          description="Overall completion"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-800">
          <CardHeader>
            <CardTitle>Difficulty Breakdown</CardTitle>
            <CardDescription>Problems solved by difficulty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">Easy</span>
              </div>
              <span className="text-2xl font-bold">{stats.difficultyBreakdown.easy}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Medium</span>
              </div>
              <span className="text-2xl font-bold">{stats.difficultyBreakdown.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">Hard</span>
              </div>
              <span className="text-2xl font-bold">{stats.difficultyBreakdown.hard}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Completions</CardTitle>
            <CardDescription>Your latest solved problems</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentCompletions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No completions yet</p>
                <Link href="/problems">
                  <Button size="sm">Start Solving</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentCompletions.map((completion) => (
                  <div
                    key={completion.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{completion.problemName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(completion.completedAt)}
                      </p>
                    </div>
                    <Badge className={difficultyColors[completion.difficulty as keyof typeof difficultyColors]}>
                      {completion.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest submissions from all users</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <Link 
                  key={activity.id} 
                  href={`/problems/${activity.problemId}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-blue-400 truncate">
                          {activity.username}
                        </span>
                        <span className="text-xs text-muted-foreground">completed</span>
                      </div>
                      <p className="font-medium truncate hover:text-blue-400 transition-colors">
                        {activity.problemName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.topicName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.completedAt)}
                        </span>
                      </div>
                    </div>
                    <Badge className={difficultyColors[activity.difficulty as keyof typeof difficultyColors]}>
                      {activity.difficulty}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these actions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/problems">
            <Button variant="default">Browse Problems</Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline">View Leaderboard</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">View Profile</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

