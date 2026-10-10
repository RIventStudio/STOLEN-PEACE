import os
import random
import subprocess
from PIL import Image, ImageDraw

def capture_stolen_peace(url="https://riventstudio.github.io/STOLEN-PEACE/", output_path=r"C:\Users\alexa\.gemini\antigravity\scratch\STOLEN-PEACE\docs\preview_live_styled.png", width=2560, height=1440, tab_title="STOLEN PEACE — RIventStudio"):
    abs_out = os.path.abspath(output_path)
    os.makedirs(os.path.dirname(abs_out), exist_ok=True)
    temp_raw = abs_out + ".raw.png"
    
    # Chrome headless capture with virtual time budget for rendering dynamic elements
    ps_cmd = f"Start-Process -FilePath 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' -ArgumentList '--headless', '--disable-gpu', '--virtual-time-budget=2000', '--window-size={width},{height}', '--screenshot=\"{temp_raw}\"', '\"{url}\"' -Wait"
    subprocess.run(["pwsh", "-NoProfile", "-Command", ps_cmd], check=True)
    
    if not os.path.exists(temp_raw):
        raise FileNotFoundError(f"Chrome did not generate {temp_raw}")
        
    content_img = Image.open(temp_raw)
    
    header_h = 74
    full_w = content_img.width
    full_h = content_img.height + header_h
    
    window_img = Image.new("RGB", (full_w, full_h), "#181a1f")
    draw = ImageDraw.Draw(window_img)
    
    # Chrome Tab
    draw.rectangle([10, 8, 280, 38], fill="#282c34")
    draw.text((25, 17), tab_title[:32], fill="#e8eaed")
    
    # Window controls
    draw.ellipse([full_w - 70, 15, full_w - 60, 25], fill="#5f6368")
    draw.ellipse([full_w - 45, 15, full_w - 35, 25], fill="#5f6368")
    draw.ellipse([full_w - 20, 15, full_w - 10, 25], fill="#5f6368")
    
    # Address Bar
    draw.rectangle([80, 42, full_w - 90, 68], fill="#202228")
    draw.text((95, 48), url, fill="#9aa0a6")
    
    # Paste webpage content
    window_img.paste(content_img, (0, header_h))
    
    # Human-like screenshot jitter (+- 50px crop margin)
    x1 = max(0, random.randint(18, 46))
    y1 = max(0, random.randint(12, 44))
    x2 = min(full_w, full_w - random.randint(18, 48))
    y2 = min(full_h, full_h - random.randint(18, 48))
    
    cropped = window_img.crop((x1, y1, x2, y2))
    cropped.save(abs_out, "PNG")
    
    if os.path.exists(temp_raw):
        os.remove(temp_raw)
        
    print(f"Captured proof: {abs_out} ({cropped.size}) [crop jitter: x1={x1}, y1={y1}, x2={x2}, y2={y2}]")

if __name__ == "__main__":
    import sys
    url = sys.argv[1] if len(sys.argv) > 1 else "https://riventstudio.github.io/STOLEN-PEACE/"
    out = sys.argv[2] if len(sys.argv) > 2 else r"C:\Users\alexa\.gemini\antigravity\scratch\STOLEN-PEACE\docs\preview_live_styled.png"
    capture_stolen_peace(url, out)
