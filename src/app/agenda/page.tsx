"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { 
  Calendar, 
  Clock, 
  Bot, 
  MoreVertical, 
  Plus,
  Video,
  FileText,
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const typeConfig: Record<string, { color: string, border: string }> = {
  focus: { color: "text-purple-500", border: "border-purple-500/30 bg-purple-500/5" },
  meeting: { color: "text-blue-500", border: "border-blue-500/30 bg-blue-500/5" },
  work: { color: "text-slate-300", border: "border-white/10 bg-white/5" },
  break: { color: "text-green-500", border: "border-green-500/30 bg-green-500/5" },
  planning: { color: "text-orange-500", border: "border-orange-500/30 bg-orange-500/5" },
  workout: { color: "text-red-500", border: "border-red-500/30 bg-red-500/5" },
};

function AgendaContent() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', startTime: '', endTime: '', description: '' });

  const schedule = [
    { time: "08:00", title: "Deep Work: Coding", type: "focus", duration: "2h", aiOptimized: true },
    { time: "10:30", title: "Daily Sync", type: "meeting", duration: "30m", icon: Video },
    { time: "11:00", title: "Review PRs", type: "work", duration: "1h" },
    { time: "12:00", title: "Almoço & Descanso", type: "break", duration: "1.5h" },
    { time: "13:30", title: "Planejamento Estratégico", type: "planning", duration: "1.5h", icon: FileText, aiOptimized: true },
    { time: "15:00", title: "Treino: O Despertar do Titã", type: "workout", duration: "1h" },
  ];
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      fetchEvents(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
  });

  const fetchEvents = async (token: string) => {
    try {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.items) {
        const formatted = data.items.map((item: any) => ({
          id: item.id,
          time: new Date(item.start.dateTime || item.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: item.summary,
          type: item.summary.toLowerCase().includes('treino') ? 'workout' : item.summary.toLowerCase().includes('reuni') ? 'meeting' : 'work',
          duration: 'Google Event',
          isGoogle: true
        }));
        setEvents(formatted);
      }
    } catch (error) {
      console.error('Error fetching calendar events', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!accessToken || !newEvent.title || !newEvent.startTime || !newEvent.endTime) return;

    try {
      // Basic formatting assuming today
      const todayDate = new Date().toISOString().split('T')[0];
      const startDateTime = new Date(`${todayDate}T${newEvent.startTime}:00`).toISOString();
      const endDateTime = new Date(`${todayDate}T${newEvent.endTime}:00`).toISOString();

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: newEvent.title,
          description: newEvent.description,
          start: { dateTime: startDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          end: { dateTime: endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewEvent({ title: '', startTime: '', endTime: '', description: '' });
        fetchEvents(accessToken);
      }
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  // Merge mocked schedule with google events, or show only google events if logged in
  const displaySchedule = accessToken && events.length > 0 
    ? events 
    : schedule;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            <Calendar className="text-primary" size={36} />
            Agenda IA
          </h1>
          <p className="text-slate-400">Seu tempo, orquestrado pela inteligência artificial para máxima eficiência.</p>
        </div>
        <div className="flex gap-3">
          {!accessToken ? (
            <button 
              onClick={() => login()}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-all border border-white/10"
            >
              <Calendar size={20} />
              <span className="font-bold text-sm">Conectar Google Calendar</span>
            </button>
          ) : (
            <button 
              onClick={() => setAccessToken(null)}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl transition-all border border-red-500/30"
            >
              <LogOut size={16} />
              <span className="font-bold text-sm">Desconectar</span>
            </button>
          )}

          <button 
            onClick={() => {
              if (accessToken) setIsModalOpen(true);
              else alert('Conecte o Google Calendar primeiro para criar eventos reais.');
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            <Plus size={20} />
            <span className="font-bold">Novo Evento</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI Suggestions */}
        <div className="space-y-8">
          <DashboardCard className="border-primary/30 bg-primary/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="text-primary neon-text-purple" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Otimização Jarvis</h3>
                <p className="text-sm text-slate-400">Baseado no seu ritmo circadiano e histórico de produtividade.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="text-sm font-bold text-primary mb-2">Sugestão de Alocação</div>
                <p className="text-sm text-slate-300">Notei que você é 34% mais focado pela manhã. Sugiro mover o "Planejamento Estratégico" para as 09:00.</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-lg bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 transition-colors">
                    Aplicar
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-white/5 text-slate-400 text-xs font-bold hover:bg-white/10 transition-colors">
                    Ignorar
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="text-sm font-bold text-orange-500 mb-2">Alerta de Fadiga</div>
                <p className="text-sm text-slate-300">Você agendou 4 horas contínuas de Deep Work. Adicionei micro-pausas de 5 min a cada hora.</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Distribuição do Tempo">
            {/* Fake pie chart / progress bars */}
            <div className="space-y-4">
              {[
                { label: "Foco", val: 40, color: "bg-purple-500" },
                { label: "Reuniões", val: 15, color: "bg-blue-500" },
                { label: "Treino/Saúde", val: 20, color: "bg-red-500" },
                { label: "Descanso", val: 25, color: "bg-green-500" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-400">{stat.label}</span>
                    <span>{stat.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color}`} style={{ width: `${stat.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-2">
          <DashboardCard title="Timeline de Hoje" className="h-full">
            <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              
              {displaySchedule.map((item, i) => {
                const config = typeConfig[item.type] || typeConfig.work;
                const Icon = item.icon || Clock;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4"
                  >
                    
                    {/* Icon / Node */}
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] z-10",
                      config.color
                    )}>
                      {item.aiOptimized ? <Bot size={16} /> : <Icon size={16} />}
                    </div>
                    
                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-all glass-card hover:border-white/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded border", config.border, config.color)}>
                          {item.time}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-bold">{item.duration}</span>
                          <button className="text-slate-500 hover:text-white transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      {item.aiOptimized && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest mt-2">
                          <Bot size={12} />
                          Otimizado por Jarvis
                        </div>
                      )}
                    </div>

                  </motion.div>
                )
              })}

            </div>
          </DashboardCard>
        </div>
      </div>

      {/* New Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-6">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                
                <h3 className="text-2xl font-black mb-6">Novo Evento (Google)</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Título</label>
                    <input 
                      type="text" 
                      value={newEvent.title} 
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                      placeholder="Reunião de Alinhamento"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">Início</label>
                      <input 
                        type="time" 
                        value={newEvent.startTime} 
                        onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">Fim</label>
                      <input 
                        type="time" 
                        value={newEvent.endTime} 
                        onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Descrição (Opcional)</label>
                    <textarea 
                      value={newEvent.description} 
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 resize-none h-24"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={handleCreateEvent}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  >
                    Agendar no Google Calendar
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

export default function AgendaPage() {
  const { config } = useUserStore();
  // Use user-configured ID, fallback to env or dummy
  const clientId = config.googleClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1234567890-mocked.apps.googleusercontent.com';
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AgendaContent />
    </GoogleOAuthProvider>
  );
}
