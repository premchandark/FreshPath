import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { RoleSelector } from './components/RoleSelector';
import { RoadmapDisplay } from './components/RoadmapDisplay';
import { generateRoadmap, RoleRoadmap } from './services/gemini';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function App() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<RoleRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = async (role: string) => {
    setSelectedRole(role);
    setIsLoading(true);
    try {
      const data = await generateRoadmap(role);
      setRoadmap(data);
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedRole(null);
    setRoadmap(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">FreshPath</span>
          </div>
          
          <div className="flex items-center gap-4">
            {selectedRole && (
              <Button variant="ghost" size="sm" onClick={reset} className="hidden sm:flex">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change Role
              </Button>
            )}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 md:py-24"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                >
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Career Guidance
                </motion.div>
                
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
                  Your Future <br />
                  <span className="text-primary">Starts Here.</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Choosing a career path is hard. We make it easy. Pick a role, get a personalized 
                  learning roadmap, and build your first project today.
                </p>

                <div className="pt-12">
                  <div className="flex items-center justify-center gap-4 mb-12">
                    <Separator className="w-12" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Choose Your Path
                    </span>
                    <Separator className="w-12" />
                  </div>
                  <RoleSelector onSelect={handleRoleSelect} />
                </div>
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">Generating your roadmap...</h2>
              <p className="text-muted-foreground max-w-md">
                Our AI is crafting a personalized learning path for <span className="text-primary font-semibold">{selectedRole}</span>. 
                This will include basics, advanced tools, and a unique project.
              </p>
            </motion.div>
          ) : roadmap ? (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Button variant="ghost" onClick={reset} className="mb-8">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Roles
                </Button>
                <RoadmapDisplay roadmap={roadmap} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 mt-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Compass className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg tracking-tight">FreshPath</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Empowering the next generation of software engineers through 
                personalized, AI-driven education and hands-on experience.
              </p>
              <div className="flex gap-4">
                <Github className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                <Twitter className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                <Linkedin className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">Roadmaps</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Projects</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Mentorship</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Pricing</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">About</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Privacy</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Terms</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} FreshPath. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
