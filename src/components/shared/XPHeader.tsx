"use client";

import React from 'react';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';
import { Trophy, Flame, Bell } from 'lucide-react';

export const XPHeader = () => {
  const { level, xp, maxXp, streak, name } = useUserStore();
  const progress = (xp / maxXp) * 100;

  return (
    <header className="h-20 glass-card border-x-0 border-t-0 fixed top-0 right-0 left-20 md:left-64 z-40 px-8 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-xs text-slate-400 font-medium tracking-[0.2em] uppercase">Setor de Comando</span>
        <h1 className="text-xl font-bold tracking-tight">Bem-vindo, {name}</h1>
      </div>

      <div className="flex items-center gap-8">
        {/* Streak */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
          <Flame size={18} className="text-orange-500 fill-orange-500" />
          <span className="font-bold text-orange-500">{streak}</span>
        </div>

        {/* XP Bar Container */}
        <div className="hidden lg:flex items-center gap-4 w-96">
          <div className="flex flex-col flex-1 gap-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-primary neon-text-purple">Level {level}</span>
              <span className="text-slate-400">{xp} / {maxXp} XP</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center border-primary/30">
            <Trophy size={18} className="text-primary" />
          </div>
        </div>

        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold">
              ADM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
