"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { 
  Bot, 
  Send, 
  Mic, 
  Paperclip, 
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/lib/supabase';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export default function AgenteIAPage() {
  const { config } = useUserStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMemory = async () => {
      const { data } = await supabase
        .from('ai_memory')
        .select('*')
        .eq('user_id', USER_ID)
        .order('created_at', { ascending: true });
      
      if (data && data.length > 0) {
        setMessages(data.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      } else {
        // Initial message if empty
        setMessages([{
          id: 1,
          role: 'assistant',
          content: 'Saudações, Comandante. Sistemas online. Analisei seu padrão de sono e hábitos recentes. Recomendo focar no projeto de Landing Page hoje pela manhã, pois seu pico de energia mental ocorre entre 09:00 e 11:30. Como posso ajudar agora?',
          time: '08:00',
        }]);
      }
    };
    fetchMemory();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    // Save user message to Supabase
    await supabase.from('ai_memory').insert([{
      user_id: USER_ID,
      role: 'user',
      content: input
    }]);
    
    try {
      // Exclude the last message we just added to send as current message, and format history
      const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          history: historyForApi,
          apiKey: config.geminiApiKey
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro na API');
      }

      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);

      // Save AI response to Supabase
      await supabase.from('ai_memory').insert([{
        user_id: USER_ID,
        role: 'assistant',
        content: data.response
      }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Erro do sistema: ${error.message || 'Falha na comunicação.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              J.A.R.V.I.S <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </h1>
            <p className="text-sm text-slate-400 font-medium">Seu co-piloto operacional</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-2">
          <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-400 flex items-center gap-2">
            <Zap size={12} className="text-primary" />
            Model: Gemini 3.1 Pro
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <DashboardCard className="flex-1 flex flex-col p-0 overflow-hidden border-primary/20 bg-slate-950/50">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={cn(
                  "flex gap-4 max-w-[80%] md:max-w-[70%]",
                  isUser ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1",
                  isUser ? "bg-slate-800" : "bg-primary/20 text-primary border border-primary/30"
                )}>
                  {isUser ? <div className="text-sm font-bold">C</div> : <Bot size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                  "p-4 rounded-2xl relative group",
                  isUser 
                    ? "bg-slate-800 rounded-tr-none text-white" 
                    : "glass-card border border-white/10 rounded-tl-none text-slate-200"
                )}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  <div className={cn(
                    "absolute -bottom-5 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity",
                    isUser ? "right-0" : "left-0"
                  )}>
                    {msg.time}
                  </div>
                </div>
              </motion.div>
            )
          })}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[80%] md:max-w-[70%]"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 bg-primary/20 text-primary border border-primary/30">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10 rounded-tl-none text-slate-200 flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-white/10">
          <div className="flex items-end gap-2 bg-black/50 border border-white/10 rounded-2xl p-2 focus-within:border-primary/50 transition-colors">
            
            <button className="p-3 text-slate-500 hover:text-white transition-colors shrink-0">
              <Paperclip size={20} />
            </button>
            
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Comande, senhor..."
              className="w-full bg-transparent border-none outline-none resize-none py-3 text-sm min-h-[44px] max-h-32 text-white placeholder:text-slate-600 scrollbar-hide"
              rows={1}
            />

            <div className="flex items-center gap-1 pb-1 pr-1 shrink-0">
              <button className="p-2 text-slate-500 hover:text-white transition-colors">
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </div>

          </div>
        </div>

      </DashboardCard>
    </div>
  );
}
