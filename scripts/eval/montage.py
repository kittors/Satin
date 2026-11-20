# 评测截图拼图（不开浏览器，直接用 score.mjs 截好的图）：一行一份（需求 × 写法），每行 浅色桌面（截前 900 高）+ 深色手机（截前 844 高）。
# 用法：python3 scripts/eval/montage.py <批次目录> <输出.jpg> [--cond with|without] [--task id,id] [--cols 1]
# 例：python3 scripts/eval/montage.py /tmp/satin-eval/b1/clirelay_gpt-6-luna eval/sheets/b1-with.jpg --cond with
import sys, os
from PIL import Image, ImageDraw, ImageFont

args = sys.argv[1:]
base, out = args[0], args[1]
opt = lambda k, d=None: args[args.index("--" + k) + 1] if "--" + k in args else d
cond = opt("cond", "with"); tasks = opt("task"); tasks = tasks.split(",") if tasks else None
DW, DH, PW, PH = 720, 450, 195, 422  # 桌面缩到一半宽、手机缩到一半宽
try: font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 18)
except Exception: font = ImageFont.load_default()
rows = []
for fw in ["react", "vue", "html"]:
    d = os.path.join(base, cond, fw)
    if not os.path.isdir(d): continue
    for t in sorted(os.listdir(d)):
        if tasks and t not in tasks: continue
        s = os.path.join(d, t, "_shots")
        if os.path.isdir(s): rows.append((f"{cond} · {fw} · {t}", os.path.join(s, "light-desktop.png"), os.path.join(s, "dark-phone.png")))
rows.sort(key=lambda r: (r[0].split(" · ")[2], r[0].split(" · ")[1]))
H = 30 + max(DH, PH)
sheet = Image.new("RGB", (DW + PW + 30, H * len(rows) + 10), (128, 128, 128))
draw = ImageDraw.Draw(sheet)
for i, (label, ld, dp) in enumerate(rows):
    y = i * H + 5
    draw.text((10, y + 4), label, fill=(255, 255, 255), font=font)
    for j, (f, w, h, x) in enumerate([(ld, DW, DH, 10), (dp, PW, PH, DW + 20)]):
        if os.path.exists(f):
            im = Image.open(f).convert("RGB"); sw = w / im.width
            im = im.crop((0, 0, im.width, min(im.height, int(h / sw)))).resize((w, min(h, int(im.height * sw))))
            sheet.paste(im, (x, y + 28))
        else:
            draw.text((x + 10, y + 60), "没有截图", fill=(255, 255, 255), font=font)
os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
sheet.save(out, quality=82)
print(out, len(rows), "行", sheet.size)
