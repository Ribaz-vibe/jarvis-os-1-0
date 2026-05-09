"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocalConfig {
  openrouterApiKey: string;
  geminiApiKey: string;
  selectedModel: string;
}

interface LocalConfigStore extends LocalConfig {
  setOpenrouterApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  clearConfig: () => void;
}

export const useLocalConfig = create<LocalConfigStore>()(
  persist(
    (set) => ({
      openrouterApiKey: '',
      geminiApiKey: '',
      selectedModel: 'meta-llama/llama-3.2-3b-instruct:free',
      
      setOpenrouterApiKey: (key) => set({ openrouterApiKey: key }),
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      clearConfig: () => set({ openrouterApiKey: '', geminiApiKey: '', selectedModel: 'meta-llama/llama-3.2-3b-instruct:free' }),
    }),
    {
      name: 'jarvis-local-config',
    }
  )
);

export function getApiKeyFromLocal(): string | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('jarvis-local-config');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.state?.openrouterApiKey || null;
    } catch {
      return null;
    }
  }
  return null;
}