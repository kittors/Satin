// 展示页接线：从 kit-md.js 拆出来的 initMarkdown 和演示数据。
// Satin：Markdown 渲染（不依赖第三方库）。
// 支持：标题（带锚点）、段落、粗体 / 斜体 / 删除线、行内代码、链接、自动链接、列表（有序 / 无序 / 任务 / 嵌套）、引用、提示块（> [!NOTE]）、
// 表格（对齐、表头吸顶、限高滚动）、分隔线、代码块（高亮、行号、复制、换行开关、文件名、超高折叠）、图片（定高 / 定宽 / 比例、占位、失败、图注、点开放大）、
// 公式（TeX 常用写法 → 浏览器原生 MathML：行内 $…$，块级 $$…$$；写法不认识时原样显示源码，不报错）。
// 高度都能定：renderMarkdown(el, md, { codeMax, imgH, tableMax })，或容器上的 CSS 变量 --md-code-max / --md-img-h / --md-table-max；
// 单个块在 Markdown 里写：```ts title=app.ts maxh=120 wrap nonum   ![说明](url "图注" =x160)   =320x  =320x180  =16:9
// 媒体：图片的写法，地址是视频（mp4 / webm / mov）就是视频播放器，是音频（mp3 / m4a / wav / ogg）就是音频条。
// HTML：白名单里的标签（折叠块、图、视频、音频、表格、kbd、mark……）照样渲染，属性也只放行白名单；script / style / iframe 连内容一起去掉。
// 能动的 HTML：```html preview 的代码块在沙箱 iframe 里运行（脚本、动画都能跑，碰不到外面的页面），可以在"预览 / 代码"之间切换，高度跟着内容走。
// 安全：Markdown 的文字都转义；链接只放行 http(s)、mailto、站内地址，图片、海报另外放行 data:image。
// 半截的 Markdown（流式输出时）也能渲：没闭合的代码块按代码块显示，没闭合的公式按原文显示。
import { renderMarkdown } from "../../packages/satin-ui/src/markdown.js";
import { scrollArea } from "../../packages/satin-ui/src/scroll.js";
// 样例里的照片、视频、音乐都是网上的真实素材（Unsplash、Mixkit，可免费商用，直接用原站地址）
const UNSPLASH = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
const MIXKIT_VIDEO = "https://assets.mixkit.co/videos/4451/4451-720.mp4", MIXKIT_MUSIC = "https://assets.mixkit.co/music/127/127.mp3";
const SAMPLE = `# 分镜生成说明

把**一集剧本**拆成镜头，每个镜头写清楚景别、时长和画面。生成时按镜头逐个出图，再按 \`timeline.json\` 合成视频。相关接口见 [接口文档](https://example.com/api "TaleFrame 接口")。

> [!NOTE]
> 时长按 24 帧算：第 $n$ 帧的时间是 $t = \\frac{n}{24}$ 秒。

## 镜头清单

| 镜头 | 景别 | 时长 | 状态 |
| :-- | :-: | --: | :-- |
| 07 · 车站外，雨刚停 | 远景 | 4 秒 | 已完成 |
| 08 · 林夏走进候车厅 | 全景 | 6 秒 | 生成中 |
| 09 · 站台上的最后一班车 | 中景 | 5 秒 | 待开始 |
| 10 · 车窗里的倒影 | 特写 | 3 秒 | 待开始 |

## 生成前检查

- [x] 角色设定图已经上传
- [x] 每个镜头都有景别和时长
- [ ] 背景音乐的节拍对齐到镜头切换
  - 节拍点从音频里自动识别
  - 可以手动拖动微调

1. 先出**关键帧**，确认构图
2. 再补中间帧，保持人物一致
3. 最后加字幕和音效

## 画面参考

![夜里停在站台边的电车](${UNSPLASH("1516900557549-41557d405adf")} "镜头 07 · 车站外，雨刚停（默认高度，完整显示）")

![积水映着街景](${UNSPLASH("1589803196988-17b417281773")} "镜头 08 · 积水里的倒影（单独写了 =x120，只有 120 高）" =x120)

![这张图的地址写错了](./not-found.png "加载失败的样子")

## 视频和音频

还是图片的写法，地址是视频或音频就渲染成播放器：

![镜头 12 粗剪](${MIXKIT_VIDEO} "镜头 12 · 夜里安静的街道（视频：Mixkit）")

![Valley Sunset](${MIXKIT_MUSIC} "配乐候选 · Alejandro Magaña (A. M.)（音乐：Mixkit）")

## 写在 Markdown 里的 HTML

常用的标签直接渲染：按 <kbd>⌘</kbd> <kbd>K</kbd> 打开命令面板，<mark>待审核</mark> 的镜头排在最前面，第 3<sup>集</sup>、H<sub>2</sub>O 这类上下标也行。

<details>
<summary>为什么镜头 09 要重拍</summary>

雨停得太早，站台上没有积水，车灯照不出倒影。改成**雨还没停**，镜头再往前推半步。

</details>

<figure>
<img src="${UNSPLASH("1541702467897-41915a07d3a7", 1200)}&h=675" alt="雨衣和橙色汽车经过路口" width="560" height="315">
<figcaption>用 figure 和 figcaption 写的图注</figcaption>
</figure>

<script>alert("这一段不会运行")</script>

## 能动的 HTML

代码块的语言写成 \`html preview\`，就在沙箱里运行：脚本和动画都能跑，碰不到外面的页面；左上角切到"代码"看源码。

\`\`\`html preview
<div class="slate">
  <div class="clap" id="clap"></div>
  <div class="board">
    <div><span>场次</span><b>12</b></div>
    <div><span>镜头</span><b id="take">3</b></div>
    <div><span>日期</span><b>11.20</b></div>
  </div>
</div>
<button id="go">打板</button>
<style>
  body { display: flex; flex-wrap: wrap; align-items: center; gap: 24px; padding-top: 40px; } /* 打板时板子往上转，上面留出地方；窄了按钮换到下一行 */
  .slate { width: 240px; max-width: 100%; border-radius: 12px; background: var(--sn-label); color: var(--sn-raised); }
  .clap { height: 30px; border-radius: 12px 12px 0 0; transform-origin: 10px 100%;
    background: repeating-linear-gradient(-45deg, var(--sn-label) 0 16px, var(--sn-raised) 16px 32px);
    box-shadow: inset 0 -2px 0 var(--sn-label); transition: transform .5s cubic-bezier(.34, 1.56, .64, 1); }
  .slate.open .clap { transform: rotate(-22deg); transition-duration: .18s; transition-timing-function: cubic-bezier(.22, 1, .36, 1); }
  .board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px 16px 16px; }
  .board span { display: block; font-size: 11px; opacity: .6; }
  .board b { display: inline-block; font-size: 22px; line-height: 28px; font-variant-numeric: tabular-nums; }
  button { height: 32px; padding: 0 16px; border: 0; border-radius: 99px; background: var(--sn-accent); color: var(--sn-on-primary);
    font-family: inherit; font-size: 13px; font-weight: 500; line-height: 32px; white-space: nowrap; cursor: pointer; transition: transform .1s; }
  button:active { transform: scale(.96); }
</style>
<script>
  const slate = document.querySelector(".slate"), take = document.getElementById("take");
  document.getElementById("go").onclick = () => {
    slate.classList.add("open");
    setTimeout(() => {
      slate.classList.remove("open");
      take.textContent = Number(take.textContent) + 1;
      take.animate([{ transform: "translateY(-50%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.22, 1, .36, 1)" });
    }, 260);
  };
</script>
\`\`\`

## 代码

按镜头请求生成，失败的镜头自动重试三次：

\`\`\`ts title=storyboard.ts
// 逐个镜头生成，失败重试三次，返回每个镜头的结果
export async function generateShots(shots, { retry = 3, signal } = {}) {
  const results = [];
  for (const shot of shots) {
    let last = null;
    for (let k = 0; k < retry; k++) {
      try {
        const res = await fetch(\`/api/shots/\${shot.id}/render\`, { method: "POST", signal });
        if (!res.ok) throw new Error(\`镜头 \${shot.id} 生成失败：\${res.status}\`);
        results.push({ id: shot.id, url: (await res.json()).url });
        last = null;
        break;
      } catch (err) {
        last = err;
        await new Promise((r) => setTimeout(r, 400 * 2 ** k)); // 退避：0.4s、0.8s、1.6s
      }
    }
    if (last) results.push({ id: shot.id, error: last.message });
  }
  return results;
}

// 合成：按镜头顺序拼起来，转场默认 12 帧
export function timeline(results, fps = 24) {
  let t = 0;
  return results.filter((r) => !r.error).map((r) => {
    const item = { id: r.id, url: r.url, start: t };
    t += r.duration ?? 4;
    return item;
  });
}

const config = { fps: 24, transition: 12, size: [1920, 1080], audio: true };
console.log(timeline([], config.fps));
\`\`\`

服务端的处理函数（Go）：

\`\`\`go
func (h *Handler) Render(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	shot, err := h.store.Shot(r.Context(), id)
	if err != nil {
		http.Error(w, "镜头不存在", http.StatusNotFound)
		return
	}
	job := h.queue.Push(shot) // 排队，前面最多 32 个
	json.NewEncoder(w).Encode(map[string]any{"job": job.ID, "eta": job.ETA.Seconds()})
}
\`\`\`

\`\`\`json maxh=120
{
  "fps": 24,
  "size": [1920, 1080],
  "shots": [
    { "id": "07", "scale": "远景", "duration": 4, "done": true },
    { "id": "08", "scale": "全景", "duration": 6, "done": false },
    { "id": "09", "scale": "中景", "duration": 5, "done": false }
  ],
  "audio": { "bgm": "rain-night.mp3", "beats": null }
}
\`\`\`

\`\`\`bash
# 本地跑起来
pnpm install && pnpm dev --port 5173
curl -X POST "http://localhost:8080/api/shots/07/render" -H "Authorization: Bearer $TOKEN"
\`\`\`

## 公式

整集时长等于镜头时长加转场时长：

$$
T = \\sum_{i=1}^{n} d_i + \\sum_{j=1}^{n-1} g_j
$$

转场的透明度按时间变化：

$$
\\alpha(t) = \\begin{cases} 0, & t < t_0 \\\\ \\dfrac{t - t_0}{\\Delta t}, & t_0 \\le t \\le t_0 + \\Delta t \\\\ 1, & t > t_0 + \\Delta t \\end{cases}
$$

调色用一个 3×3 矩阵：

$$
\\begin{bmatrix} R' \\\\ G' \\\\ B' \\end{bmatrix} = \\begin{bmatrix} 1.2 & -0.1 & 0 \\\\ 0 & 1.05 & 0 \\\\ 0.05 & 0 & 0.9 \\end{bmatrix} \\begin{bmatrix} R \\\\ G \\\\ B \\end{bmatrix}
$$

曝光量按梯形法近似：$E = \\int_{0}^{T} L(t)\\,\\mathrm{d}t \\approx \\frac{\\Delta t}{2} \\sum_{k=0}^{N-1} \\left( L_k + L_{k+1} \\right)$，其中 $L_k \\in \\mathbb{R}^{+}$。

> 不认识的写法原样显示，不会把整篇弄坏：$\\foo{x}$

---

> [!WARNING]
> 生成中的镜头不能删除，先取消再删。
`;
export function initMarkdown({ $, initSeg }) {
  const host = $("#mdDoc"); if (!host) return;
  // 预览限高（.md-doc 的 max-height），在里面套一层滚动视口渲染：滚动条用组件库的，上下渐隐
  const box = scrollArea(host, { inner: true, fade: "y" }).vp;
  const md = renderMarkdown(box, SAMPLE, { codeMax: 240, imgH: 220, tableMax: 0 });
  const src = $("#mdSrc"), wrap = $(".sn-md-demo");
  scrollArea(src, { fade: "none" }); // 源码输入框也用滚动区域的滚动条
  src.value = SAMPLE; let t = 0;
  src.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => md.update(src.value), 120); });
  initSeg($('[data-seg="mdcode"]'), (v) => md.set({ codeMax: +v }), 1);
  initSeg($('[data-seg="mdimg"]'), (v) => md.set({ imgH: v === "auto" ? "auto" : +v }), 1);
  initSeg($('[data-seg="mdtable"]'), (v) => md.set({ tableMax: +v }), 0);
  initSeg($('[data-seg="mdview"]'), (v) => { wrap.dataset.view = v; if (v !== "src") md.update(src.value); }, 0);
  box._md = md;
}
