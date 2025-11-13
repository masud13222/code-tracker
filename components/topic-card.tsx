'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronRight,
  Code2, 
  Database, 
  GitBranch, 
  Binary, 
  Brain, 
  Layers, 
  Network, 
  Cpu, 
  Blocks,
  Repeat,
  LucideIcon
} from 'lucide-react';

interface TopicCardProps {
  topic: {
    id: string;
    name: string;
    description: string;
    icon: string;
    totalProblems: number;
    completedProblems: number;
    progress: number;
  };
}

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Database,
  GitBranch,
  Binary,
  Brain,
  Layers,
  Network,
  Cpu,
  Blocks,
  Repeat,
};

export function TopicCard({ topic }: TopicCardProps) {
  const IconComponent = ICON_MAP[topic.icon] || Code2;
  return (
    <Link href={`/topics/${topic.id}`}>
      <Card className="border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <IconComponent className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl group-hover:text-blue-400 transition-colors">
                  {topic.name}
                </CardTitle>
                <CardDescription className="mt-1">{topic.description}</CardDescription>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {topic.completedProblems} / {topic.totalProblems}
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
              style={{ width: `${topic.progress}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground text-right">
            {topic.progress}% complete
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

