'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProblemCard } from '@/components/problem-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Problem {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  externalLink: string;
  order: number;
  isRecommended: boolean;
  isCompleted: boolean;
  createdBy: {
    id: string;
    username: string;
  };
}

export default function TopicProblemsPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [externalLink, setExternalLink] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [order, setOrder] = useState(0);
  const [isRecommended, setIsRecommended] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchProblems = async () => {
    try {
      const response = await fetch(`/api/topics/${topicId}/problems`);
      const data = await response.json();
      
      if (response.ok) {
        setProblems(data.problems);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
    fetchCurrentUser();
  }, [topicId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok) {
        setCurrentUserId(data.user.id);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove problem from local state
        setProblems(problems.filter(p => p.id !== problemId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete problem');
      }
    } catch (error) {
      console.error('Failed to delete problem:', error);
      alert('An error occurred while deleting the problem');
    }
  };

  const handleToggleComplete = async (problemId: string) => {
    const response = await fetch('/api/completions/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId }),
    });

    if (response.ok) {
      fetchProblems();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const response = await fetch(`/api/topics/${topicId}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          difficulty,
          tags,
          externalLink,
          order: order || problems.length + 1,
          isRecommended,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || 'Failed to create problem');
        setFormLoading(false);
        return;
      }

      // Reset form
      setName('');
      setDescription('');
      setDifficulty('Easy');
      setTags([]);
      setExternalLink('');
      setOrder(0);
      setIsRecommended(false);
      setTagInput('');
      setDialogOpen(false);
      fetchProblems();
    } catch (err) {
      setFormError('An error occurred. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const completedCount = problems.filter((p) => p.isCompleted).length;
  const progressPercent = problems.length > 0 ? Math.round((completedCount / problems.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Problems</h1>
          <p className="text-muted-foreground mt-1">
            {completedCount} / {problems.length} completed ({progressPercent}%)
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Problem</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Problem</DialogTitle>
              <DialogDescription>
                Add a coding problem to this topic
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                {formError && (
                  <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-md">
                    {formError}
                  </div>
                )}
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Problem Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Two Sum"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-zinc-900 border-zinc-800"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      placeholder="Brief description (optional)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Order</Label>
                    <Input
                      id="order"
                      type="number"
                      placeholder="1"
                      value={order || ''}
                      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                      className="bg-zinc-900 border-zinc-800"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="externalLink">External Link *</Label>
                    <Input
                      id="externalLink"
                      type="url"
                      placeholder="https://codeforces.com/..."
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      required
                      className="bg-zinc-900 border-zinc-800"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="e.g., Array"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="bg-zinc-900 border-zinc-800"
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline" className="shrink-0">
                        Add
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      id="isRecommended"
                      checked={isRecommended}
                      onChange={(e) => setIsRecommended(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="isRecommended" className="cursor-pointer">
                      Mark as recommended ⭐
                    </Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Adding...' : 'Add Problem'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Plus className="h-16 w-16 text-blue-400" />
            </div>
          </div>
          <p className="text-xl font-semibold mb-2">No problems yet</p>
          <p className="text-muted-foreground mb-4">
            Add your first problem to this topic
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteProblem}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

