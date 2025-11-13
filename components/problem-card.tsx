'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, User, Code, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProblemCardProps {
  problem: {
    id: string;
    name: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    externalLink: string;
    order?: number;
    isRecommended?: boolean;
    createdBy: {
      id: string;
      username: string;
    };
    createdAt?: Date;
    isCompleted: boolean;
    completedBy?: Array<{
      username: string;
    }>;
  };
  onToggleComplete: (problemId: string) => Promise<void>;
}

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function ProblemCard({ problem, onToggleComplete }: ProblemCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(problem.isCompleted);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggleComplete(problem.id);
      setIsCompleted(!isCompleted);
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          notes,
        }),
      });

      if (response.ok) {
        setCode('');
        setNotes('');
        setSubmitDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to submit code:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewSubmissions = () => {
    router.push(`/problems/${problem.id}`);
  };

  return (
    <>
      <Card className={`transition-all ${
        isCompleted 
          ? 'border-green-500/50 bg-green-500/5' 
          : 'border-zinc-800 hover:border-zinc-700'
      }`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={handleToggle}
                  disabled={isLoading}
                  className="mt-1 cursor-pointer"
                />
                <CardTitle 
                  className={`text-xl cursor-pointer hover:text-blue-400 transition-colors ${
                    isCompleted ? 'text-green-400' : ''
                  }`}
                  onClick={handleViewSubmissions}
                >
                  {problem.order && <span className="text-muted-foreground mr-2">{problem.order}.</span>}
                  {problem.name}
                  {problem.isRecommended && <span className="ml-2">⭐</span>}
                  {isCompleted && <span className="ml-2">✓</span>}
                </CardTitle>
              </div>
              <CardDescription>{problem.description}</CardDescription>
            </div>
            <Badge className={difficultyColors[problem.difficulty]}>
              {problem.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Show first 5 completed users */}
          {problem.completedBy && problem.completedBy.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Completed by:</span>
              {problem.completedBy.slice(0, 5).map((user, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-green-500/10 text-green-400 border-green-500/20 text-xs"
                >
                  {user.username}
                </Badge>
              ))}
              {problem.completedBy.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{problem.completedBy.length - 5} more
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{problem.createdBy.username}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2"
              >
                <a href={problem.externalLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View Problem</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitDialogOpen(true)}
                className="gap-2 cursor-pointer"
              >
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Submit Code</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewSubmissions}
                className="gap-2 cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">View Solutions</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Code Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Your Code</DialogTitle>
            <DialogDescription>
              Submit your solution for: {problem.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
                <option value="c">C</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Your Code</Label>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={15}
                className="font-mono text-sm bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any notes about your solution..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCode} disabled={submitting || !code.trim()}>
              {submitting ? 'Submitting...' : 'Submit Code'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

