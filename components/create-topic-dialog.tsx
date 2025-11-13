'use client';

import { useState } from 'react';
import { 
  Plus, 
  Code2, 
  Database, 
  GitBranch, 
  Binary, 
  Brain, 
  Layers, 
  Network, 
  Cpu, 
  Blocks,
  Repeat
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateTopicDialogProps {
  onTopicCreated: () => void;
}

const ICON_OPTIONS = [
  { icon: Code2, name: 'Code2', label: 'Basics' },
  { icon: Database, name: 'Database', label: 'Data Structures' },
  { icon: GitBranch, name: 'GitBranch', label: 'Graph Theory' },
  { icon: Binary, name: 'Binary', label: 'Number Theory' },
  { icon: Brain, name: 'Brain', label: 'Algorithms' },
  { icon: Layers, name: 'Layers', label: 'Combinatorics' },
  { icon: Network, name: 'Network', label: 'Networks' },
  { icon: Cpu, name: 'Cpu', label: 'Dynamic Programming' },
  { icon: Blocks, name: 'Blocks', label: 'Strings' },
  { icon: Repeat, name: 'Repeat', label: 'Recursion' },
];

export function CreateTopicDialog({ onTopicCreated }: CreateTopicDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Code2');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          icon: selectedIcon,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create topic');
        setLoading(false);
        return;
      }

      setName('');
      setDescription('');
      setSelectedIcon('Code2');
      setOpen(false);
      onTopicCreated();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Topic
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription>
            Add a new topic/category for organizing problems
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setSelectedIcon(option.name)}
                      title={option.label}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center ${
                        selectedIcon === option.name
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Topic Name</Label>
              <Input
                id="name"
                placeholder="e.g., Data Structures, Graph Theory"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of this topic"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

