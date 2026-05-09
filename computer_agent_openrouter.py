import os
import json
import base64
import subprocess
import time
import mss
import pyautogui

SCREENSHOT_PATH = "screenshot.png"
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
MODEL = "openai/gpt-4o-mini"

SYSTEM_PROMPT = """Você é um assistente de computer use. Sua tarefa é analisar screenshots do computador do usuário e executar ações para completar tarefas.

IMPORTANTES INSTRUÇÕES:
- Você vê o que está na tela via screenshot
- Sempre retorne APENAS ações específicas para executar
- Nunca invente coordenadas - analise o screenshot e determine coordenadas reais
- Se a tarefa foi concluída, responda: "DONE"

AÇÕES DISPONÍVEIS (retorne em formato JSON):
1. click_x_y para clicar em coordenadas
2. type_x_y_text para digitar em campo específico  
3. press_key para pressionar teclas (enter, escape, tab, etc)
4. scroll_direction para rolar (up/down)
5. move_x_y para mover o mouse

Responda em JSON:
{"action": "click", "x": 500, "y": 300}
{"action": "type", "x": 500, "y": 300, "text": "Olá mundo"}
{"action": "press", "key": "enter"}
{"action": "scroll", "direction": "down"}
{"action": "move", "x": 500, "y": 300}
{"action": "done"}
"""

def capture_screen():
    with mss.mss() as sct:
        sct.shot(output=SCREENSHOT_PATH)
    return SCREENSHOT_PATH

def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def call_openrouter(image_b64, conversation_history):
    if not OPENROUTER_API_KEY:
        print("ERRO: Defina OPENROUTER_API_KEY como variável de ambiente")
        return None

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com",
        "X-Title": "ComputerAgent"
    }
    
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(conversation_history)
    
    messages.append({
        "role": "user", 
        "content": [
            {"type": "text", "text": "Analise esta tela e execute a próxima ação. Lembre de retornar APENAS JSON."},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_b64}"}}
        ]
    })
    
    payload = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": 1000
    }
    
    result = subprocess.run(
        ["curl", "-s", "-X", "POST", url, "-H", f"Authorization: Bearer {OPENROUTER_API_KEY}", 
         "-H", "Content-Type: application/json", "-d", json.dumps(payload)],
        capture_output=True, text=True, shell=True
    )
    
    try:
        response = json.loads(result.stdout)
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Erro: {e}")
        print(f"Response: {result.stdout}")
        return None

def parse_and_execute(response):
    try:
        data = json.loads(response.strip("```json").strip("```").strip())
        action = data.get("action", "")
        
        if action == "click":
            x, y = data.get("x", 0), data.get("y", 0)
            pyautogui.click(x, y)
            return f"Clicou em ({x}, {y})"
        
        elif action == "type":
            x, y = data.get("x", 0), data.get("y", 0)
            text = data.get("text", "")
            if x and y:
                pyautogui.click(x, y)
                time.sleep(0.3)
            pyautogui.write(text, interval=0.05)
            return f"Digitou: {text}"
        
        elif action == "press":
            key = data.get("key", "")
            pyautogui.press(key)
            return f"Pressionou: {key}"
        
        elif action == "scroll":
            direction = data.get("direction", "down")
            amount = -3 if direction == "down" else 3
            pyautogui.scroll(amount)
            return f"Rolou {direction}"
        
        elif action == "move":
            x, y = data.get("x", 0), data.get("y", 0)
            pyautogui.moveTo(x, y)
            return f"Moveu para ({x}, {y})"
        
        elif action == "done":
            return "TAREFA_CONCLUIDA"
        
    except json.JSONDecodeError:
        if "DONE" in response.upper():
            return "TAREFA_CONCLUIDA"
        print(f"Não consegui parsear: {response[:200]}")
    return None

def run_agent(task, max_iterations=10):
    if not OPENROUTER_API_KEY:
        print("Defina sua API key: $env:OPENROUTER_API_KEY='sua-key-aqui'")
        print("Get free key at: https://openrouter.ai/settings/keys")
        return
    
    print(f"\n=== Agent started: {task} ===\n")
    conversation_history = [{"role": "user", "content": f"Tarefa: {task}"}]
    
    for i in range(max_iterations):
        print(f"[{i+1}/{max_iterations}] Capturando tela...")
        
        capture_screen()
        img_b64 = encode_image(SCREENSHOT_PATH)
        
        print(f"[{i+1}/{max_iterations}] Analisando...")
        response = call_openrouter(img_b64, conversation_history)
        
        if not response:
            print("Erro na API")
            break
        
        print(f"[{i+1}/{max_iterations}] Resposta: {response[:150]}...")
        
        result = parse_and_execute(response)
        
        if result == "TAREFA_CONCLUIDA":
            print("\n=== TAREFA CONCLUÍDA ===\n")
            break
        
        if result:
            print(f"Ação: {result}")
            conversation_history.append({"role": "assistant", "content": response})
        
        time.sleep(1)
    
    print("Limite atingido")

if __name__ == "__main__":
    import sys
    task = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else input("Tarefa: ")
    run_agent(task)