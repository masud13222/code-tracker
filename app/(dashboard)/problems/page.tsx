'use client';

import { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { TopicCard } from '@/components/topic-card';
import { CreateTopicDialog } from '@/components/create-topic-dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  totalProblems: number;
  completedProblems: number;
  progress: number;
}

export default function ProblemsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topics');
      const data = await response.json();
      
      if (response.ok) {
        setTopics(data.topics);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Topics & Problems</h1>
          <p className="text-muted-foreground mt-1">
            Browse topics and solve coding problems with your team
          </p>
        </div>
        <CreateTopicDialog onTopicCreated={fetchTopics} />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Code2 className="h-16 w-16 text-blue-400" />
            </div>
          </div>
          <p className="text-xl font-semibold mb-2">No topics yet</p>
          <p className="text-muted-foreground mb-4">
            Create your first topic to organize problems
          </p>
          <CreateTopicDialog onTopicCreated={fetchTopics} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}

