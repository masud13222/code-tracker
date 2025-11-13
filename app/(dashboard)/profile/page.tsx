'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, Trophy, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  id: string;
  username: string;
  createdAt: Date;
}

interface UserStats {
  totalProblems: number;
  completedProblems: number;
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

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/stats'),
      ]);

      const [profileData, statsData] = await Promise.all([
        profileRes.json(),
        statsRes.json(),
      ]);

      if (profileRes.ok && statsRes.ok) {
        setProfile(profileData.user);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateShort = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          View your progress and achievements
        </p>
      </div>

      <Card className="border-zinc-800 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl">
                {getInitials(profile.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(profile.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="gap-1">
                  <Trophy className="h-3 w-3" />
                  {stats.completedProblems} Solved
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Target className="h-3 w-3" />
                  {stats.completionPercentage}% Complete
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-zinc-800">
          <CardHeader className="pb-3">
            <CardDescription>Total Solved</CardDescription>
            <CardTitle className="text-4xl">
              {stats.completedProblems}
              <span className="text-lg text-muted-foreground ml-2">
                / {stats.totalProblems}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800">
          <CardHeader className="pb-3">
            <CardDescription>Easy Problems</CardDescription>
            <CardTitle className="text-4xl text-green-400">
              {stats.difficultyBreakdown.easy}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Solved</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800">
          <CardHeader className="pb-3">
            <CardDescription>Medium Problems</CardDescription>
            <CardTitle className="text-4xl text-yellow-400">
              {stats.difficultyBreakdown.medium}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Solved</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 md:col-span-3">
          <CardHeader className="pb-3">
            <CardDescription>Hard Problems</CardDescription>
            <CardTitle className="text-4xl text-red-400">
              {stats.difficultyBreakdown.hard}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Solved</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>Your recent problem completions</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentCompletions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No activity yet. Start solving problems!
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentCompletions.map((completion) => (
                <div
                  key={completion.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{completion.problemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Completed on {formatDateShort(completion.completedAt)}
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
  );
}

