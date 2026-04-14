import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, Code2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CodePlayground() {
  const [code, setCode] = useState('// Try practicing your logic here\nconst message = "Hello FreshPath!";\nconsole.log(message);\n\n// Example: Sum of numbers\nfunction sum(a, b) {\n  return a + b;\n}\nconsole.log("Sum:", sum(5, 10));');
  const [output, setOutput] = useState<string[]>([]);

  const runCode = () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
      originalLog(...args);
    };

    try {
      // eslint-disable-next-line no-eval
      eval(code);
      setOutput(logs.length > 0 ? logs : ["Code executed successfully (no output)"]);
    } catch (err) {
      setOutput([`Error: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      console.log = originalLog;
    }
  };

  const reset = () => {
    setCode('// Try practicing your logic here\nconst message = "Hello FreshPath!";\nconsole.log(message);\n\n// Example: Sum of numbers\nfunction sum(a, b) {\n  return a + b;\n}\nconsole.log("Sum:", sum(5, 10));');
    setOutput([]);
  };

  return (
    <Card className="border-2 overflow-hidden">
      <CardHeader className="bg-muted/50 border-b py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            Interactive Playground
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
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
      <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 h-[400px]">
        <div className="border-r flex flex-col">
          <div className="bg-muted/30 px-4 py-1 text-[10px] font-mono uppercase tracking-wider border-b flex items-center justify-between">
            <span>Editor (JavaScript)</span>
            <Code2 className="w-3 h-3" />
          </div>
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
            <Terminal className="w-3 h-3" />
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto">
            {output.length === 0 ? (
              <span className="text-slate-500 italic">Click "Run Code" to see output...</span>
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
      </CardContent>
      <div className="bg-primary/5 p-3 flex items-center gap-2 text-xs text-muted-foreground border-t">
        <Info className="w-3 h-3 text-primary" />
        Practice basic logic, algorithms, and syntax here before moving to the project.
      </div>
    </Card>
  );
}
