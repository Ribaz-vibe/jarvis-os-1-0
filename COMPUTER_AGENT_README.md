# Computer Agent com OpenRouter (Minimax/gpt-4o-mini)

##安装

```powershell
pip install pyautogui mss pillow
```

## 配置 API Key (免费)

1. Acesse: https://openrouter.ai/settings/keys
2. Crie uma chave gratuita
3. Defina no terminal:
   ```powershell
   $env:OPENROUTER_API_KEY="sua-chave-aqui"
   ```

## 使用

```powershell
python computer_agent_openrouter.py "abrir navegador e buscar python"
```

Ou edite `run_agent.bat` e coloque sua key diretamente.

## 说明

- Usa gpt-4o-mini (muito barato, ~$0.001/input)
- Captura tela → analiza → executa ação
- Loop até tarefa concluída ou limite (10 iterações)
- Clique direito não suportado (só click básico)