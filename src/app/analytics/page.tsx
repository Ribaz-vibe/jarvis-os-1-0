"use client";

import React from 'react';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { 
  BarChart3, 
  Activity, 
  TrendingUp,
  BrainCircuit,
  Flame,
  Swords
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Area,
  AreaChart
} from 'recharts';

export default function AnalyticsPage() {
  const { xp, level, streak, stats } = useUserStore();

  // Basic simulation of history based on current total XP 
  // (In a full app, this would query an xp_history table)
  const base = Math.max(0, xp - 300);
  const completedHabitsToday = useUserStore.getState().habits.filter(h => h.completedToday).length;

  const weeklyData = [
    { name: 'Seg', xp: base + 50, habits: 3 },
    { name: 'Ter', xp: base + 100, habits: 5 },
    { name: 'Qua', xp: base + 150, habits: 4 },
    { name: 'Qui', xp: base + 200, habits: 6 },
    { name: 'Sex', xp: base + 220, habits: 3 },
    { name: 'Sáb', xp: base + 280, habits: 7 },
    { name: 'Hoje', xp: xp, habits: completedHabitsToday },
  ];

  const radarData = [
    { subject: 'Força', A: stats.strength, fullMark: 20 },
    { subject: 'Disciplina', A: stats.discipline, fullMark: 20 },
    { subject: 'Consistência', A: stats.consistency, fullMark: 20 },
    { subject: 'Foco', A: stats.focus, fullMark: 20 },
    { subject: 'Recuperação', A: stats.recovery, fullMark: 20 },
    { subject: 'Cardio', A: stats.cardio, fullMark: 20 },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            <BarChart3 className="text-primary" size={36} />
            Analytics
          </h1>
          <p className="text-slate-400">Métricas de performance e evolução do seu avatar (você).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard className="flex items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Activity className="text-primary" size={32} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Nível Atual</div>
            <div className="text-3xl font-black text-white">{level}</div>
          </div>
        </DashboardCard>

        <DashboardCard className="flex items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <Flame className="text-orange-500" size={32} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Streak Global</div>
            <div className="text-3xl font-black text-white">{streak} Dias</div>
          </div>
        </DashboardCard>

        <DashboardCard className="flex items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <BrainCircuit className="text-purple-500" size={32} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">XP Total</div>
            <div className="text-3xl font-black text-white">{xp}</div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Evolução Semanal (XP)" className="h-[400px]">
          <div className="h-full w-full pt-4 pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Radar de Atributos" className="h-[400px]">
          <div className="h-full w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                <Radar
                  name="Você"
                  dataKey="A"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

    </div>
  );
}
