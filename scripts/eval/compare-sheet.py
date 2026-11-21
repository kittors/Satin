# 改进前后对照拼图：同一个需求，"没有技能（第 1 轮）"和"有技能（最后一轮）"并排——行是写法（React / Vue / 纯 HTML），
# 列是 没有技能·浅色桌面、有技能·浅色桌面、没有技能·深色手机、有技能·深色手机。截图来自 score.mjs。
# 用法：python3 scripts/eval/compare-sheet.py <没有技能那批的模型目录> <有技能那批的模型目录> <输出目录>
# 例：python3 scripts/eval/compare-sheet.py /tmp/satin-eval/b1/clirelay_gpt-6-luna /tmp/satin-eval/b4/clirelay_gpt-6-luna eval/sheets/compare
import sys, os
from PIL import Image, ImageDraw, ImageFont

before, after, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
DW, DH, PW, PH = 560, 350, 160, 346
try: font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 16)
except Exception: font = ImageFont.load_default()
tasks = sorted(set(os.listdir(os.path.join(before, "without", "react"))) & set(os.listdir(os.path.join(after, "with", "react"))))
def tile(f, w, h):
    if not os.path.exists(f): return None
    im = Image.open(f).convert("RGB"); s = w / im.width
    im = im.crop((0, 0, im.width, min(im.height, int(h / s)))); return im.resize((w, min(h, int(im.height * s))))
for t in tasks:
    rows = []
    for fw in ["react", "vue", "html"]:
        cells = [tile(os.path.join(before, "without", fw, t, "_shots", "light-desktop.png"), DW, DH), tile(os.path.join(after, "with", fw, t, "_shots", "light-desktop.png"), DW, DH),
                 tile(os.path.join(before, "without", fw, t, "_shots", "dark-phone.png"), PW, PH), tile(os.path.join(after, "with", fw, t, "_shots", "dark-phone.png"), PW, PH)]
        rows.append((fw, cells))
    W = DW * 2 + PW * 2 + 50; H = 40 + len(rows) * (max(DH, PH) + 30)
    sheet = Image.new("RGB", (W, H), (110, 110, 110)); d = ImageDraw.Draw(sheet)
    xs = [10, DW + 20, DW * 2 + 30, DW * 2 + PW + 40]
    for x, lab in zip(xs, ["没有技能 · 浅色桌面", "有 Satin 技能 · 浅色桌面", "没有 · 深色手机", "有 · 深色手机"]): d.text((x, 10), lab, fill=(255, 255, 255), font=font)
    y = 40
    for fw, cells in rows:
        d.text((10, y), fw, fill=(255, 255, 255), font=font); y += 22
        for x, c in zip(xs, cells):
            if c: sheet.paste(c, (x, y))
            else: d.text((x + 8, y + 40), "没有截图", fill=(255, 255, 255), font=font)
        y += max(DH, PH) + 8
    f = os.path.join(out, f"{t}.jpg"); sheet.save(f, quality=82); print(f, sheet.size)
