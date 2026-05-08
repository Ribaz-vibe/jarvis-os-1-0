"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore, HabitCategory } from '@/store/userStore';
import { 
  Heart, 
  Brain, 
  Briefcase, 
  Dumbbell, 
  Check, 
  Plus, 
  Flame,
  Trophy,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardCard } from '@/components/shared/DashboardCard';

const categoryConfig: Record<HabitCategory, { icon: React.ElementType, color: string, bg: string, label: string }> = {
  health: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20', label: 'Saúde' },
  mind: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Mente' },
  work: { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Trabalho' },
  fitness: { icon: Dumbbell, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20', label: 'Físico' },
};

export default function HabitosPage() {
  const { habits, toggleHabit, addXp } = useUserStore();
  const [filter, setFilter] = useState<HabitCategory | 'all'>('all');

  const filteredHabits = filter === 'all' ? habits : habits.filter(h => h.category === filter);

  const handleToggle = (id: string, xpReward: number, currentlyCompleted: boolean) => {
    toggleHabit(id);
    if (!currentlyCompleted) {
      addXp(xpReward);
      // Play a little sound or vibration if needed in the future
    }
  };

  const progress = habits.length > 0 ? (habits.filter(h => h.completedToday).length / habits.length) * 100 : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Hábitos Diários</h1>
          <p className="text-slate-400">Forje seu caráter através da repetição. Consistência é a chave.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-6 py-3 rounded-xl border border-primary/30 transition-all group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="font-bold">Novo Hábito</span>
        </button>
      </div>

      {/* Progress & Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard className="md:col-span-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
          <div className="relative z-10 flex flex-col justify-center h-full space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Progresso Diário</div>
                <div className="text-3xl font-mono font-black neon-text-purple">
                  {Math.round(progress)}%
                </div>
              </div>
              <Trophy size={32} className="text-primary opacity-80" />
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 relative">
            <Flame className="text-orange-500" size={32} />
            <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1">
              <Zap className="text-yellow-500" size={16} />
            </div>
          </div>
          <div className="text-2xl font-black">12 Dias</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Streak Perfeito</div>
        </DashboardCard>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            "px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap",
            filter === 'all' ? "bg-white text-black" : "bg-white/5 text-slate-400 hover:bg-white/10"
          )}
        >
          Todos
        </button>
        {(Object.keys(categoryConfig) as HabitCategory[]).map(cat => {
          const config = categoryConfig[cat];
          const Icon = config.icon;
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap",
                isActive ? config.bg + " border" : "bg-white/5 text-slate-400 hover:bg-white/10"
              )}
            >
              <Icon size={16} className={isActive ? config.color : ""} />
              <span className={isActive ? config.color : ""}>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredHabits.map((habit, i) => {
            const config = categoryConfig[habit.category];
            const Icon = config.icon;
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                key={habit.id}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                  habit.completedToday 
                    ? "bg-primary/5 border-primary/30" 
                    : "glass-card hover:border-white/20"
                )}
                onClick={() => handleToggle(habit.id, habit.xpReward, habit.completedToday)}
              >
                {habit.completedToday && (
                  <motion.div 
                    layoutId={`bg-${habit.id}`}
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" 
                  />
                )}

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all border",
                      habit.completedToday ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]" : config.bg,
                      !habit.completedToday && config.color
                    )}>
                      {habit.completedToday ? <Check size={24} /> : <Icon size={24} />}
                    </div>
                    
                    <div>
                      <h3 className={cn(
                        "font-bold text-lg transition-colors",
                        habit.completedToday ? "text-white" : "text-slate-200 group-hover:text-white"
                      )}>
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          {config.label}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          +{habit.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame size={16} className={habit.streak > 0 ? "fill-orange-500" : ""} />
                      <span className="font-bold text-sm">{habit.streak}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
