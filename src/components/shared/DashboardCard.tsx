"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  delay?: number;
}

export const DashboardCard = ({ children, title, className, delay = 0 }: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("glass-card rounded-2xl p-6 relative overflow-hidden group", className)}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            {title}
          </h3>
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,1)]" />
        </div>
      )}
      
      {children}
    </motion.div>
  );
};
