"use client";

import React from 'react';
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
  ArrowUpRight,
  Bot
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { stats, level, habits } = useUserStore();

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
        
{/* Daily Tasks */}
        <DashboardCard title="Tarefas do Dia" delay={0.2} className="h-full">
          <div className="space-y-4">
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">Nenhuma tarefa hoje</p>
              <p className="text-xs text-slate-600 mt-1">Use Hábitos para criar</p>
            </div>
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
                <div className="text-xl font-bold text-primary">+0</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tarefas Concluídas</div>
                <div className="text-xl font-bold text-accent">0</div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
