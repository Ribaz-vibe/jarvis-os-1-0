"use client";

import React, { useState, useEffect } from 'react';
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
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TreinoPage() {
  const { stats, addWorkoutLog, addXp, workoutLogs, xpToday } = useUserStore();
  const [activeQuest, setActiveQuest] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  
  // Missões do usuário (armazenadas localmente)
  const [quests, setQuests] = useState<any[]>([]);
  
  // Multiple exercises state
  const [exercises, setExercises] = useState<any[]>([]);
  
  // Exercises in manual form
  const [manualExercises, setManualExercises] = useState<{name: string, series: number, reps: number, weight: number}[]>([
    { name: '', series: 3, reps: 10, weight: 0 }
  ]);

  // Load from localStorage
  useEffect(() => {
    const savedMissions = localStorage.getItem('jarvis_missions');
    if (savedMissions) {
      setQuests(JSON.parse(savedMissions));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jarvis_missions', JSON.stringify(quests));
  }, [quests]);

  // Load exercises when activeQuest is set
  useEffect(() => {
    if (activeQuest?.exercises) {
      setExercises(activeQuest.exercises);
    } else if (activeQuest) {
      setExercises([{ name: 'Exercício 1', series: 3, reps: 10, weight: 0 }]);
    }
  }, [activeQuest]);
  
  // Manual quest form state
  const [manualForm, setManualForm] = useState({
    title: '',
    muscles: [] as string[],
    duration: 30,
    difficulty: 'Intermediário',
    xp: 50
  });
  
// AI Chat state
  const [aiChat, setAiChat] = useState<{role: string, content: string}[]>([{
    role: 'assistant', 
    content: 'Olá! Sou seu inúmer pessoais. Para criar sua missão, me diga: Qual seu objetivo (hipertrofia, emagrecimento, etc), seu nível atual, peso e altura?'
  }]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const musclesList = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Pernas', 'Glúteos', 'Abdômen', 'Trapézio', 'Panturrilhas', 'Antebraço', 'Cardio'];
  
  const toggleMuscle = (muscle: string) => {
    setManualForm(prev => ({
      ...prev,
      muscles: prev.muscles.includes(muscle) 
        ? prev.muscles.filter(m => m !== muscle)
        : [...prev.muscles, muscle]
    }));
  };

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
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-5 py-3 rounded-xl border border-primary/30 transition-all"
          >
            <Target size={18} />
            <span className="font-bold text-sm">Criar Missão com IA</span>
          </button>
          <button 
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent px-5 py-3 rounded-xl border border-accent/30 transition-all"
          >
            <Plus size={18} />
            <span className="font-bold text-sm">Criar Missão Manual</span>
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
                  { label: "Força Bruta", val: stats.strength, max: 100, color: "bg-red-500" },
                  { label: "Cardio", val: stats.cardio, max: 100, color: "bg-cyan-500" },
                  { label: "Recuperação", val: stats.recovery, max: 100, color: "bg-green-500" },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm mb-1 font-bold">
                      <span className="text-slate-400">{stat.label}</span>
                      <span>{stat.val} / {stat.max}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.val > 0 ? (stat.val / stat.max) * 100 : 0}%` }}
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
                  <div className="text-2xl font-black neon-text-purple">+{xpToday} XP</div>
                  <div className="text-sm text-slate-400 font-bold uppercase tracking-widest">Ganho de Hoje</div>
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
                    
                    <button 
                      onClick={() => setQuests(quests.filter(q => q.id !== quest.id))}
                      className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500/30 transition-all"
                      title="Excluir missão"
                    >
                      <Trash2 size={16} />
                    </button>
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

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {exercises.map((ex, index) => (
                    <div key={index} className="p-4 bg-black/30 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-bold">{ex.name}</span>
                        <span className="text-xs text-slate-500">Exercício {index + 1}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white/5 rounded-lg py-2">
                          <div className="text-xs font-bold text-slate-400 uppercase">Séries</div>
                          <div className="text-white font-black">{ex.series}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg py-2">
                          <div className="text-xs font-bold text-slate-400 uppercase">Reps</div>
                          <div className="text-white font-black">{ex.reps}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg py-2">
                          <div className="text-xs font-bold text-slate-400 uppercase">Peso</div>
                          <div className="text-white font-black">{ex.weight}kg</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button 
                    onClick={() => {
                      exercises.forEach(ex => {
                        addWorkoutLog({ questId: activeQuest.id, series: ex.series, reps: ex.reps, weight: ex.weight });
                      });
                      addXp(activeQuest.xp);
                      setQuests(quests.map(q => q.id === activeQuest.id ? { ...q, status: 'completed' } : q));
                      setActiveQuest(null);
                      setExercises([{ name: 'Exercício 1', series: 3, reps: 10, weight: 0 }]);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  >
                    <Play size={20} className="ml-1" />
                    Finalizar Missão e Ganhar XP
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Consultoria Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.15)] w-full max-w-2xl overflow-hidden relative flex flex-col h-[80vh]"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Target size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Consultoria IA</h3>
                    <p className="text-xs text-slate-400">Gerador de Missões Físicas</p>
                  </div>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/50">
                {aiChat.map((msg, i) => (
                  <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1", msg.role === 'user' ? "bg-slate-800" : "bg-primary/20 text-primary")}>
                      {msg.role === 'user' ? <div className="text-xs font-bold">C</div> : <Activity size={14} />}
                    </div>
                    <div className={cn("p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed", msg.role === 'user' ? "bg-slate-800 rounded-tr-none text-white" : "glass-card border border-primary/20 rounded-tl-none text-slate-200")}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center"><Activity size={14} /></div>
                    <div className="p-3 rounded-2xl glass-card border border-primary/20 rounded-tl-none flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Fake AI flow for now
                        if (!aiInput.trim()) return;
                        setAiChat(prev => [...prev, { role: 'user', content: aiInput }]);
                        setAiInput('');
                        setAiLoading(true);
                        setTimeout(() => {
                          setAiLoading(false);
                          setAiChat(prev => [...prev, { role: 'assistant', content: 'Excelente. Com base nisso, criei uma nova missão chamada "Foco Hipertrófico". Ela foi adicionada ao seu quadro de missões. Pronto para começar?' }]);
                        }, 1500);
                      }
                    }}
                    placeholder="Ex: 80kg, 1.75m, quero ganhar massa..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
                  <button className="px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                    Enviar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Create Mission Modal */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-accent/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] w-full max-w-lg overflow-hidden relative flex flex-col max-h-[85vh]"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Plus size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Criar Missão Manual</h3>
                    <p className="text-xs text-slate-400">Monte seu próprio treino</p>
                  </div>
                </div>
                <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Nome do Treino</label>
                  <input 
                    type="text" 
                    value={manualForm.title}
                    onChange={(e) => setManualForm({...manualForm, title: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 font-bold"
                    placeholder="Ex: Treino de Peito"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Grupos Musculares</label>
                  <div className="flex flex-wrap gap-2">
                    {musclesList.map(muscle => (
                      <button
                        key={muscle}
                        onClick={() => toggleMuscle(muscle)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                          manualForm.muscles.includes(muscle) ? "bg-accent text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                        )}
                      >
                        {muscle}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Duração (min)</label>
                    <input type="number" value={manualForm.duration} onChange={(e) => setManualForm({...manualForm, duration: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white" min="10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">XP Recompensa</label>
                    <input type="number" value={manualForm.xp} onChange={(e) => setManualForm({...manualForm, xp: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white" min="10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Dificuldade</label>
                  <select value={manualForm.difficulty} onChange={(e) => setManualForm({...manualForm, difficulty: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white">
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400">Exercícios</label>
                  {manualExercises.map((ex, index) => (
                    <div key={index} className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <input 
                          type="text" 
                          value={ex.name}
                          onChange={(e) => {
                            const newEx = [...manualExercises];
                            newEx[index].name = e.target.value;
                            setManualExercises(newEx);
                          }}
                          className="bg-transparent border-b border-white/20 text-white font-bold focus:outline-none focus:border-accent w-2/3 text-sm"
                          placeholder="Nome do exercício"
                        />
                        {manualExercises.length > 1 && (
                          <button onClick={() => setManualExercises(manualExercises.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-400">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Séries</label>
                          <input type="number" value={ex.series} onChange={(e) => { const newEx = [...manualExercises]; newEx[index].series = Number(e.target.value); setManualExercises(newEx); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm" min="1"/>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Reps</label>
                          <input type="number" value={ex.reps} onChange={(e) => { const newEx = [...manualExercises]; newEx[index].reps = Number(e.target.value); setManualExercises(newEx); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm" min="1"/>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Kg</label>
                          <input type="number" value={ex.weight} onChange={(e) => { const newEx = [...manualExercises]; newEx[index].weight = Number(e.target.value); setManualExercises(newEx); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm" min="0"/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setManualExercises([...manualExercises, { name: '', series: 3, reps: 10, weight: 0 }])}
                    className="w-full py-2 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white hover:border-white/50 transition-colors flex justify-center items-center gap-2 text-xs font-bold"
                  >
                    <Plus size={14} /> Adicionar Exercício
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 bg-black/20">
                <button 
                  onClick={() => {
                    const filledExercises = manualExercises.filter(ex => ex.name.trim());
                    if (!manualForm.title.trim() || manualForm.muscles.length === 0 || filledExercises.length === 0) {
                      alert('Preencha o nome, selecione pelo menos um músculo e adicione pelo menos um exercício.');
                      return;
                    }
                    setQuests(prev => [...prev, {
                      id: Date.now(),
                      title: manualForm.title,
                      type: manualForm.muscles.join(', '),
                      difficulty: manualForm.difficulty,
                      xp: manualForm.xp,
                      duration: `${manualForm.duration} min`,
                      status: 'available',
                      muscles: manualForm.muscles,
                      exercises: filledExercises,
                      image: "bg-gradient-to-br from-accent/20 to-purple-500/5",
                      color: "text-accent",
                      border: "border-accent/30"
                    }]);
                    setManualForm({ title: '', muscles: [], duration: 30, difficulty: 'Intermediário', xp: 50 });
                    setManualExercises([{ name: '', series: 3, reps: 10, weight: 0 }]);
                    setShowManualModal(false);
                  }}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl"
                >
                  Criar Missão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
