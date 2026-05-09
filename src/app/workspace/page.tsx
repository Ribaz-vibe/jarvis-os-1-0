"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { 
  Briefcase, 
  FolderGit2, 
  Terminal, 
  Layout, 
  Database,
  ArrowUpRight,
  Plus
} from 'lucide-react';

export default function WorkspacePage() {
  const projects = [
    { name: "Jarvis OS", status: "Em Desenvolvimento", type: "Next.js", icon: Terminal, color: "text-purple-500", progress: 65 },
    { name: "Ponto da Barbearia", status: "Produção", type: "Landing Page", icon: Layout, color: "text-orange-500", progress: 100 },
    { name: "Hermann Tattoo", status: "Revisão", type: "Landing Page", icon: Layout, color: "text-red-500", progress: 90 },
    { name: "API de Vendas", status: "Planejamento", type: "Node.js", icon: Database, color: "text-green-500", progress: 10 },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            <Briefcase className="text-primary" size={36} />
            Workspace
          </h1>
          <p className="text-slate-400">Central de comando dos seus projetos e ativos digitais.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-6 py-3 rounded-xl border border-primary/30 transition-all">
          <Plus size={20} />
          <span className="font-bold">Novo Projeto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <DashboardCard className="flex flex-col justify-center items-center py-8">
          <div className="text-4xl font-black neon-text-cyan mb-2">12</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projetos Ativos</div>
        </DashboardCard>
        <DashboardCard className="flex flex-col justify-center items-center py-8">
          <div className="text-4xl font-black text-green-500 mb-2">4</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Em Produção</div>
        </DashboardCard>
        <DashboardCard className="flex flex-col justify-center items-center py-8">
          <div className="text-4xl font-black text-purple-500 mb-2">32h</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deep Work Semana</div>
        </DashboardCard>
        <DashboardCard className="flex flex-col justify-center items-center py-8">
          <div className="text-4xl font-black text-primary mb-2">+800</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">XP de Dev</div>
        </DashboardCard>
      </div>

      <DashboardCard title="Projetos em Destaque">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="p-5 rounded-2xl glass-card border hover:border-white/20 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${project.color}`}>
                    <project.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                    <div className="text-xs text-slate-500 font-bold">{project.type}</div>
                  </div>
                </div>
                <ArrowUpRight size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className={project.progress === 100 ? "text-green-500" : "text-slate-400"}>
                    {project.status}
                  </span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${project.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                    style={{ width: `${project.progress}%` }} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
