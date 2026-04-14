import React from 'react';
import { motion } from 'motion/react';
import { Award, Download, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CertificateProps {
  name: string;
  role: string;
  date: string;
}

export function Certificate({ name, role, date }: CertificateProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-4xl mx-auto aspect-[1.414/1] bg-white text-slate-900 p-12 border-[16px] border-double border-primary/20 shadow-2xl overflow-hidden"
      >
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative h-full border-2 border-primary/10 p-8 flex flex-col items-center justify-between text-center">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <Award className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Certificate of Completion</h1>
            <p className="text-slate-500 font-serif italic">This is to certify that</p>
            <h2 className="text-5xl font-serif font-bold text-slate-800 border-b-2 border-slate-200 pb-2 inline-block px-8">
              {name || "Valued Student"}
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-lg leading-relaxed max-w-2xl">
              Has successfully completed the comprehensive professional roadmap for 
              <span className="font-bold text-primary block text-2xl mt-2">{role}</span>
            </p>
            <p className="text-slate-500 text-sm">
              Demonstrating proficiency in core fundamentals, advanced tools, and 
              successfully delivering the final Capstone Project.
            </p>
          </div>

          <div className="w-full flex justify-between items-end pt-8">
            <div className="text-left">
              <div className="font-serif font-bold text-slate-800 border-b border-slate-300 w-48 mb-1">
                FreshPath AI
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Authorized Issuer</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 border-4 border-primary/20 rounded-full flex items-center justify-center mb-2">
                <ShieldCheck className="w-10 h-10 text-primary/40" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Verified Badge</p>
            </div>

            <div className="text-right">
              <div className="font-serif font-bold text-slate-800 border-b border-slate-300 w-48 mb-1">
                {date}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Date of Achievement</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button className="gap-2">
          <Share2 className="w-4 h-4" />
          Share Achievement
        </Button>
      </div>
    </div>
  );
}
