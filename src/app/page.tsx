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
  const { stats } = useUserStore();

  const statConfig = [
    { label: 'Strength', value: stats.strength, icon: Dumbbell, color: 'text-red-500' },
    { label: 'Discipline', value: stats.discipline, icon: Target, color: 'text-orange-500' },
    { label: 'Consistency', value: stats.consistency, icon: RotateCcw, color: 'text-green-500' },
    { label: 'Recovery', value: stats.recovery, icon: Heart, color: 'text-pink-500' },
    { label: 'Focus', value: stats.focus, icon: Focus, color: 'text-blue-500' },
    { label: 'Cardio', value: stats.cardio, icon: ArrowUpRight, color: 'text-cyan-500' },
  ];

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

        {/* AI Insight Bar */}
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

        {/* Recent Activity / Agenda Preview */}
        <DashboardCard title="Próximos Objetivos" delay={0.5}>
          <div className="space-y-4">
            {[
              { title: 'Treino de Pernas (Strength)', time: '14:00', type: 'workout' },
              { title: 'Reunião de Projeto', time: '16:30', type: 'work' },
              { title: 'Leitura: 20 páginas', time: '21:00', type: 'habit' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    {item.time}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{item.title}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-tighter">{item.type}</div>
                  </div>
                </div>
                <ArrowUpRight size={18} className="text-slate-600 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Right Column - Tasks & Quick Actions */}
      <div className="space-y-8">
        
        {/* Daily Tasks */}
        <DashboardCard title="Tarefas do Dia" delay={0.2} className="h-full">
          <div className="space-y-4">
            {[
              { task: 'Finalizar UI do Dashboard', done: true },
              { task: 'Registrar treino de ontem', done: false },
              { task: 'Organizar Workspace', done: false },
              { task: 'Beber 3L de água', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  item.done ? 'bg-primary border-primary text-white' : 'border-white/20 group-hover:border-primary'
                }`}>
                  {item.done && <CheckCircle2 size={12} />}
                </div>
                <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                  {item.task}
                </span>
              </div>
            ))}
            
            <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-slate-500 hover:text-primary group">
              <Plus size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Adicionar Tarefa</span>
            </button>
          </div>
        </DashboardCard>

        {/* Quick Stats Summary */}
        <DashboardCard title="Sessão Atual" delay={0.6}>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tempo em Foco</div>
                <div className="text-3xl font-mono font-bold neon-text-cyan">02:45:12</div>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Brain size={24} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">XP Ganho Hoje</div>
                <div className="text-xl font-bold text-primary">+450</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rank Semanal</div>
                <div className="text-xl font-bold text-accent">#04</div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
