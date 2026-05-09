"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocalConfig } from '@/lib/localConfig';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { 
  Settings, 
  Key, 
  Globe, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Brain
} from 'lucide-react';

export default function SettingsPage() {
  const { config, updateConfig } = useUserStore();
  const { openrouterApiKey, geminiApiKey: localGemini, setOpenrouterApiKey, setGeminiApiKey } = useLocalConfig();
  const [formData, setFormData] = useState({
    geminiApiKey: config.geminiApiKey || localGemini || '',
    googleClientId: config.googleClientId || '',
    openrouterApiKey: openrouterApiKey || '',
  });
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Salvar no localStorage para testes locais
    setOpenrouterApiKey(formData.openrouterApiKey);
    setGeminiApiKey(formData.geminiApiKey);
    // Salvar no Supabase (userStore)
    updateConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            <Settings className="text-primary" size={36} />
            Configurações
          </h1>
          <p className="text-slate-400">Gerencie suas conexões e chaves de API para o Jarvis OS.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <DashboardCard title="Conexão com Inteligência Artificial">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Key size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Google Gemini API</h3>
                  <p className="text-sm text-slate-400">Necessário para o Agente IA responder.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 flex justify-between">
                  API Key
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                </label>
                <input 
                  type={showKey ? "text" : "password"}
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
                <p className="text-[10px] text-slate-500 italic">
                  Suas chaves são salvas apenas no navegador local (LocalStorage).
                </p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Integração com Agenda">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Google Client ID</h3>
                  <p className="text-sm text-slate-400">Necessário para ler/criar eventos na Agenda.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Client ID</label>
                <input 
                  type="text"
                  value={formData.googleClientId}
                  onChange={(e) => setFormData({ ...formData, googleClientId: e.target.value })}
                  placeholder="123456-abcdef.apps.googleusercontent.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="OpenRouter (Chat IA)">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500">
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">OpenRouter API</h3>
                  <p className="text-sm text-slate-400">Para usar chatbots no Jarvis (Llama, Qwen, etc).</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 flex justify-between">
                  API Key
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                </label>
                <input 
                  type={showKey ? "text" : "password"}
                  value={formData.openrouterApiKey}
                  onChange={(e) => setFormData({ ...formData, openrouterApiKey: e.target.value })}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
                <p className="text-[10px] text-slate-500 italic">
                  Obtenha sua chave em openrouter.ai
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-8">
          <DashboardCard title="Status do Sistema" className="h-full">
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">OpenRouter Chat</span>
                  <div className={`flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${formData.openrouterApiKey ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {formData.openrouterApiKey ? 'Online' : 'Offline'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">Agente IA (Gemini)</span>
                  <div className={`flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${formData.geminiApiKey ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {formData.geminiApiKey ? 'Online' : 'Offline'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">Sincronização Agenda</span>
                  <div className={`flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${formData.googleClientId ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {formData.googleClientId ? 'Pronto' : 'Pendente'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3">
                <AlertCircle className="text-yellow-500 shrink-0" size={20} />
                <p className="text-xs text-yellow-500/80 leading-relaxed">
                  Para o Google Calendar funcionar, certifique-se de adicionar `http://localhost:3000` às origens autorizadas no seu Console do Google Cloud.
                </p>
              </div>

              <button 
                onClick={handleSave}
                disabled={saved}
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
              >
                {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
                {saved ? 'Configurações Salvas!' : 'Salvar Alterações'}
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
