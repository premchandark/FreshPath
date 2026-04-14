import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap,
  Github,
  Twitter,
  Linkedin,
  LogOut,
  Trophy,
  LogIn,
  Search,
  ChevronRight,
  Mail
} from 'lucide-react';
import { RoleSelector } from './components/RoleSelector';
import { RoadmapDisplay } from './components/RoadmapDisplay';
import { generateRoadmap, RoleRoadmap } from './services/gemini';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { auth, signInWithGoogle, logout, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function App() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<RoleRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const handleTaskComplete = async (taskId: string, points: number) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        solvedTasks: arrayUnion(taskId),
        points: increment(points)
      });
      // Refresh local profile
      const userSnap = await getDoc(userRef);
      setUserProfile(userSnap.data());
    }
  };

  const reset = () => {
    setSelectedRole(null);
    setRoadmap(null);
  };

  const isFirstCourse = userProfile?.completedRoles?.length === 0 || !userProfile;

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
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                  <Trophy className="w-3 h-3" />
                  {userProfile?.points || 0} pts
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button onClick={() => signInWithGoogle()} className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
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
                  The Rat Race Ends Here
                </motion.div>
                
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
                  Your First Step to a <br />
                  <span className="text-primary">Better Career.</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Struggling to choose? We align your interests with industry-ready paths. 
                  Learn, practice, and get certified with real-world projects.
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
                <RoadmapDisplay 
                  roadmap={roadmap} 
                  userPoints={userProfile?.points || 0}
                  onTaskComplete={handleTaskComplete}
                  isFirstCourse={isFirstCourse}
                />
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
