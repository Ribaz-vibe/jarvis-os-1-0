@echo off
REM Configurar API Key (substitua SUA_KEY_AQUI pela sua chave)
set OPENROUTER_API_KEY=SUA_KEY_AQUI

REM Executar o agente
python computer_agent_openrouter.py %*

pause