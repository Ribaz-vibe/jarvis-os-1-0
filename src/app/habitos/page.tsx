"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Pencil,
  Trash2,
  Eye,
  Star,
  Moon,
  Sun,
  Cloud,
  Leaf,
  Flame as FireIcon,
  Zap as BoltIcon,
  Coffee,
  Book,
  Music,
  Code,
  Gamepad2,
  Wallet,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardCard } from '@/components/shared/DashboardCard';

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

type HabitCategory = 'health' | 'mind' | 'work' | 'fitness' | string;

const defaultCategories: Record<string, { icon: React.ElementType, color: string, bg: string, label: string }> = {
  health: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20', label: 'Saúde' },
  mind: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Mente' },
  work: { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Trabalho' },
  fitness: { icon: Dumbbell, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20', label: 'Físico' },
};

const availableIcons: Record<string, React.ElementType> = {
  Heart, Brain, Briefcase, Dumbbell, Star, Moon, Sun, Cloud, Leaf, FireIcon, BoltIcon, Coffee, Book, Music, Code, Gamepad2, Wallet, ShoppingBag
};

const availableColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'
];

export default function HabitosPage() {
  // Estado local para hábitos (sem Supabase)
  const [habits, setHabits] = useState<Habit[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [filter, setFilter] = useState<HabitCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({ title: '', category: 'health' as HabitCategory, xpReward: 10 });
  const [newCategory, setNewCategory] = useState({ name: '', color: '#8b5cf6', icon: 'Star' });
  
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

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('jarvis_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('jarvis_custom_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  // Função para obter ícone pelo nome
  const getIconComponent = (iconName: string) => {
    return availableIcons[iconName] || Star;
  };

  // Função para obter todas as categorias (padrão + customizadas)
  const getAllCategories = () => {
    const customCatConfig: Record<string, { icon: React.ElementType, color: string, bg: string, label: string }> = {};
    customCategories.forEach(cat => {
      customCatConfig[cat.id] = {
        icon: getIconComponent(cat.icon),
        color: cat.color.startsWith('#') ? `text-[${cat.color}]` : cat.color,
        bg: `bg-[${cat.color}/10] border-[${cat.color}/20]`,
        label: cat.name
      };
    });
    return { ...defaultCategories, ...customCatConfig };
  };

  const allCategories = getAllCategories();

  const filteredHabits = filter === 'all' ? habits : habits.filter(h => h.category === filter);

  const handleToggle = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        return { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) };
      }
      return h;
    }));
  };

  const handleAddHabit = () => {
    if (newHabit.title.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        title: newHabit.title,
        category: newHabit.category,
        xpReward: newHabit.xpReward,
        completedToday: false,
        streak: 0
      };
      setHabits([...habits, habit]);
      setShowAddModal(false);
      setNewHabit({ title: '', category: 'health', xpReward: 10 });
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingHabit && editingHabit.title.trim()) {
      setHabits(prev => prev.map(h => h.id === editingHabit.id ? editingHabit : h));
      setShowEditModal(false);
      setEditingHabit(null);
    }
  };

  const handleDeleteHabit = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este hábito?')) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category: CustomCategory = {
        id: 'cat_' + Date.now(),
        name: newCategory.name,
        color: newCategory.color,
        icon: newCategory.icon
      };
      setCustomCategories([...customCategories, category]);
      setShowNewCategoryForm(false);
      setNewCategory({ name: '', color: '#8b5cf6', icon: 'Star' });
    }
  };

  const handleDeleteCategory = (catId: string) => {
    // Mover hábitos da categoria para "Sem categoria" ou excluí-los
    const habitsInCategory = habits.filter(h => h.category === catId);
    if (habitsInCategory.length > 0) {
      if (confirm(`Esta categoria tem ${habitsInCategory.length} hábito(s). Deseja movê-los para "Saúde"?`)) {
        setHabits(prev => prev.map(h => h.category === catId ? { ...h, category: 'health' } : h));
      }
    }
    setCustomCategories(prev => prev.filter(c => c.id !== catId));
    setDeleteConfirmCategory(null);
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
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl border border-white/10 transition-all"
          >
            <Eye size={18} />
            <span className="font-bold text-sm">Categorias</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-6 py-3 rounded-xl border border-primary/30 transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span className="font-bold">Novo Hábito</span>
          </button>
        </div>
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
          <div className="text-2xl font-black">0 Dias</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Streak Perfeito</div>
        </DashboardCard>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            "px-4 py-2 rounded-xl font-bold text-sm transition-all",
            filter === 'all' ? "bg-primary text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
          )}
        >
          Todos ({habits.length})
        </button>
        {/* Default Categories */}
        {(Object.keys(defaultCategories) as string[]).map(cat => {
          const count = habits.filter(h => h.category === cat).length;
          const config = defaultCategories[cat];
          const Icon = config.icon;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all",
                filter === cat ? config.bg + " " + config.color : "bg-white/5 text-slate-400 hover:bg-white/10"
              )}
            >
              <Icon size={16} />
              {config.label} ({count})
            </button>
          );
        })}
        {/* Custom Categories */}
        {customCategories.map(cat => {
          const count = habits.filter(h => h.category === cat.id).length;
          const IconComp = getIconComponent(cat.icon);
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border",
                filter === cat.id ? "bg-white/10" : "bg-white/5 text-slate-400 hover:bg-white/10"
              )}
              style={{ borderColor: filter === cat.id ? cat.color : 'transparent' }}
            >
              <IconComp size={16} style={{ color: filter === cat.id ? cat.color : undefined }} />
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHabits.map((habit) => {
            // Obter config da categoria (default ou customizada)
            let config = defaultCategories[habit.category as string];
            let Icon = config?.icon || Heart;
            let colorClass = config?.color || 'text-slate-400';
            let bgClass = config?.bg || 'bg-slate-500/10 border-slate-500/20';
            
            // Verificar se é categoria customizada
            const customCat = customCategories.find(c => c.id === habit.category);
            if (customCat) {
              const IconComp = getIconComponent(customCat.icon);
              Icon = IconComp;
              colorClass = '';
              bgClass = '';
            }
            
            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "group relative p-4 rounded-2xl border transition-all cursor-pointer",
                  habit.completedToday 
                    ? "bg-white/5 border-white/10 opacity-70" 
                    : "bg-slate-900/50 border-white/5 hover:border-white/20"
                )}
                onClick={() => handleToggle(habit.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all",
                      habit.completedToday 
                        ? "bg-primary border-primary" 
                        : customCategories.find(c => c.id === habit.category)
                          ? "border-2"
                          : config.bg + " border-current"
                    )}
                    style={customCategories.find(c => c.id === habit.category) ? { borderColor: customCategories.find(c => c.id === habit.category)?.color } : undefined}>
                      {habit.completedToday ? <Check size={24} /> : <Icon size={24} className={customCategories.find(c => c.id === habit.category) ? "" : config.color} style={customCategories.find(c => c.id === habit.category) ? { color: customCategories.find(c => c.id === habit.category)?.color } : undefined} />}
                    </div>
                    
                    <div>
                      <h3 className={cn(
                        "font-bold text-lg transition-colors",
                        habit.completedToday ? "text-white line-through" : "text-slate-200 group-hover:text-white"
                      )}>
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          {customCategories.find(c => c.id === habit.category)?.name || config.label}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          +{habit.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame size={16} className={habit.streak > 0 ? "fill-orange-500" : ""} />
                        <span className="font-bold text-sm">{habit.streak}</span>
                      </div>
                    </div>

                    {/* Botões de editar e excluir */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditHabit(habit); }}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteHabit(habit.id); }}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredHabits.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">Nenhum hábito encontrado</p>
            <p className="text-sm mt-2">Clique em "Novo Hábito" para criar o primeiro</p>
          </div>
        )}
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
                    onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 appearance-none"
                  >
                    <optgroup label="Padrão">
                      {(Object.keys(defaultCategories) as string[]).map(cat => (
                        <option key={cat} value={cat}>{defaultCategories[cat].label}</option>
                      ))}
                    </optgroup>
                    {customCategories.length > 0 && (
                      <optgroup label="Personalizadas">
                        {customCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </optgroup>
                    )}
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
                  onClick={handleAddHabit}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 mt-4"
                >
                  Adicionar Hábito
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Habit Modal */}
      <AnimatePresence>
        {showEditModal && editingHabit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Editar Hábito</h3>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                  <span className="text-lg">✕</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Título</label>
                  <input 
                    type="text" 
                    value={editingHabit.title}
                    onChange={(e) => setEditingHabit({...editingHabit, title: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Categoria</label>
                  <select 
                    value={editingHabit.category}
                    onChange={(e) => setEditingHabit({...editingHabit, category: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 appearance-none"
                  >
                    <optgroup label="Padrão">
                      {(Object.keys(defaultCategories) as string[]).map(cat => (
                        <option key={cat} value={cat}>{defaultCategories[cat].label}</option>
                      ))}
                    </optgroup>
                    {customCategories.length > 0 && (
                      <optgroup label="Personalizadas">
                        {customCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">Recompensa (XP)</label>
                  <input 
                    type="number" 
                    value={editingHabit.xpReward}
                    onChange={(e) => setEditingHabit({...editingHabit, xpReward: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                    min="5"
                    step="5"
                  />
                </div>

                <button 
                  onClick={handleSaveEdit}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 mt-4"
                >
                  Salvar Alterações
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Categorias de Hábitos</h3>
                <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-white">
                  <span className="text-lg">✕</span>
                </button>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirmCategory && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-white text-center mb-4">Tem certeza que deseja excluir esta categoria?</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleDeleteCategory(deleteConfirmCategory)}
                      className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600"
                    >
                      Sim, excluir
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmCategory(null)}
                      className="flex-1 py-2 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* New Category Form */}
              {showNewCategoryForm ? (
                <div className="space-y-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
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
                    <div className="flex gap-2 flex-wrap">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewCategory({...newCategory, color})}
                          className={cn(
                            "w-8 h-8 rounded-full border-2",
                            newCategory.color === color ? "border-white" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Ícone</label>
                    <div className="flex gap-2 flex-wrap">
                      {Object.keys(availableIcons).map(iconName => {
                        const IconComp = availableIcons[iconName];
                        return (
                          <button
                            key={iconName}
                            onClick={() => setNewCategory({...newCategory, icon: iconName})}
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center border-2",
                              newCategory.icon === iconName ? "border-primary bg-primary/20" : "border-white/10"
                            )}
                          >
                            <IconComp size={20} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={handleAddCategory}
                      className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90"
                    >
                      Criar Categoria
                    </button>
                    <button 
                      onClick={() => { setShowNewCategoryForm(false); setNewCategory({ name: '', color: '#8b5cf6', icon: 'Star' }); }}
                      className="px-4 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowNewCategoryForm(true)}
                  className="w-full mb-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Nova Categoria
                </button>
              )}

              <div className="space-y-3">
                {/* Default Categories */}
                {(Object.keys(defaultCategories) as string[]).map(cat => {
                  const config = defaultCategories[cat];
                  const Icon = config.icon;
                  const count = habits.filter(h => h.category === cat).length;
                  return (
                    <div key={cat} className={cn("flex items-center justify-between p-4 rounded-xl border", config.bg)}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.bg)}>
                          <Icon size={20} className={config.color} />
                        </div>
                        <div>
                          <div className="font-bold">{config.label}</div>
                          <div className="text-xs text-slate-500">{count} hábito(s)</div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Custom Categories */}
                {customCategories.map(cat => {
                  const IconComp = getIconComponent(cat.icon);
                  const count = habits.filter(h => h.category === cat.id).length;
                  return (
                    <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: `${cat.color}15`, borderColor: `${cat.color}30` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                          <IconComp size={20} style={{ color: cat.color }} />
                        </div>
                        <div>
                          <div className="font-bold">{cat.name}</div>
                          <div className="text-xs text-slate-500">{count} hábito(s)</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setDeleteConfirmCategory(cat.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500"
                        title="Excluir categoria"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}