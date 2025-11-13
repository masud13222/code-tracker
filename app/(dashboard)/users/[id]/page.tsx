'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, CheckCircle2, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface UserDetails {
  user: {
    id: string;
    username: string;
    createdAt: Date;
  };
  stats: {
    totalSolved: number;
    easy: number;
    medium: number;
    hard: number;
  };
  topicStats: Array<{
    name: string;
    count: number;
  }>;
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setUserDetails(data);
      } else {
        setError(data.error || 'Failed to fetch user details');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>User not found.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Button>

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
          {userDetails.user.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{userDetails.user.username}</h1>
          <p className="text-muted-foreground">
            Member since {formatDate(userDetails.user.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userDetails.stats.totalSolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Problems completed</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 border-green-500/20 bg-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Easy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{userDetails.stats.easy}</div>
            <p className="text-xs text-muted-foreground mt-1">Solved</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medium</CardTitle>
            <Target className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{userDetails.stats.medium}</div>
            <p className="text-xs text-muted-foreground mt-1">Solved</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 border-red-500/20 bg-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hard</CardTitle>
            <Target className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{userDetails.stats.hard}</div>
            <p className="text-xs text-muted-foreground mt-1">Solved</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle>Problems by Topic</CardTitle>
          <CardDescription>
            Breakdown of solved problems across different topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userDetails.topicStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No problems solved yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userDetails.topicStats.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                      <span className="text-lg font-bold text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{topic.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {topic.count} problem{topic.count !== 1 ? 's' : ''} solved
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {topic.count}
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

