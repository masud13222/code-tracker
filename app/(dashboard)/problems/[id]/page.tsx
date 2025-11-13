'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Code, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Submission {
  id: string;
  code: string;
  language: string;
  notes: string;
  submittedAt: Date;
  user: {
    id: string;
    username: string;
  };
  isCompleted: boolean;
  isCurrentUser: boolean;
}

interface Problem {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  externalLink: string;
}

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ProblemSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editLanguage, setEditLanguage] = useState('cpp');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [problemId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/submissions/${problemId}`);
      const data = await response.json();
      
      if (response.ok) {
        setSubmissions(data.submissions);
        if (data.problem) {
          setProblem(data.problem);
        }
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (submission: Submission) => {
    setEditingId(submission.id);
    setEditCode(submission.code);
    setEditLanguage(submission.language);
    setEditNotes(submission.notes || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCode('');
    setEditLanguage('cpp');
    setEditNotes('');
  };

  const handleSaveEdit = async (submissionId: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/submissions/${problemId}/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editCode,
          language: editLanguage,
          notes: editNotes,
        }),
      });

      if (response.ok) {
        await fetchData();
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Failed to update submission:', error);
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Submissions</h1>
          {problem && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted-foreground">{problem.name}</span>
              <Badge className={difficultyColors[problem.difficulty]}>
                {problem.difficulty}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Code className="h-16 w-16 text-blue-400" />
            </div>
          </div>
          <p className="text-xl font-semibold mb-2">No submissions yet</p>
          <p className="text-muted-foreground mb-4">
            Be the first to submit a solution!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card 
              key={submission.id} 
              className={`border-zinc-800 ${
                submission.isCurrentUser ? 'border-blue-500/50 bg-blue-500/5' : ''
              }`}
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <User className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="font-semibold text-lg">{submission.user.username}</span>
                    </div>
                    {submission.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {submission.language.toUpperCase()}
                    </Badge>
                    {submission.isCompleted && (
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingId === submission.id ? (
                  // Edit mode
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-language">Language</Label>
                      <select
                        id="edit-language"
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
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
                      <Label htmlFor="edit-code">Your Code</Label>
                      <Textarea
                        id="edit-code"
                        placeholder="Paste your code here..."
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        rows={15}
                        className="font-mono text-sm bg-zinc-900 border-zinc-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-notes">Notes (optional)</Label>
                      <Textarea
                        id="edit-notes"
                        placeholder="Any notes about your solution..."
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={3}
                        className="bg-zinc-900 border-zinc-800"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleSaveEdit(submission.id)}
                        disabled={saving || !editCode.trim()}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-muted-foreground">
                          Solution Code:
                        </Label>
                        {submission.isCurrentUser && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(submission)}
                            className="gap-2 h-8"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                      </div>
                      <div className="relative">
                        <pre className="p-4 bg-zinc-950 rounded-lg overflow-x-auto text-sm border border-zinc-800 max-h-96 overflow-y-auto">
                          <code className="text-zinc-300">{submission.code}</code>
                        </pre>
                      </div>
                    </div>
                    {submission.notes && (
                      <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          Notes:
                        </Label>
                        <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                          {submission.notes}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

