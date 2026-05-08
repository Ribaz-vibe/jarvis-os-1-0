"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { 
  Briefcase, 
  FolderGit2, 
  Terminal, 
  Layout, 
  Database,
  ArrowUpRight,
  Plus,
  X,
  MoreVertical,
  Check,
  CheckCircle2,
  Circle,
  Trash2,
  Upload,
  Image,
  FileText,
  Save,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WorkspacePage() {
  const router = useRouter();
  const [projects, setProjects] = useState([
    { name: "Jarvis OS", status: "Em Desenvolvimento", type: "Next.js", icon: Terminal, color: "text-purple-500", progress: 65, description: "Sistema operacional pessoal gamificado", tasks: [{id: 1, text: "Implementar login", done: true}, {id: 2, text: "Criar dashboard", done: true}, {id: 3, text: "Deploy Vercel", done: false}], notes: "# Jarvis OS\n\n## Objetivos\n- Sistema gamificado\n- IA integrada\n- Deploy mobile", images: [] },
    { name: "Ponto da Barbearia", status: "Produção", type: "Landing Page", icon: Layout, color: "text-orange-500", progress: 100, description: "Landing page para barbearia", tasks: [], notes: "", images: [] },
    { name: "Hermann Tattoo", status: "Revisão", type: "Landing Page", icon: Layout, color: "text-red-500", progress: 90, description: "Portfólio tatuador", tasks: [], notes: "", images: [] },
    { name: "API de Vendas", status: "Planejamento", type: "Node.js", icon: Database, color: "text-green-500", progress: 10, description: "API RESTful", tasks: [], notes: "", images: [] },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', type: 'Next.js', description: '' });
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectNotes, setProjectNotes] = useState('');
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');

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
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-6 py-3 rounded-xl border border-primary/30 transition-all"
        >
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
              onClick={() => {
                setSelectedProject(project);
                setProjectNotes(project.notes || '');
                setProjectTasks(project.tasks || []);
              }}
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
      
      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Criar Novo Projeto</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Nome do Projeto</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                  placeholder="Ex: Landing Page Cliente"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Tecnologia/Tipo</label>
                <input 
                  type="text" 
                  value={newProject.type}
                  onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                  placeholder="Ex: Next.js, Node.js, Design..."
                />
              </div>

<button 
          onClick={() => {
            if (newProject.name.trim()) {
              setProjects([{
                name: newProject.name,
                status: "Planejamento",
                type: newProject.type || "Outros",
                icon: Layout,
                color: "text-primary",
                progress: 0,
                description: newProject.description || '',
                tasks: [],
                notes: '',
                images: []
              }, ...projects]);
              setShowAddModal(false);
              setNewProject({ name: '', type: 'Next.js', description: '' });
            }
          }}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 mt-4"
        >
          Adicionar Projeto
        </button>
            </div>
          </motion.div>
        </div>
      )}

    {/* Project Detail Modal - Notion Style */}
    <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", selectedProject.color)}>
                  <selectedProject.icon size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xl">{selectedProject.name}</h3>
                  <p className="text-xs text-slate-400">{selectedProject.type} • {selectedProject.status}</p>
                </div>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Descrição</h4>
                <textarea
                  value={selectedProject.description || ''}
                  onChange={(e) => {
                    const updated = {...selectedProject, description: e.target.value};
                    setProjects(projects.map(p => p.name === selectedProject.name ? updated : p));
                    setSelectedProject(updated);
                  }}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white resize-none h-24"
                />
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Tarefas</h4>
                <div className="space-y-2 mb-3">
                  {(selectedProject.tasks || []).map((task: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                      <button onClick={() => {
                        const updated = {...selectedProject, tasks: selectedProject.tasks.map((t: any, idx: number) => idx === i ? {...t, done: !t.done} : t)};
                        setProjects(projects.map(p => p.name === selectedProject.name ? updated : p));
                        setSelectedProject(updated);
                      }}>
                        {task.done ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-slate-500" />}
                      </button>
                      <span className={cn("flex-1", task.done && "line-through text-slate-500")}>{task.text}</span>
                      <button onClick={() => {
                        const updated = {...selectedProject, tasks: selectedProject.tasks.filter((_: any, idx: number) => idx !== i)};
                        setProjects(projects.map(p => p.name === selectedProject.name ? updated : p));
                        setSelectedProject(updated);
                      }} className="text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTask.trim()) {
                      const updated = {...selectedProject, tasks: [...(selectedProject.tasks || []), {id: Date.now(), text: newTask, done: false}]};
                      setProjects(projects.map(p => p.name === selectedProject.name ? updated : p));
                      setSelectedProject(updated);
                      setNewTask('');
                    }
                  }} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Nova tarefa..." />
                  <button onClick={() => {
                    if (newTask.trim()) {
                      const updated = {...selectedProject, tasks: [...(selectedProject.tasks || []), {id: Date.now(), text: newTask, done: false}]};
                      setProjects(projects.map(p => p.name === selectedProject.name ? updated : p));
                      setSelectedProject(updated);
                      setNewTask('');
                    }
                  }} className="px-4 bg-primary rounded-xl text-white font-bold"><Plus size={18} /></button>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Anotações</h4>
                <textarea
                  value={selectedProject.notes || ''}
                  onChange={(e) => {
                    const updated = {...selectedProject, notes: e.target.value};
                    setProjects(projects.map(p => p.name === selectedProject.name ? updated : p));
                    setSelectedProject(updated);
                  }}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white resize-none min-h-[200px] font-mono text-sm"
                  placeholder="# Título\n\n## Notas"
                />
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Imagens</h4>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
                  <Upload size={32} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-slate-400 text-sm">Arraste imagens aqui</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-between">
              <button onClick={() => { setProjects(projects.filter(p => p.name !== selectedProject.name)); setSelectedProject(null); }} className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-xl flex items-center gap-2">
                <Trash2 size={18} /> Excluir
              </button>
              <button onClick={() => setSelectedProject(null)} className="px-6 bg-primary text-white font-bold py-2 rounded-xl">Salvar</button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
}

function Star() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>;
}
