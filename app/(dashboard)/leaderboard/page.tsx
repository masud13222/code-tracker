'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  problemsSolved: number;
  completionPercentage: number;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();

      if (response.ok) {
        setLeaderboard(data.leaderboard);
        setTotalProblems(data.totalProblems);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    if (rank === 2) return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    if (rank === 3) return 'bg-amber-600/10 text-amber-500 border-amber-600/20';
    return '';
  };

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          See how you rank among your teammates
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-zinc-800">
          <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardDescription className="text-xs sm:text-sm">Total Problems</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">{totalProblems}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-zinc-800">
          <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardDescription className="text-xs sm:text-sm">Active Users</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">{leaderboard.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-zinc-800 sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardDescription className="text-xs sm:text-sm">Average Completion</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">
              {leaderboard.length > 0
                ? Math.round(
                    leaderboard.reduce((sum, u) => sum + u.completionPercentage, 0) /
                      leaderboard.length
                  )
                : 0}
              %
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-zinc-800">
        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
          <CardTitle className="text-xl sm:text-2xl">Rankings</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Sorted by total problems solved
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 sm:h-20 w-full" />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm sm:text-base">
              No data available yet. Start solving problems!
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800">
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-center">Problems Solved</TableHead>
                      <TableHead className="text-center">Completion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry) => (
                      <TableRow
                        key={entry.userId}
                        className={`border-zinc-800 ${
                          entry.isCurrentUser ? 'bg-blue-500/5' : ''
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRankIcon(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => router.push(`/users/${entry.userId}`)}
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarFallback
                                className={`${
                                  entry.rank <= 3
                                    ? getRankBadge(entry.rank)
                                    : 'bg-zinc-800'
                                }`}
                              >
                                {getInitials(entry.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                              <span className="font-medium hover:text-blue-400 transition-colors">{entry.username}</span>
                              {entry.isCurrentUser && (
                                <Badge variant="outline" className="text-xs">
                                  You
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-lg font-semibold">
                            {entry.problemsSolved}
                          </span>
                          <span className="text-muted-foreground">
                            {' '}
                            / {totalProblems}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
                                style={{ width: `${entry.completionPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium min-w-[3rem] text-right">
                              {entry.completionPercentage}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`p-4 rounded-lg border border-zinc-800 ${
                      entry.isCurrentUser ? 'bg-blue-500/5 border-blue-500/50' : 'bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getRankIcon(entry.rank)}
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => router.push(`/users/${entry.userId}`)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback
                              className={`${
                                entry.rank <= 3
                                  ? getRankBadge(entry.rank)
                                  : 'bg-zinc-800'
                              }`}
                            >
                              {getInitials(entry.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-base hover:text-blue-400 transition-colors">{entry.username}</span>
                            {entry.isCurrentUser && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Problems Solved</span>
                        <span className="text-base font-semibold">
                          {entry.problemsSolved} <span className="text-muted-foreground">/ {totalProblems}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Completion</span>
                          <span className="text-sm font-medium">
                            {entry.completionPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
                            style={{ width: `${entry.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

