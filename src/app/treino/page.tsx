"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { 
  Swords, 
  Shield, 
  Zap, 
  Heart, 
  Dumbbell, 
  Activity,
  Play,
  History,
  TrendingUp,
  Target,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TreinoPage() {
  const { stats, addWorkoutLog, addXp, workoutLogs } = useUserStore();
  const [activeQuest, setActiveQuest] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [series, setSeries] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  const quests = [
    {
      id: 1,
      title: "O Despertar do Titã",
      type: "Treino de Força (Peito/Tríceps)",
      difficulty: "Avançado",
      xp: 150,
      duration: "60 min",
      status: "available",
      image: "bg-gradient-to-br from-red-500/20 to-orange-500/5",
      color: "text-red-500",
      border: "border-red-500/30"
    },
    {
      id: 2,
      title: "Resistência Sombria",
      type: "Cardio HITT",
      difficulty: "Intermediário",
      xp: 80,
      duration: "30 min",
      status: "completed",
      image: "bg-gradient-to-br from-cyan-500/20 to-blue-500/5",
      color: "text-cyan-500",
      border: "border-cyan-500/30"
    },
    {
      id: 3,
      title: "Flexibilidade Élfica",
      type: "Mobilidade e Yoga",
      difficulty: "Iniciante",
      xp: 50,
      duration: "20 min",
      status: "locked",
      image: "bg-gradient-to-br from-emerald-500/20 to-green-500/5",
      color: "text-emerald-500",
      border: "border-emerald-500/30"
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            <Swords className="text-primary" size={36} />
            Treino RPG
          </h1>
          <p className="text-slate-400">Suas missões físicas. A cada repetição, seu avatar evolui.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl border border-white/10 transition-all"
          >
            <History size={18} />
            <span className="font-bold text-sm">Histórico</span>
          </button>
          <button className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-5 py-3 rounded-xl border border-primary/30 transition-all">
            <Target size={18} />
            <span className="font-bold text-sm">Criar Missão</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Avatar */}
        <div className="space-y-8">
          <DashboardCard title="Atributos Físicos">
            <div className="space-y-6">
              {/* Fake Radar Chart Alternative */}
              <div className="flex justify-center py-6 relative">
                <div className="w-48 h-48 rounded-full border-2 border-primary/20 flex items-center justify-center relative">
                  <div className="w-32 h-32 rounded-full border border-primary/30 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <Dumbbell size={48} className="text-primary/50" />
                  </div>
                  {/* Nodes */}
                  <div className="absolute -top-3 bg-slate-900 border border-red-500/50 p-2 rounded-full text-red-500"><Swords size={16}/></div>
                  <div className="absolute -bottom-3 bg-slate-900 border border-green-500/50 p-2 rounded-full text-green-500"><Heart size={16}/></div>
                  <div className="absolute -left-3 bg-slate-900 border border-cyan-500/50 p-2 rounded-full text-cyan-500"><Zap size={16}/></div>
                  <div className="absolute -right-3 bg-slate-900 border border-yellow-500/50 p-2 rounded-full text-yellow-500"><Shield size={16}/></div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Força Bruta", val: stats.strength, max: 20, color: "bg-red-500" },
                  { label: "Cardio", val: stats.cardio, max: 20, color: "bg-cyan-500" },
                  { label: "Recuperação", val: stats.recovery, max: 20, color: "bg-green-500" },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm mb-1 font-bold">
                      <span className="text-slate-400">{stat.label}</span>
                      <span>{stat.val} / {stat.max}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.val / stat.max) * 100}%` }}
                        className={`h-full ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Impacto na Semana" className="bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
             <div className="flex items-center gap-4">
               <TrendingUp size={32} className="text-primary" />
               <div>
                 <div className="text-2xl font-black neon-text-purple">+1.240 XP</div>
                 <div className="text-sm text-slate-400 font-bold uppercase tracking-widest">Ganho Físico</div>
               </div>
             </div>
          </DashboardCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {showHistory && (
            <DashboardCard title="Histórico de Treinos">
              {workoutLogs.length === 0 ? (
                <div className="text-center text-slate-400 py-8">Nenhum treino registrado ainda.</div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {workoutLogs.map((log) => {
                    const quest = quests.find(q => q.id === log.questId);
                    return (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <div className="font-bold text-white">{quest?.title || 'Treino Customizado'}</div>
                          <div className="text-sm text-slate-400">{new Date(log.date).toLocaleDateString()} • {log.series}x{log.reps} {log.weight > 0 ? `(${log.weight}kg)` : ''}</div>
                        </div>
                        <div className="text-primary font-bold">+{quest?.xp || 0} XP</div>
                      </div>
                    )
                  }).reverse()}
                </div>
              )}
            </DashboardCard>
          )}

          <DashboardCard title="Quadro de Missões (Treinos)" className="h-full">
            <div className="space-y-4">
              {quests.map((quest, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={quest.id}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all",
                    quest.status === 'completed' ? "bg-white/5 border-white/10 opacity-70" : "glass-card hover:border-white/20",
                    quest.status === 'available' && "border-primary/30"
                  )}
                >
                  <div className={cn("absolute inset-0 opacity-50", quest.image)} />
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-slate-900/50 backdrop-blur-sm",
                      quest.border, quest.color
                    )}>
                      {quest.status === 'completed' ? <History size={24} /> : <Activity size={24} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-slate-900/50",
                          quest.border, quest.color
                        )}>
                          {quest.difficulty}
                        </span>
                        {quest.status === 'completed' && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-green-500/30 text-green-500 bg-slate-900/50">
                            Concluída
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-xl mb-1">{quest.title}</h3>
                      <p className="text-slate-400 text-sm font-medium">{quest.type} • {quest.duration}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-4 mt-4 md:mt-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recompensa</div>
                      <div className="text-lg font-black text-primary">+{quest.xp} XP</div>
                    </div>
                    
                    {quest.status === 'available' && (
                      <button 
                        onClick={() => setActiveQuest(quest)}
                        className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                      >
                        <Play size={20} className="ml-1" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Log Workout Modal */}
      <AnimatePresence>
        {activeQuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-6">
                <button 
                  onClick={() => setActiveQuest(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                
                <h3 className="text-2xl font-black mb-2 pr-8">{activeQuest.title}</h3>
                <p className="text-slate-400 text-sm mb-6">Registre seu progresso para ganhar <span className="text-primary font-bold">+{activeQuest.xp} XP</span></p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">Séries</label>
                      <input 
                        type="number" 
                        value={series} 
                        onChange={(e) => setSeries(Number(e.target.value))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">Repetições</label>
                      <input 
                        type="number" 
                        value={reps} 
                        onChange={(e) => setReps(Number(e.target.value))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Carga (kg)</label>
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={() => {
                      addWorkoutLog({ questId: activeQuest.id, series, reps, weight });
                      addXp(activeQuest.xp);
                      setActiveQuest(null);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  >
                    <Plus size={20} />
                    Registrar Missão e Ganhar XP
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
