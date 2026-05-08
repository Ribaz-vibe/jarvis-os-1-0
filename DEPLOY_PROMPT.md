# Prompt: Deploy do Jarvis OS com Hermes Agent

## Contexto Geral do Projeto

Você está continuando o desenvolvimento do **Jarvis OS 1.0**, um sistema operacional pessoal gamificado built com:
- **Stack**: Next.js + Tailwind CSS v4 + Framer Motion + Zustand
- **Design**: Dark-futurista com glassmorphism e efeitos neon
- **Funcionalidades**: Dashboard, Hábitos, Treino RPG, Agenda IA, Workspace, Agente IA, Analytics

O projeto já tem UI completa e funcionando localmente com localStorage. Ahora queremos:
1. **Subir para produção** (deploy gratuito)
2. **Conectar com IA real** (Hermes Agent ou similar)
3. **Acessar remotamente** do celular

---

## Objetivo Principal

Fazer o Jarvis funcionar online com:
- ✅ Acesso do celular (qualquer lugar)
- ✅ Agente IA que aprende com uso (memória persistente)
- ✅ Dados persistidos (não perder ao fechar navegador)
- ✅ Custo: R$0 (totalmente gratuito)

---

## Planejamentoda Infraestrutura (Base)

Encontrei opções gratuitas que parecem funcionar. Pode pesquisaroutras se houver melhores:

### 1. Hospedagem (Node.js Gratuita)

| Serviço | Recurso | Domínio | Cartão? |
|---------|--------|--------|---------|
| **Bonto** | 75 hrs/mês | .bonto.run | ❌ Não |
| **StackHost** | 512MB RAM | custom | ❌ Não |
| **HostingGuru** | 1 app | custom | ❌ Não |
| **Render** | 750 hrs/mês | .onrender.com | ⚠️ Sim |

**Recomendado**: Bonto (mais fácil para Node.js, sem cartão)

### 2. Banco de Dados (Gratuito)

| Serviço | Recurso |
|---------|--------|
| **Supabase** | 500MB PostgreSQL |
| **TurboDB** | 5MB SQLite |
| **Neon** | PostgreSQL serverless |

**Recomendado**: Supabase (mais popular, bom free tier, PostgreSQL)

### 3. LLM/IA ( Gratuito)

Opções de API gratuitas para conectar no Agente IA:

| Serviço | Custo | Notas |
|--------|-------|-------|
| **BazaarLink** | Grátis | `auto:free` model |
| **Groq** | 30 RPM | Llama/Mixtral |
| **FreeLLM** | Grátis | Multi-provider |
| **Cerebras** | Grátis | Altas limits |

**Recomendado**: Groq ou BazaarLink (mais estável 免费)

---

## O que precisa fazer (Tarefas)

### Task 1: Preparar o Código
- [ ] Criar schema do banco no Supabase (tabelas: users, habits, workouts, etc)
- [ ] Migrar Zustand store de localStorage para Supabase
- [ ] Criar API routes no Next.js para CRUD
- [ ] Configurar variáveis de ambiente (.env)

### Task 2: Integrar IA (Agente)
- [ ] Escolher provedor de LLM (Groq/BazaarLink)
- [ ] Mudar o Agente IA para usar API real
- [ ] Testar conversas

### Task 3: Deploy
- [ ] Conectar GitHub com Bonto (ou outro)
- [ ] Configurar environment variables no servidor
- [ ] Testar site online

### Task 4: Acesso Remoto
- [ ] Garantir que funciona no celular
- [ ] Testar todas as funcionalidade

---

## Possibilidade: Hermes Agent

O **Hermes Agent** (nousresearch.com) seria idéal porque:
- ✅ Memória persistente que aprende com uso
- ✅ Skills automáticos
- ✅ Multi-plataforma (Telegram, Discord)

**Mas** precisa de servidor dedicado (VPS). Se quiser usar Hermes, options grátis:
- **Daytona** (free tier, serverless)
- **Modal** (pay per use)
- **VPS $5/mo** (conectado.host, digitalocean)

**Alternativa mais simples**: Usar só API de LLM (Groq/BazaarLink) sem Hermes, e implementar memória manualmente no Supabase.

---

## Sugestão de Schema (Supabase)

```sql
-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  level int default 1,
  xp int default 0,
  max_xp int default 1000,
  streak int default 0,
  stats jsonb default '{"strength":10,"discipline":10,"consistency":10,"recovery":10,"focus":10,"cardio":10}',
  created_at timestamptz default now()
);

-- Habits
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  title text,
  category text,
  xp_reward int,
  completed_today bool default false,
  streak int default 0,
  created_at timestamptz default now()
);

-- Workouts
create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  quest_title text,
  series int,
  repetitions int,
  weight float,
  completed_at timestamptz default now()
);
```

---

## Você Tem Liberdade Para:

1. **Mudar a infraestrutura** se encontrar melhor opção gratuita
2. **Adaptar o schema** conforme necessidade do código
3. **Sugerir outro LLM** se Groq/BazaarLink não funcionar bem
4. **Implementar memória** no Supabase se Hermes não for possível
5. **Ideias novas** são bem-vindas!

---

## Como Proceder

1. Primeiro faz um plano dasChanges necessárias
2. Me mostre o plano antes de fazer
3. Execute passo a passo
4. Teste tudo ao final

Se tiver dúvidas sobre qual provider usar ou como estruturar, me pergutne primeiro!