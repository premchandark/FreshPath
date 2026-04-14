import React from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Database, 
  BrainCircuit, 
  Layout, 
  Server, 
  ShieldCheck, 
  Smartphone, 
  Cloud,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const roles = [
  {
    id: 'sde',
    title: 'Software Development Engineer',
    description: 'Build robust applications and systems using modern programming languages.',
    icon: Code2,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Design and manage server-side logic, databases, and APIs.',
    icon: Server,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Create beautiful, interactive user interfaces and web experiences.',
    icon: Layout,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  {
    id: 'data-analytics',
    title: 'Data Analyst',
    description: 'Transform raw data into meaningful insights and visualizations.',
    icon: Database,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    id: 'ai-ml',
    title: 'AI/ML Engineer',
    description: 'Build intelligent systems and predictive models using machine learning.',
    icon: BrainCircuit,
    color: 'text-rose-500',
    bg: 'bg-rose-50'
  },
  {
    id: 'mobile',
    title: 'Mobile App Developer',
    description: 'Develop native or cross-platform apps for iOS and Android.',
    icon: Smartphone,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50'
  },
  {
    id: 'cloud',
    title: 'Cloud Engineer',
    description: 'Architect and manage scalable infrastructure on AWS, Azure, or GCP.',
    icon: Cloud,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    description: 'Protect systems and networks from digital attacks and vulnerabilities.',
    icon: ShieldCheck,
    color: 'text-slate-500',
    bg: 'bg-slate-50'
  }
];

interface RoleSelectorProps {
  onSelect: (role: string) => void;
}

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {roles.map((role, index) => (
        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer h-full border-2 hover:border-primary transition-colors group"
            onClick={() => onSelect(role.title)}
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl ${role.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <role.icon className={`w-6 h-6 ${role.color}`} />
              </div>
              <CardTitle className="text-xl">{role.title}</CardTitle>
              <CardDescription className="line-clamp-2">{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Start Learning <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
