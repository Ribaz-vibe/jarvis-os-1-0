"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Zap,
  LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Dumbbell, label: 'Treino RPG', href: '/treino' },
  { icon: CheckCircle2, label: 'Hábitos', href: '/habitos' },
  { icon: Calendar, label: 'Agenda IA', href: '/agenda' },
  { icon: Briefcase, label: 'Workspace', href: '/workspace' },
  { icon: MessageSquare, label: 'Agente IA', href: '/ai' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-20 md:w-64 h-screen glass-card border-l-0 fixed left-0 top-0 z-50 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
          <Zap className="text-white fill-white" size={24} />
        </div>
        <span className="hidden md:block font-bold text-xl tracking-wider neon-text-cyan">JARVIS</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={22} className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                isActive && "neon-text-purple"
              )} />
              <span className="hidden md:block font-medium tracking-wide">{item.label}</span>
              {isActive && (
                <div className="hidden md:block absolute left-0 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(99,102,241,1)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <Settings size={22} className="group-hover:rotate-90 transition-transform" />
          <span className="hidden md:block font-medium">Configurações</span>
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('jarvis_guest_mode');
            supabase.auth.signOut();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:block font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};
