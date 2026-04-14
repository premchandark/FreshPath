import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Rocket, 
  BookOpen, 
  Zap, 
  ChevronRight,
  Code,
  Terminal,
  Award,
  ArrowRight,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { RoleRoadmap, CourseModule } from '../services/gemini';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CodePlayground } from './CodePlayground';
import { NotePad } from './NotePad';
import { Certificate } from './Certificate';

interface RoadmapDisplayProps {
  roadmap: RoleRoadmap;
}

export function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  const [isCertified, setIsCertified] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 relative">
      <NotePad role={roadmap.role} />
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <Badge variant="outline" className="px-3 py-1 text-sm font-mono uppercase tracking-wider">
          Learning Path
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {roadmap.role}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          {roadmap.overview}
        </p>
      </motion.div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="basics">1. Basics</TabsTrigger>
          <TabsTrigger value="advanced">2. Advanced</TabsTrigger>
          <TabsTrigger value="playground">3. Practice</TabsTrigger>
          <TabsTrigger value="project">4. Project</TabsTrigger>
          <TabsTrigger value="certification">5. Certification</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.basics.map((module, idx) => (
              <ModuleCard key={idx} module={module} index={idx} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.advanced.map((module, idx) => (
              <ModuleCard key={idx} module={module} index={idx} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playground" className="mt-6">
          <CodePlayground />
        </TabsContent>

        <TabsContent value="project" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Card className="border-2 border-primary/20 overflow-hidden">
              <div className="bg-primary/5 p-8 border-b border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {roadmap.project.difficulty}
                  </Badge>
                  <Rocket className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold mb-2">{roadmap.project.title}</h2>
                <p className="text-lg text-muted-foreground">{roadmap.project.description}</p>
              </div>
              <CardContent className="p-8 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" />
                        Step-by-Step Implementation
                      </h3>
                      <div className="space-y-6">
                        {roadmap.project.detailedSteps.map((step, i) => (
                          <div key={i} className="relative pl-10 pb-6 border-l-2 border-muted last:border-0 last:pb-0">
                            <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center text-[10px] font-bold">
                              {i + 1}
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-bold text-lg">{step.title}</h4>
                              <p className="text-muted-foreground text-sm leading-relaxed">{step.instruction}</p>
                              {step.codeSnippet && (
                                <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto">
                                  <code className="text-xs text-emerald-400 font-mono whitespace-pre">
                                    {step.codeSnippet}
                                  </code>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-muted/30 border-none">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          Tech Stack
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {roadmap.project.technologies.map((tech, i) => (
                          <Badge key={i} variant="secondary">{tech}</Badge>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 space-y-4">
                      <Lightbulb className="w-8 h-8 text-primary" />
                      <h3 className="font-bold">Pro Tip</h3>
                      <p className="text-sm text-muted-foreground">
                        Don't just copy the code. Try to understand why each line is there. 
                        Use the Playground tab to test small parts of the code!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-8 h-8 text-amber-500" />
                  <Badge variant="outline" className="border-amber-500 text-amber-600">Final Task</Badge>
                </div>
                <CardTitle className="text-2xl">Capstone Challenge: {roadmap.project.capstoneTask.title}</CardTitle>
                <CardDescription className="text-base">{roadmap.project.capstoneTask.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest">Requirements to Pass:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roadmap.project.capstoneTask.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm bg-background p-3 rounded-lg border">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div className="flex flex-col items-center text-center space-y-4 py-4">
                  <p className="text-sm text-muted-foreground max-w-md">
                    Once you've completed the capstone task, click the button below to verify your 
                    completion and generate your professional certificate.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-amber-500 hover:bg-amber-600 text-white px-12"
                    onClick={() => setIsCertified(true)}
                  >
                    Complete & Get Certified
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="certification" className="mt-6">
          <AnimatePresence mode="wait">
            {!isCertified ? (
              <motion.div
                key="not-certified"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 p-12 bg-muted/20 rounded-2xl border-2 border-dashed"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Certification Locked</h3>
                  <p className="text-muted-foreground max-w-md">
                    You need to complete the Guided Project and the Capstone Challenge 
                    to unlock your certificate for {roadmap.role}.
                  </p>
                </div>
                <Button variant="outline" onClick={() => document.querySelector('[value="project"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}>
                  Go to Project
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="certified"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                    <Award className="w-4 h-4" />
                    Verified Achievement
                  </div>
                  <h2 className="text-4xl font-bold">Congratulations!</h2>
                  <p className="text-muted-foreground">
                    You have mastered the fundamentals of {roadmap.role}. 
                    Here is your official certificate of completion.
                  </p>
                </div>
                <Certificate 
                  name="" 
                  role={roadmap.role} 
                  date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ModuleCardProps {
  module: CourseModule;
  index: number;
  isBasics?: boolean;
  key?: React.Key;
}

function ModuleCard({ module, index, isBasics = true }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isBasics ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">MODULE {index + 1}</span>
          </div>
          <CardTitle className="text-xl">{module.title}</CardTitle>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="topics" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="text-sm font-semibold">What you'll learn</span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 mt-2">
                  {module.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Circle className="w-1.5 h-1.5 fill-primary text-primary" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="concepts" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="text-sm font-semibold">Key Concepts</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  {module.keyConcepts.map((concept, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] font-mono">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
