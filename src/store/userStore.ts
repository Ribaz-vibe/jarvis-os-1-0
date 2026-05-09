import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

// USER_ID is now dynamic

interface UserStats {
  strength: number;
  discipline: number;
  consistency: number;
  recovery: number;
  focus: number;
  cardio: number;
}

export type HabitCategory = 'health' | 'work' | 'mind' | 'fitness';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  xpReward: number;
  completedToday: boolean;
  streak: number;
}

export interface WorkoutLog {
  id: string;
  questId: number;
  date: string;
  series: number;
  reps: number;
  weight: number;
}

export interface UserConfig {
  geminiApiKey: string;
  googleClientId: string;
}

interface UserState {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  xpToday: number;
  stats: UserStats;
  config: UserConfig;
  isLoading: boolean;
  
  userId: string;
  setUserId: (id: string) => void;
  
  // Actions
  initialize: (uid?: string) => Promise<void>;
  updateConfig: (config: Partial<UserConfig>) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  updateStats: (newStats: Partial<UserStats>) => Promise<void>;
  incrementStreak: () => Promise<void>;
  
  // Habits
  habits: Habit[];
  toggleHabit: (id: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'completedToday' | 'streak'>) => Promise<void>;
  resetDailyHabits: () => Promise<void>;

  // Workouts
  workoutLogs: WorkoutLog[];
  addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'date'>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  name: '',
  level: 0,
  xp: 0,
  maxXp: 0,
  streak: 0,
  xpToday: 0,
  stats: {
    strength: 0,
    discipline: 0,
    consistency: 0,
    recovery: 0,
    focus: 0,
    cardio: 0,
  },
  config: {
    geminiApiKey: '',
    googleClientId: '',
  },
  habits: [],
  workoutLogs: [],
  isLoading: true,
  userId: '00000000-0000-0000-0000-000000000000', // default fallback

  setUserId: (id: string) => set({ userId: id }),

initialize: async (uid?: string) => {
    set({ isLoading: true });
    try {
      // Sempre começar zerado - não carregar dados do banco
      set({
        name: '',
        level: 0,
        xp: 0,
        maxXp: 0,
        streak: 0,
        xpToday: 0,
        stats: {
          strength: 0,
          discipline: 0,
          consistency: 0,
          recovery: 0,
          focus: 0,
          cardio: 0,
        },
        habits: [],
        workoutLogs: [],
        config: {
          geminiApiKey: '',
          googleClientId: '',
        },
      });
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateConfig: async (newConfig) => {
    set((state) => ({ config: { ...state.config, ...newConfig } }));
    await supabase.from('users').update({ config: get().config }).eq('id', get().userId);
  },

  addXp: async (amount) => {
    set((state) => {
      let newXp = state.xp + amount;
      let newLevel = state.level;
      let newMaxXp = state.maxXp;

      if (newXp >= state.maxXp) {
        newLevel += 1;
        newXp = newXp - state.maxXp;
        newMaxXp = Math.floor(state.maxXp * 1.2);
      }
      return { xp: newXp, level: newLevel, maxXp: newMaxXp, xpToday: state.xpToday + amount };
    });
    
    const state = get();
    await supabase.from('users').update({ 
      xp: state.xp, 
      level: state.level, 
      max_xp: state.maxXp 
    }).eq('id', state.userId);
  },

  updateStats: async (newStats) => {
    set((state) => ({ stats: { ...state.stats, ...newStats } }));
    await supabase.from('users').update({ stats: get().stats }).eq('id', get().userId);
  },

  incrementStreak: async () => {
    set((state) => ({ streak: state.streak + 1 }));
    await supabase.from('users').update({ streak: get().streak }).eq('id', get().userId);
  },

  toggleHabit: async (id) => {
    let completing = false;
    set((state) => {
      const newHabits = state.habits.map((habit) => {
        if (habit.id === id) {
          completing = !habit.completedToday;
          return { 
            ...habit, 
            completedToday: completing,
            streak: completing ? habit.streak + 1 : Math.max(0, habit.streak - 1)
          };
        }
        return habit;
      });
      return { habits: newHabits };
    });

    const updatedHabit = get().habits.find(h => h.id === id);
    if (updatedHabit) {
      await supabase.from('habits').update({
        completed_today: updatedHabit.completedToday,
        streak: updatedHabit.streak
      }).eq('id', id);
    }
  },

  addHabit: async (habit) => {
    const { data, error } = await supabase
      .from('habits')
      .insert([{
        user_id: get().userId,
        title: habit.title,
        category: habit.category,
        xp_reward: habit.xpReward,
        completed_today: false,
        streak: 0
      }])
      .select()
      .single();

    if (data) {
      set((state) => ({
        habits: [...state.habits, {
          id: data.id,
          title: data.title,
          category: data.category as HabitCategory,
          xpReward: data.xp_reward,
          completedToday: data.completed_today,
          streak: data.streak
        }]
      }));
    }
  },

  resetDailyHabits: async () => {
    set((state) => ({
      habits: state.habits.map(h => ({
        ...h,
        completedToday: false,
        streak: h.completedToday ? h.streak : 0
      }))
    }));
    
    // Update all habits in Supabase
    const { habits } = get();
    for (const h of habits) {
      await supabase.from('habits').update({
        completed_today: false,
        streak: h.streak
      }).eq('id', h.id);
    }
  },

  addWorkoutLog: async (log) => {
    const { data, error } = await supabase
      .from('workouts')
      .insert([{
        user_id: get().userId,
        quest_id: log.questId,
        series: log.series,
        repetitions: log.reps,
        weight: log.weight
      }])
      .select()
      .single();

    if (data) {
      set((state) => ({
        workoutLogs: [...state.workoutLogs, {
          id: data.id,
          questId: data.quest_id,
          date: data.created_at,
          series: data.series,
          reps: data.repetitions,
          weight: data.weight
        }]
      }));
    }
  },
}));
