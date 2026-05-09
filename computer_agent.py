import base64
import json
import subprocess
import time
import mss
import pyautogui
import io
from PIL import Image

SCREENSHOT_PATH = "screenshot.png"
OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "llava"  

def capture_screen():
    with mss.mss() as sct:
        sct.shot(output=SCREENSHOT_PATH)
    return SCREENSHOT_PATH

def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def send_to_ollama(image_b64, user_prompt):
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_b64}"}}
                ]
            }
        ],
        "stream": False
    }
    
    result = subprocess.run(
        ["curl", "-s", "-X", "POST", OLLAMA_URL, "-H", "Content-Type: application/json", "-d", json.dumps(payload)],
        capture_output=True, text=True
    )
    
    try:
        return json.loads(result.stdout)["message"]["content"]
    except:
        return None

def parse_action(response):
    response = response.lower()
    
    if "click" in response:
        if "right" in response:
            parts = response.replace("click", "").strip().split()
            if len(parts) >= 2 and parts[0].isdigit() and parts[1].isdigit():
                pyautogui.click(int(parts[0]), int(parts[1]), button="right")
                return f"Clicou direito em ({parts[0]}, {parts[1]})"
        else:
            parts = response.replace("click", "").strip().split()
            if len(parts) >= 2 and parts[0].isdigit() and parts[1].isdigit():
                pyautogui.click(int(parts[0]), int(parts[1]))
                return f"Clicou em ({parts[0]}, {parts[1]})"
    
    elif "type" in response or "write" in response:
        text = response.replace("type", "").replace("write", "").strip()
        pyautogui.write(text, interval=0.05)
        return f"Digitou: {text}"
    
    elif "press" in response:
        key = response.replace("press", "").strip()
        pyautogui.press(key)
        return f"Pressionou: {key}"
    
    elif "move" in response:
        parts = response.replace("move", "").strip().split()
        if len(parts) >= 2 and parts[0].isdigit() and parts[1].isdigit():
            pyautogui.moveTo(int(parts[0]), int(parts[1]))
            return f"Moveu para ({parts[0]}, {parts[1]})"
    
    elif "scroll" in response:
        direction = "up" if "up" in response else "down"
        amount = 3
        pyautogui.scroll(-amount if direction == "down" else amount)
        return f"Rolou {direction}"
    
    return None

def run_agent_loop(task, max_iterations=10):
    print(f"\n=== INICIANDO: {task} ===\n")
    
    for i in range(max_iterations):
        print(f"Iteração {i+1}/{max_iterations}")
        
        img_path = capture_screen()
        img_b64 = encode_image(img_path)
        
        prompt = f"""Você é um agente de computador. Analise a tela e execute a tarefa: "{task}"

Se a tarefa já foi concluída, responda: "FINALIZADO"
Se precisa de mais ações, descreva a próxima ação a executar no formato:
- "click X Y" (clicar em coordenadas)
- "type TEXTO" (digitar texto)
- "press TECLA" (pressionar tecla como enter, escape, etc)
- "scroll up" ou "scroll down"
- "move X Y" (mover mouse)

Coordenadas atuais da tela: 1920x1080 (pode usar valores de 0-1920 e 0-1080)
"""
        
        response = send_to_ollama(img_b64, prompt)
        
        if not response:
            print("Erro na comunicação com Ollama")
            break
        
        print(f"Resposta: {response[:200]}...")
        
        if "FINALIZADO" in response.upper():
            print("\n=== TAREFA CONCLUÍDA ===\n")
            break
        
        action_result = parse_action(response)
        if action_result:
            print(f"Ação: {action_result}")
        else:
            print("Não foi possível parsear ação")
        
        time.sleep(1)
    
    print("Limite de iterações atingido")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        task = " ".join(sys.argv[1:])
    else:
        task = input("Digite a tarefa: ")
    
    run_agent_loop(task)