import React, { useState, useEffect } from 'react';
import { StickyNote, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';

export function NotePad({ role }: { role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const storageKey = `freshpath_notes_${role.toLowerCase().replace(/\s+/g, '_')}`;

  useEffect(() => {
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote) setNote(savedNote);
  }, [storageKey]);

  const saveNote = () => {
    localStorage.setItem(storageKey, note);
  };

  const clearNote = () => {
    if (confirm('Are you sure you want to clear your notes?')) {
      setNote('');
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <StickyNote className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 z-50"
          >
            <Card className="shadow-2xl border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-primary" />
                  Notes: {role}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Take notes here..."
                  className="w-full h-64 p-3 text-sm bg-muted/50 rounded-md border focus:ring-2 focus:ring-primary outline-none resize-none font-sans"
                />
                <div className="flex justify-between gap-2">
                  <Button variant="outline" size="sm" onClick={clearNote} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button size="sm" onClick={saveNote}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
