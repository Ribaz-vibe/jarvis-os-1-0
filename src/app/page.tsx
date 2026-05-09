"use client";

import React, { useState, useEffect } from 'react';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { useUserStore } from '@/store/userStore';
import { 
  Dumbbell, 
  Brain, 
  Target, 
  Heart, 
  Focus, 
  RotateCcw,
  Plus,
  CheckCircle2,
  Check,
  ArrowUpRight,
  Bot
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Habit {
  id: string;
  title: string;
  category: string;
  xpReward: number;
  completedToday: boolean;
  streak: number;
}

interface CustomCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const defaultCategories: Record<string, { icon: React.ElementType, color: string, bg: string, label: string }> = {
  health: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20', label: 'Saúde' },
  mind: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Mente' },
  work: { icon: Focus, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Trabalho' },
  fitness: { icon: Dumbbell, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20', label: 'Físico' },
};

const iconMap: Record<string, React.ElementType> = {
  Heart, Brain, Focus, Dumbbell
};

export default function Dashboard() {
  const { stats, level } = useUserStore();
  
  // Estado para hábitos do localStorage
  const [habits, setHabits] = useState<Habit[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

  // Carregar do localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('jarvis_habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    const savedCategories = localStorage.getItem('jarvis_custom_categories');
    if (savedCategories) {
      setCustomCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Toggle hábito (marcar/desmarcar)
  const toggleHabit = (id: string) => {
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id === id) {
          return { 
            ...h, 
            completedToday: !h.completedToday,
            streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1)
          };
        }
        return h;
      });
      localStorage.setItem('jarvis_habits', JSON.stringify(updated));
      return updated;
    });
  };

  // Obter config da categoria
  const getCategoryConfig = (categoryId: string) => {
    const defaultCat = defaultCategories[categoryId];
    if (defaultCat) return defaultCat;
    
    const customCat = customCategories.find(c => c.id === categoryId);
    if (customCat) {
      return {
        icon: iconMap[customCat.icon] || Heart,
        color: customCat.color,
        bg: `bg-[${customCat.color}/10] border-[${customCat.color}/20`,
        label: customCat.name
      };
    }
    return defaultCategories.health;
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const totalXp = habits.filter(h => h.completedToday).reduce((acc, h) => acc + h.xpReward, 0);

  const statConfig = [
    { label: 'Strength', value: stats.strength, icon: Dumbbell, color: 'text-red-500' },
    { label: 'Discipline', value: stats.discipline, icon: Target, color: 'text-orange-500' },
    { label: 'Consistency', value: stats.consistency, icon: RotateCcw, color: 'text-green-500' },
    { label: 'Recovery', value: stats.recovery, icon: Heart, color: 'text-pink-500' },
    { label: 'Focus', value: stats.focus, icon: Focus, color: 'text-blue-500' },
    { label: 'Cardio', value: stats.cardio, icon: ArrowUpRight, color: 'text-cyan-500' },
  ];

  const hasStats = stats.strength > 0 || stats.discipline > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column - Stats & Habits */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Status HUD */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statConfig.map((stat, i) => (
            <DashboardCard key={stat.label} delay={i * 0.1} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                  <div className="text-xl font-mono font-bold">{stat.value}</div>
                </div>
              </div>
              <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-current ${stat.color} opacity-50`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / 20) * 100}%` }}
                />
              </div>
            </DashboardCard>
          ))}
        </div>

        {/* AI Insight Bar - only show if has data */}
        {level > 0 ? (
          <DashboardCard delay={0.4} className="bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="text-primary neon-text-purple" size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary mb-1">Jarvis Insight</h4>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "Você teve uma consistência incrível nos últimos 3 dias. Se completar o treino de hoje, você atingirá um novo recorde de streak. Foco na Strength hoje!"
                </p>
              </div>
            </div>
          </DashboardCard>
        ) : (
          <DashboardCard delay={0.4} className="bg-slate-800/50 border-slate-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <Bot className="text-slate-400" size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-400 mb-1">Bem-vindo ao Jarvis OS!</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Complete tarefas, marque hábitos e faça treinos para ganhar XP e subir de nível. Explore as abas para começar!
                </p>
              </div>
            </div>
          </DashboardCard>
        )}

        {/* Recent Activity / Agenda Preview */}
        <DashboardCard title="Próximos Objetivos" delay={0.5}>
          <div className="space-y-4">
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">Nenhum objetivo agendado</p>
              <p className="text-xs text-slate-600 mt-1">Use a Agenda para criar</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Right Column - Tasks & Quick Actions */}
      <div className="space-y-8">
        
{/* Daily Tasks - connected to Habits */}
        <DashboardCard title="Tarefas do Dia" delay={0.2} className="h-full">
          <div className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">Nenhuma tarefa hoje</p>
                <p className="text-xs text-slate-600 mt-1">Use Hábitos para criar</p>
              </div>
            ) : (
              habits.map((habit) => {
                const config = getCategoryConfig(habit.category);
                const Icon = config.icon;
                
                return (
                  <div 
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      habit.completedToday 
                        ? "bg-primary border-primary text-white" 
                        : "border-white/20 group-hover:border-primary"
                    )}>
                      {habit.completedToday && <Check size={14} />}
                    </div>
                    <div className="flex-1">
                      <span className={cn(
                        "text-sm",
                        habit.completedToday ? "text-slate-500 line-through" : "text-slate-300"
                      )}>
                        {habit.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={config.color} />
                      <span className={cn("text-xs font-bold", config.color)}>
                        +{habit.xpReward} XP
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            
            {habits.length > 0 && (
              <div className="pt-4 mt-4 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{completedCount}/{habits.length} completas</span>
                  <span className="text-primary font-bold">+{totalXp} XP hoje</span>
                </div>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Quick Stats Summary */}
        <DashboardCard title="Sessão Atual" delay={0.6}>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tempo em Foco</div>
                <div className="text-3xl font-mono font-bold neon-text-cyan">00:00:00</div>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Brain size={24} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">XP Ganho Hoje</div>
                <div className="text-xl font-bold text-primary">+{totalXp}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tarefas Concluídas</div>
                <div className="text-xl font-bold text-accent">{completedCount}</div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
