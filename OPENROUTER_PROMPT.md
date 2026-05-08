# Prompt: Configurar OpenRouter no Jarvis

## O que precisa fazer

A IA deve completar todos os passos abaixo para ativar o Agente IA do Jarvis gratuitamente:

---

### Passo 1: Criar conta OpenRouter

1. Acessar https://openrouter.ai
2. Fazer login com Google/GitHub (conta Google do usuário)
3. Ir para seção "Keys"
4. Criar uma chave API nova
5. Copiar a chave (formato: `sk-or-v1-...`)

---

### Passo 2: Adicionar variável na Vercel

1. Ir para https://vercel.com/dashboard
2. Selecionar o projeto **jarvis-os-1-0**
3. Ir em **Settings** → **Environment Variables**
4. Adicionar nova variável:
   - Nome: `OPENROUTER_API_KEY`
   - Valor: (colar a chave criada no passo 1)
5. Salvar

---

### Passo 3: Redeploy

1. Ir em **Deployments** no Vercel
2. Clicar no último deployment
3. Clicar em **"Redeploy"**

---

### Passo 4:Testar

1. Acessar https://jarvis-os-1-0.vercel.app/ai
2. Enviar uma mensagem para o Jarvis
3. Verificar se responde corretamente

---

## Código já atualizado

O arquivo `src/app/api/chat/route.ts` já foi modificado para usar OpenRouter - só precisa adicionar a variável na Vercel.

---

## Resultado esperado

- ✅ Agente IA funcionando
- ✅ Modelo gratuito (Llama 3.2 3B)
- ✅ Sem custo
- ✅ Acessível do celular