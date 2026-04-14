import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, Code2, Info, Lightbulb, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PracticeTask } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface PracticeLabProps {
  tasks: PracticeTask[];
  onComplete: (taskId: string, points: number) => void;
}

export function PracticeLab({ tasks, onComplete }: PracticeLabProps) {
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [code, setCode] = useState(tasks[0]?.initialCode || '');
  const [output, setOutput] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const activeTask = tasks[activeTaskIndex];

  const runCode = () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
      originalLog(...args);
    };

    try {
      // Basic validation for "solving" - in a real app, we'd run tests
      // For now, we'll simulate success if the code contains certain keywords or runs without error
      // eslint-disable-next-line no-eval
      eval(code);
      setOutput(logs.length > 0 ? logs : ["Code executed successfully!"]);
      
      // Simple heuristic for "solved"
      if (code.length > activeTask.initialCode.length + 10) {
        setIsSolved(true);
      }
    } catch (err) {
      setOutput([`Error: ${err instanceof Error ? err.message : String(err)}`]);
      setIsSolved(false);
    } finally {
      console.log = originalLog;
    }
  };

  const handleNext = () => {
    if (activeTaskIndex < tasks.length - 1) {
      const nextIndex = activeTaskIndex + 1;
      setActiveTaskIndex(nextIndex);
      setCode(tasks[nextIndex].initialCode);
      setOutput([]);
      setShowHint(false);
      setIsSolved(false);
    }
  };

  const handleSolve = () => {
    onComplete(activeTask.id, activeTask.points);
    handleNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Task Description */}
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={activeTask.difficulty === 'Easy' ? 'secondary' : activeTask.difficulty === 'Medium' ? 'outline' : 'destructive'}>
                  {activeTask.difficulty}
                </Badge>
                <div className="flex items-center text-amber-500 font-bold text-sm">
                  <Trophy className="w-4 h-4 mr-1" />
                  {activeTask.points} pts
                </div>
              </div>
              <CardTitle className="text-xl">{activeTask.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{activeTask.description}</p>
              
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1 flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  Real World Example
                </h4>
                <p className="text-xs italic">{activeTask.realWorldExample}</p>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={() => setShowHint(!showHint)}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHint ? "Hide Hint" : "Need a Hint?"}
              </Button>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      {activeTask.hint}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
              Task {activeTaskIndex + 1} of {tasks.length}
            </div>
            <div className="flex gap-1">
              {tasks.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 flex-1 rounded-full transition-colors ${i === activeTaskIndex ? 'bg-primary' : i < activeTaskIndex ? 'bg-emerald-500' : 'bg-muted'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="md:w-2/3">
          <Card className="border-2 overflow-hidden h-[500px] flex flex-col">
            <CardHeader className="bg-muted/50 border-b py-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold">Practice Lab</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCode(activeTask.initialCode)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={runCode}>
                    <Play className="w-4 h-4 mr-2" />
                    Run Code
                  </Button>
                </div>
              </div>
            </CardHeader>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
              <div className="border-r flex flex-col">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 p-4 font-mono text-sm bg-background outline-none resize-none"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col bg-slate-950 text-slate-50">
                <div className="bg-slate-900 px-4 py-1 text-[10px] font-mono uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                  <span>Console Output</span>
                </div>
                <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                  {output.length === 0 ? (
                    <span className="text-slate-500 italic">Run your code to see results...</span>
                  ) : (
                    output.map((line, i) => (
                      <div key={i} className={line.startsWith('Error:') ? 'text-rose-400' : 'text-emerald-400'}>
                        <span className="text-slate-600 mr-2">›</span>
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {isSolved && (
              <div className="bg-emerald-500 text-white p-3 flex items-center justify-between animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center font-bold">
                  <Trophy className="w-5 h-5 mr-2" />
                  Great job! You solved it!
                </div>
                <Button size="sm" variant="secondary" onClick={handleSolve}>
                  Claim {activeTask.points} Points & Next
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
