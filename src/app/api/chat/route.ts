import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Você é o J.A.R.V.I.S., um assistente pessoal de IA sofisticado e elegante.
Seu papel é ajudar o "Comandante" (usuário) com:
- Organização e produtividade
- Análise de padrões de hábito
- Sugestões de foco edeep work
- Motivação e accountability
- Respostas directas e úteis

Sempre seja útil, conciso e mantenha o tom futuristaelegante do Jarvis.
O usuário está gerenciando hábitos, treino RPG e produtividade.`.trim();

export async function POST(req: Request) {
  try {
    const { message, history, model } = await req.json();
    
    // Primeiro tenta usar a API key do header (enviada pelo cliente)
    // Depois fallback para variável de ambiente do servidor
    const clientApiKey = req.headers.get('x-api-key');
    const serverApiKey = process.env.OPENROUTER_API_KEY;
    
    const apiKey = clientApiKey || serverApiKey;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key não configurada. Configure no Settings ou variável de ambiente.' }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        'HTTP-Referer': clientApiKey ? 'http://localhost:3000' : 'https://jarvis-os-1-0.vercel.app',
        'X-OpenRouter-Title': 'Jarvis OS',
      },
    });

    const selectedModel = model || 'meta-llama/llama-3.2-3b-instruct:free';

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((msg: any) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || 'Desculpe, não consegui responder.';

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Falha ao conectar com o modelo' 
    }, { status: 500 });
  }
}
