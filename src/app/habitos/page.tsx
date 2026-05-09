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
  Zap,
  X,
  FolderPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardCard } from '@/components/shared/DashboardCard';

const defaultCategories: Record<HabitCategory, { icon: React.ElementType, color: string, bg: string, label: string }> = {
  health: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20', label: 'Saúde' },
  mind: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Mente' },
  work: { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Trabalho' },
  fitness: { icon: Dumbbell, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20', label: 'Físico' },
};

// Custom category icons
const customIcons: Record<string, React.ElementType> = {
  Heart, Brain, Briefcase, Dumbbell, Zap, Flame, Trophy
};

const iconOptions = [
  { name: 'Heart', icon: Heart },
  { name: 'Brain', icon: Brain },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Zap', icon: Zap },
  { name: 'Flame', icon: Flame },
  { name: 'Trophy', icon: Trophy },
];

const Star = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>;

export default function HabitosPage() {
  const { habits, toggleHabit, addXp, addHabit } = useUserStore();
  const [filter, setFilter] = useState<HabitCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', category: 'health' as HabitCategory, xpReward: 10 });
  const [newCategory, setNewCategory] = useState({ name: '', color: '#a855f7', icon: 'Star' });
  const [customCategories, setCustomCategories] = useState<Record<string, any>>({});
  
  const allCategories = { ...defaultCategories, ...customCategories };
  const categoryConfig = allCategories;

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
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-6 py-3 rounded-xl border border-primary/30 transition-all group"
        >
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
        <button
          onClick={() => setShowCategoryModal(true)}
          className="px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap bg-white/5 text-slate-400 hover:bg-white/10 border border-dashed border-white/20"
        >
          <FolderPlus size={16} />
          <span>Nova Categoria</span>
        </button>
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

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Criar Novo Hábito</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <Check className="opacity-0 w-0" /> {/* dummy icon just to balance or we can use X but X needs import, wait, X is not imported. let's import X or just use text */}
                  <span className="text-lg">✕</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Título</label>
                  <input 
                    type="text" 
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                    placeholder="Ex: Ler 20 páginas"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Categoria</label>
                  <select 
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({...newHabit, category: e.target.value as HabitCategory})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 appearance-none"
                  >
                    {(Object.keys(categoryConfig) as HabitCategory[]).map(cat => (
                      <option key={cat} value={cat}>{categoryConfig[cat].label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Recompensa (XP)</label>
                  <input 
                    type="number" 
                    value={newHabit.xpReward}
                    onChange={(e) => setNewHabit({...newHabit, xpReward: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                    min="5"
                    step="5"
                  />
                </div>

                <button 
                  onClick={() => {
                    if (newHabit.title.trim()) {
                      addHabit(newHabit);
                      setShowAddModal(false);
                      setNewHabit({ title: '', category: 'health', xpReward: 10 });
                    }
                  }}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 mt-4"
                >
                  Adicionar Hábito
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Add Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Nova Categoria</h3>
                <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Nome da Categoria</label>
                  <input 
                    type="text" 
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                    placeholder="Ex: Estudos"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Cor</label>
                  <div className="flex gap-2">
                    {['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1'].map(color => (
                      <button
                        key={color}
                        onClick={() => setNewCategory({...newCategory, color})}
                        className={cn("w-8 h-8 rounded-full transition-transform", newCategory.color === color && "scale-110 ring-2 ring-white")}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Ícone</label>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map(opt => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.name}
                          onClick={() => setNewCategory({...newCategory, icon: opt.name})}
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                            newCategory.icon === opt.name ? "bg-primary text-white" : "bg-white/5 text-slate-400"
                          )}
                        >
                          <Icon size={18} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (newCategory.name.trim()) {
                      const slug = newCategory.name.toLowerCase().replace(/\s+/g, '_');
                      const IconComponent = customIcons[newCategory.icon] || Star;
                      setCustomCategories(prev => ({
                        ...prev,
                        [slug]: { 
                          icon: IconComponent, 
                          color: newCategory.color, 
                          bg: `bg-[${newCategory.color.slice(1)}]/10 border-[${newCategory.color.slice(1)}]/20`, 
                          label: newCategory.name 
                        }
                      }));
                      setNewHabit(prev => ({ ...prev, category: slug as HabitCategory }));
                      setShowCategoryModal(false);
                      setNewCategory({ name: '', color: '#a855f7', icon: 'Star' });
                    }
                  }}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 mt-4"
                >
                  Criar Categoria
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
