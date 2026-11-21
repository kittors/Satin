// 展示页接线：聊天演示。组件本身（packages/satin-ui/src/chat.js）不带数据，这里给它：
// · 演示用的历史（33 天、往上滚还能再加载 30 页，每页 8 天，每天 36 条，内容是剧本里的台词、真实照片、视频、音频、文件）
// · 剧本式的回答（思考 → 步骤 → 正文 → 镜头卡片 → 生成画面），走组件公开的 respond 接口
// · 演示按钮：快速滚到最早、模拟收到消息、模拟发送失败
import { mountChat, createChat } from "../../packages/satin-ui/src/chat.js";
import { DEMO_ATTACHMENTS } from "./input.js";

// 对话里的画面都是网上的真实照片（Unsplash，可免费商用，直接用原站地址）：夜里的车站、雨、街道
const PHOTO = (id) => `url("https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&h=450&q=70") center / cover`;
const HI = (g) => g.replace("w=720&h=450", "w=1920&h=1200");
// 点开看大图用高清的那一张（同样的裁切）
// 演示用的视频（Mixkit）：真地址、真封面（视频第一帧）
const CLIP = { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" };
const SCENES = ["1516900557549-41557d405adf", "1541702467897-41915a07d3a7", "1554103577-c0d26e9b90e0", "1576514864427-f0809d2b66eb", "1589803196988-17b417281773", "1774979300738-5c8c05e1db6b"].map(PHOTO);
const AI_LINES = ["第三集我拆成了 12 个镜头，节奏比上一版快一点。", "开头建议用远景：雨刚停，广场积水里倒映着路灯，镜头慢慢推近站门。", "林夏进候车厅那一段可以用全景，暖黄的灯光和外面的冷色形成对比。",
  "最后一班车进站时，车灯穿过雨幕照亮她的侧脸，这里用特写。", "要不要把结尾改成她没有上车？留白会更有余味。", "好的，我按电影感的风格重新生成了画面描述。", "已经把第 7 到第 9 个镜头的时长各缩短了 1 秒。", "配音换成了温柔一点的女声，语速放慢了 10%。"];
const AI_LONG = ["这一集的情绪主线是等待。前半段用冷色和远景拉开距离，让观众先看见空旷；进候车厅以后，暖光和中近景把人拉近；最后车灯打在脸上的那一下，是整集唯一的高光，之后立刻收回到她的背影。",
  "我对比了原文和现在的分镜：原文里有两处心理描写没有画面对应，一处是她想起父亲送她上车，一处是她数站台的灯。建议给前一处加一个 2 秒的闪回空镜，后一处用一个慢慢摇过灯的长镜头。"];
const DOCS = [["第三集分镜脚本（终版）.docx", "DOCX"], ["雨夜车站 · 人物小传.pdf", "PDF"], ["镜头时长统计表.xlsx", "XLSX"], ["配乐参考.zip", "ZIP"]];
const ME_LINES = ["先按小说的原文拆一下第三集", "开头的雨夜要冷一点", "她进候车厅那一段再慢一点", "结尾就按你说的，不上车", "配音用温柔一点的女声", "镜头 8 的构图换成侧面", "可以，先生成看看", "这一版比上一版好多了"];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// 点开看大图用高清的那一张（同样的裁切）
const hiRes = (g) => HI(g);

// 演示历史：和改造前一模一样的生成器（固定种子，翻多少遍都一样）
function demoHistory() {
  let rnd = 11, oldestDay = 0, left = 30;
  const rand = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  const TODAY = new Date(2026, 10, 19), WEEK = "日一二三四五六";
  const dayLabel = (k) => { if (k === 0) return "今天"; if (k === 1) return "昨天"; const d = new Date(TODAY - k * 864e5); return k < 7 ? `星期${WEEK[d.getDay()]}` : `${d.getMonth() + 1} 月 ${d.getDate()} 日`; };
  // 一页历史：segs 天，每天 36 条，按时间从旧到新
  function page(segs) {
    const out = [];
    for (let s = segs - 1; s >= 0; s--) {
      out.push({ kind: "day", text: dayLabel(oldestDay + s) });
      for (let i = 0; i < 36; i++) {
        const me = rand() < .4, r = rand();
        if (r < .05) out.push({ kind: "msg", me, type: "image", g: SCENES[(rand() * SCENES.length) | 0], cap: me ? "参考：雨夜的站台" : "第 " + (1 + ((rand() * 48) | 0)) + " 个镜头的画面" });
        else if (r < .065) out.push({ kind: "msg", me: false, type: "video", g: `url("${CLIP.poster}") center / cover`, src: CLIP.src, poster: CLIP.poster, dur: `0:0${3 + ((rand() * 6) | 0)}`, cap: "第 " + (1 + ((rand() * 48) | 0)) + " 个镜头 · 成片" });
        else if (r < .075 && me) out.push({ kind: "msg", me, type: "audio", dur: `0:${20 + ((rand() * 39) | 0)}`, seed: 1 + ((rand() * 50) | 0), name: "旁白试音.mp3" });
        else if (r < .085 && me) { const d = DOCS[(rand() * DOCS.length) | 0]; out.push({ kind: "msg", me, type: "file", name: d[0], ext: d[1], size: 2e5 + rand() * 4e6 }); }
        else out.push({ kind: "msg", me, type: "text", text: me ? ME_LINES[(rand() * ME_LINES.length) | 0] : r > .82 ? AI_LONG[(rand() * AI_LONG.length) | 0] : AI_LINES[(rand() * AI_LINES.length) | 0] });
      }
    }
    oldestDay += segs; return out;
  }
  return {
    initial: () => page(33),
    // 模拟网络：400～700ms 以后才来
    async older() { await wait(400 + Math.random() * 300); const b = page(8); left--; return b; },
    hasMore: () => left > 0,
  };
}

// 模拟网络：一阵一阵地来，块大小、间隔都不均匀
async function* network(text, ctx) {
  let i = 0; const chars = [...text];
  while (i < chars.length && !ctx.stopped) { const n = 2 + ((Math.random() * 9) | 0); yield chars.slice(i, i + n).join(""); i += n; await wait(Math.random() < .12 ? 260 + Math.random() * 300 : 20 + Math.random() * 90); }
}
const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", SCENES[0]], ["04", "全景 · 6 秒", "她收起伞走进候车厅", SCENES[2]], ["05", "特写 · 3 秒", "车灯照亮她的侧脸", SCENES[3]]];
// 剧本：思考 → 两个步骤 → 正文 → 三张镜头卡片 → 生成一张画面
async function* script(prompt, ctx) {
  for await (const t of network(prompt.includes("图") ? "先看参考图的色调：冷蓝、低饱和、有雾。再对一下第三集开头的三个镜头，它们现在偏暖，和参考不一致。打算把色温降下来，景别保持不变。" : `用户的意思是：${prompt.slice(0, 18)}。先找到第三集里对应的镜头，再看哪些参数要改：色调、景别还是时长。改完要重新生成画面，顺便检查前后镜头的衔接。`, ctx)) yield { think: t };
  if (ctx.stopped) return;
  yield { step: { t: "读取第三集的 48 个镜头", s: "run" } }; await wait(650); if (ctx.stopped) return;
  yield { stepUpdate: { index: 0, s: "done" } };
  yield { step: { t: "调整开头几个镜头的色调和景别", s: "run", n: "0/3" } };
  for (let k = 1; k <= 3; k++) { await wait(330); if (ctx.stopped) return; yield { stepUpdate: { index: 1, n: `${k}/3` } }; }
  yield { stepUpdate: { index: 1, s: "done", n: "" } };
  yield* network("改好了。开头三个镜头的色温都降了，雨夜更冷一些；第 3 个镜头换成了特写，车灯打在她脸上的那一下会更突出。\n\n下面是改过的三个镜头，画面已经按新的设定重新生成：", ctx);
  if (ctx.stopped) return;
  for (let k = 1; k <= 3; k++) { await wait(k === 1 ? 120 : 110); if (ctx.stopped) return; yield { card: CARDS[k - 1] }; }
  yield { image: { g: SCENES[(Math.random() * SCENES.length) | 0] } };
  for (let p = 0; p < 1 && !ctx.stopped; ) { await wait(120); p = Math.min(1, p + .06 + Math.random() * .06); yield { imageProgress: p }; }
  if (ctx.stopped) return;
  yield { imageDone: true };
  await wait(300);
}

export function initChat() {
  const box = document.getElementById("chatBox"), chat = mountChat(box, { history: demoHistory(), respond: script, hiRes });
  // 演示按钮
  (box.closest(".spec") || document).addEventListener("click", (e) => {
    const sim = e.target.closest("[data-chat-sim]")?.dataset.chatSim; if (!sim) return;
    if (sim === "incoming") chat.receive({ text: AI_LINES[(Math.random() * AI_LINES.length) | 0] });
    if (sim === "fail") chat.sendText("这条会发送失败，点感叹号重发", { fail: true });
    if (sim === "top") chat.scrollToOldest();
  });
  initNewChat();
}

// 新对话：空状态（图标、标题、说明、建议）+ 输入框的上下文栏、权限标签、模型选择；"重新开始"回到空的样子
function initNewChat() {
  const box = document.getElementById("chatNew"); if (!box) return;
  const opts = {
    title: "新对话", status: "在线", placeholder: "随心输入",
    empty: { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "说说这一集的想法，或者从下面挑一个开始。", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] },
    // 上下文栏：项目（点了只发事件）、在哪跑、哪一集（点开是菜单）；权限：点开选只读 / 自动 / 完全访问（小圆点的颜色表示风险）
    context: [
      { icon: "folder", text: "雨夜车站" },
      { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
      { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }, { value: "final", label: "定稿" }], value: "ep3" },
    ],
    mode: { tone: "warn", options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "full" },
    models: [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }], model: "fine",
    composer: { attachments: DEMO_ATTACHMENTS },
    respond: script, hiRes,
  };
  let chat = createChat(box, opts);
  // 对比工具（scripts/parity）比改造前时先拿掉新加的演示：先销毁（撤掉挂在 body 上的量字节点、观察器），再拿掉元素
  box.closest(".spec")?.addEventListener("parity:drop", () => chat.destroy());
  box.closest(".spec")?.addEventListener("click", (e) => {
    if (!e.target.closest("[data-chat-new-reset]")) return;
    chat.destroy(); box.replaceChildren(); chat = createChat(box, opts);
  });
}
