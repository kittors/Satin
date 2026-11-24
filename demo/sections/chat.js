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
  "最后一班车进站时，车灯穿过雨幕照亮她的侧脸，这里用特写。", "要不要把结尾改成她没有上车？留白会更有余味。", "按电影感的风格重新生成了画面描述。", "已经把第 7 到第 9 个镜头的时长各缩短了 1 秒。", "配音换成了温柔一点的女声，语速放慢了 10%。"];
const AI_LONG = ["这一集的情绪主线是等待。前半段用冷色和远景拉开距离，让观众先看见空旷；进候车厅以后，暖光和中近景把人拉近；最后车灯打在脸上的那一下，是整集唯一的高光，之后立刻收回到她的背影。",
  "我对比了原文和现在的分镜：原文里有两处心理描写没有画面对应，一处是她想起父亲送她上车，一处是她数站台的灯。建议给前一处加一个 2 秒的闪回空镜，后一处用一个慢慢摇过灯的长镜头。"];
const DOCS = [["第三集分镜脚本（终版）.docx", "DOCX"], ["雨夜车站 · 人物小传.pdf", "PDF"], ["镜头时长统计表.xlsx", "XLSX"], ["配乐参考.zip", "ZIP"]];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// 点开看大图用高清的那一张（同样的裁切）
const hiRes = (g) => HI(g);

// 演示历史（固定种子，翻多少遍都一样）：一问一答像真的对话——用户提要求，助手说改了什么；同一天里一句话不出现第二次，
// 每天的顺序都打乱；偶尔用户发参考图、试音、文件，助手发生成的画面、成片，回答跟着说到它。每天 36 条（18 轮），往上翻能翻到一万条左右
// （2026-11-21 用户要求去掉 AI 腔：原来的生成器从 8 句里随机抽，同一句挨着出现两次，不像真的对话——differences 28）
const TURNS = [
  ["先按小说的原文拆一下第三集", "第三集拆成了 12 个镜头：车站外 3 个、候车厅 5 个、站台 4 个，节奏比上一版快一点。"],
  ["开头的雨夜要冷一点", "开头三个镜头的色温降到 5200K，路灯改成冷白，积水里的倒影也跟着偏蓝了。"],
  ["她进候车厅那一段再慢一点", "候车厅那段从 18 秒放到 24 秒，第 6 个镜头加了一个她收伞的停顿。"],
  ["结尾就按你说的，不上车", "结尾改成车门关上、她站在原地，最后一个镜头停在空站台，留 3 秒黑场。"],
  ["配音用温柔一点的女声", "换成了温柔一点的女声，语速放慢了 10%，第 9 个镜头的旁白提前半秒进。"],
  ["镜头 8 的构图换成侧面", "镜头 8 改成侧面中景，她在画面左边三分之一，右边留给进站的车灯。"],
  ["可以，先生成看看", "第 3 到第 5 个镜头的画面生成好了，候车厅那张的灯光偏暖，要不要再压一点？"],
  ["这一版比上一版好多了", "这一版存成了第三集的定稿，旧版本放进历史记录，随时能找回来。"],
  ["第 2 个镜头太长了", "第 2 个镜头从 6 秒剪到 4 秒，雨刚停的那一下留着，后面推镜头的部分去掉了。"],
  ["车灯那一下能再亮一点吗", "车灯那一帧的曝光提高了一档，打在她脸上的高光更明显，背景没有跟着变亮。"],
  ["把她想起父亲那段加进来", "第 7 个镜头后面加了一个 2 秒的闪回空镜：月台上一只旧行李箱，不出人脸。"],
  ["站台的灯一共几盏", "站台上 9 盏灯。原文里她数到第 7 盏时车进站，我把数灯做成了一个慢慢摇过去的长镜头。"],
  ["雨声和音乐别打架", "下雨的段落音乐压低了 6 分贝，雨声留着，车进站前 2 秒音乐再起来。"],
  ["整集现在多长", "现在 2 分 48 秒，比要求的 3 分钟短 12 秒，可以给结尾的空站台再留几秒。"],
  ["候车厅的长椅换成木头的", "长椅换成了旧木条的，扶手上有磨损，和候车厅的暖光更搭。"],
  ["她的伞换个颜色", "伞改成深红色。冷色的雨夜里只有这一点颜色，观众一眼就能找到她。"],
  ["第 4 集也先拆一下", "第 4 集初拆成 10 个镜头，第一场接着第三集的空站台，从第二天早上开始。"],
  ["字幕小一点", "字幕从 28 号改成 24 号，离画面底边留 8%，手机上也不会挡到脸。"],
  ["开头加一个片名", "片名放在第 1 个镜头的远景上：白色细体，2 秒淡入、停 2 秒、淡出。"],
  ["这个转场太硬了", "第 5、第 6 个镜头之间改成 12 帧的叠化，雨声先过去，画面再接上。"],
  ["她的表情再克制一点", "第 9 个镜头的描述去掉了\"流泪\"，改成\"看着车门，嘴角收紧\"，重新生成了两版。"],
  ["背景里的广告牌去掉", "广告牌换成了褪色的站名牌，只留\"雨花站\"三个字，不抢视线。"],
  ["今天先到这，明天弄第 4 集", "第三集的改动都存好了，明天从第 4 集的第一场接着来。"],
  ["整理一下这一集的情绪线", AI_LONG[0]],
  ["对照原文看看有没有漏的", AI_LONG[1]],
  ["镜头时长导一份给我", "导出了镜头时长表，按镜头号排好，每个镜头写了景别和对应的原文段落。"],
];
// 用户发的不是字（参考图、试音、文件）时，助手接着说到它
const AFTER = {
  image: ["参考图的色调记下了：冷蓝、低饱和、有雾，后面三个镜头都按它调。", "这张参考图的机位比现在的低，第 2 个镜头的机位也跟着放低了一点。", "参考图里站台的灯是暖黄的，和现在的冷白不一样，两种各出了一版。"],
  audio: ["试音听过了，语速刚好，第 3 句后面的停顿可以再长半拍。", "这一版旁白的情绪对了，只是\"末班车\"三个字读得太快，标出来了。"],
  file: ["这份文件里的镜头号和时长和现在的分镜对了一遍，有两处不一致，已经标出来了。", "人物小传里她的年龄是 26 岁，第 4 个镜头的描述写成了学生，已经改过来。"],
};
// 数字和后面的字之间换成不断行空格：窄屏上"车站外 3 个"不会把"3"和"个"拆到两行（样子和普通空格一样）
const NB = (s) => s.replace(/(\d) (?=[\u4e00-\u9fff])/g, "$1\u00a0");
for (const t of TURNS) { t[0] = NB(t[0]); t[1] = NB(t[1]); }
for (const k in AFTER) AFTER[k] = AFTER[k].map(NB);
function demoHistory() {
  let rnd = 11, oldestDay = 0, left = 41, lastTurn = -1;
  const TOTAL_EST = 12000;
  const rand = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  const TODAY = new Date(2026, 10, 19), WEEK = "日一二三四五六";
  const dayLabel = (k) => { if (k === 0) return "今天"; if (k === 1) return "昨天"; const d = new Date(TODAY - k * 864e5); return k < 7 ? `星期${WEEK[d.getDay()]}` : `${d.getMonth() + 1} 月 ${d.getDate()} 日`; };
  const shot = () => 1 + ((rand() * 48) | 0);
  // 一页历史：segs 天，每天 18 轮一问一答（36 条），初始 8 天（~288 条），向上可按需/置顶/无缝加载至 12,000+ 条
  function page(segs) {
    const out = [];
    for (let s = segs - 1; s >= 0; s--) {
      out.push({ kind: "day", text: dayLabel(oldestDay + s) });
      // 这一天的顺序：把全部问答打乱取前 18 轮（同一天里不重复）；和前一天最后一轮不一样
      const order = TURNS.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = (rand() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]]; }
      if (order[0] === lastTurn) [order[0], order[1]] = [order[1], order[0]];
      const used = new Set(); // 这一天已经说过的"接着附件说的话"：同一天不说第二遍，说完了就不再发这种附件
      const after = (kind) => { const left = AFTER[kind].filter((x) => !used.has(x)); if (!left.length) return null; const x = left[(rand() * left.length) | 0]; used.add(x); return x; };
      for (let t = 0; t < 18; t++) {
        const [ask, answer] = TURNS[order[t]], r = rand();
        const hh = 9 + Math.floor((t * 38) / 60), mm = (t * 38 + ((rand() * 14) | 0)) % 60;
        const tm = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        const durSec = +(1.1 + rand() * 2.4).toFixed(1), tps = +(58 + rand() * 34).toFixed(1);
        // 当天最后一轮：展示支持 Markdown 的用户输入 + 多格式高亮工具调用（JSON / Diff / Shell / 代码）
        if (oldestDay === 0 && s === 0 && t === 17) {
          out.push({
            kind: "msg", me: true, type: "text", time: tm,
            text: "把第三集开头按下面两项调整一下：\n- **镜头 01–03** 色温降到 `5200K`，对比度调至 `1.08`\n- 导出雨夜预览并核对音频压限配置",
          });
          out.push({
            kind: "ai", me: false, ph: "done", open: false, secs: 1.8,
            think: "先读取第三集全部分镜的时间轴与色温元数据，确认开场三个雨夜镜头的灯光偏移量；接着写入 `ep03.grade.json` 补丁，通过 FFmpeg 渲染雨夜预览帧，并补充实时调色着色器片段供复查。",
            tools: [
              {
                id: "t1", kind: "read", name: "read_storyboard", label: "读取 ep03 · 12 个镜头元数据", path: "storyboard/ep03.json", status: "done", ms: 180,
                args: { episode: 3, fields: ["shot", "lut", "tempK", "duration"] },
                result: { shots: 12, avgTempK: 5840, totalDuration: "02:48", targetRange: [1, 3] },
              },
              {
                id: "t2", kind: "edit", name: "edit_color_grade", label: "更新雨夜冷调参数", path: "storyboard/ep03.grade.json", status: "done", ms: 340,
                diff: [
                  "--- a/storyboard/ep03.grade.json",
                  "+++ b/storyboard/ep03.grade.json",
                  "@@ -4,7 +4,9 @@",
                  '   "shots": [1, 2, 3],',
                  '-  "tempK": 5840,',
                  '-  "contrast": 1.00,',
                  '+  "tempK": 5200,',
                  '+  "contrast": 1.08,',
                  '+  "lut": "rain_night_5200k.cube",',
                  '+  "rainDuckDb": -6',
                  " }",
                ].join("\n"),
              },
              {
                id: "t3", kind: "bash", name: "run_preview_render", label: "渲染雨夜预览与响度校验", status: "done", ms: 620, exitCode: 0,
                command: '$ ffmpeg -i ep03_raw.mov -vf "lut3d=rain_night_5200k.cube,eq=contrast=1.08" -af "loudnorm=I=-16" out/ep03_preview.mp4',
                output: "frame=  432 fps=118.4 q=22.0 Lsize=   8420kB time=00:00:18.00\n[loudnorm] integrated=-16.1 LUFS  true_peak=-1.4 dBTP  OK",
              },
              {
                id: "t4", kind: "code", name: "export_grade_preset", label: "生成调色预设脚本", path: "presets/rainNight.ts", lang: "ts", status: "done", ms: 150,
                code: [
                  "export interface GradePreset { tempK: number; contrast: number; rainDuckDb: number }",
                  "export const rainNightPreset: GradePreset = {",
                  "  tempK: 5200,",
                  "  contrast: 1.08,",
                  "  rainDuckDb: -6, // 雨声保留，车进站前 2 秒音乐回升",
                  "};",
                ].join("\n"),
              },
            ],
            text: "已按要求调整完成：\n\n1. **色温与对比度**：镜头 `01–03` 统一降至 **5200K** 冷雨夜基调，对比度提升至 `1.08`，积水与路灯反射层次更清晰。\n2. **雨声与配乐平衡**：下雨段落音乐压低 `6 dB`，雨声完整保留，末班车进站前 2 秒音乐柔和抬起。",
            time: tm, durSec: 2.4, tps: 78.6, acts: true,
          });
          continue;
        }
        // 用户这一轮：多半是一句话，偶尔是参考图、试音、文件（助手的回答跟着说到它）
        const kind = r < .06 ? "image" : r < .075 ? "audio" : r < .09 ? "file" : null, reply = kind && after(kind);
        if (reply) {
          if (kind === "image") out.push({ kind: "msg", me: true, type: "image", g: SCENES[(rand() * SCENES.length) | 0], cap: "参考：雨夜的站台", time: tm });
          else if (kind === "audio") out.push({ kind: "msg", me: true, type: "audio", dur: `0:${20 + ((rand() * 39) | 0)}`, seed: 1 + ((rand() * 50) | 0), name: "旁白试音.mp3", time: tm });
          else { const d = DOCS[(rand() * DOCS.length) | 0]; out.push({ kind: "msg", me: true, type: "file", name: d[0], ext: d[1], size: 2e5 + rand() * 4e6, time: tm }); }
          out.push({ kind: "msg", me: false, type: "text", text: reply, time: tm, durSec, tps }); continue;
        }
        out.push({ kind: "msg", me: true, type: "text", text: ask, time: tm });
        // 助手这一轮：多半是一段话；偶尔先发生成的画面或成片，再说明
        const q = rand();
        if (q < .1) out.push({ kind: "msg", me: false, type: "image", g: SCENES[(rand() * SCENES.length) | 0], cap: `第 ${shot()} 个镜头的画面`, time: tm });
        else if (q < .14) out.push({ kind: "msg", me: false, type: "video", g: `url("${CLIP.poster}") center / cover`, src: CLIP.src, poster: CLIP.poster, dur: `0:0${3 + ((rand() * 6) | 0)}`, cap: `第 ${shot()} 个镜头 · 成片`, time: tm });
        out.push({ kind: "msg", me: false, type: "text", text: answer, time: tm, durSec, tps });
      }
      lastTurn = order[17];
    }
    oldestDay += segs; return out;
  }
  return {
    total: TOTAL_EST,
    initial: () => page(8),
    // 模拟网络：单批加载 320～520ms，多批快载时更轻快
    async older(step = 0) { await wait(step > 0 ? 110 : 340 + Math.random() * 180); const b = page(8); left--; return b; },
    hasMore: () => left > 0,
  };
}

// 模拟网络：一阵一阵地来，块大小、间隔都不均匀
async function* network(text, ctx) {
  let i = 0; const chars = [...text];
  while (i < chars.length && !ctx.stopped) { const n = 2 + ((Math.random() * 9) | 0); yield chars.slice(i, i + n).join(""); i += n; await wait(Math.random() < .12 ? 260 + Math.random() * 300 : 20 + Math.random() * 90); }
}
const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", SCENES[0]], ["04", "全景 · 6 秒", "她收起伞走进候车厅", SCENES[2]], ["05", "特写 · 3 秒", "车灯照亮她的侧脸", SCENES[3]]];
// 剧本：思考（实时读秒）→ 3 个带高亮的工具调用（JSON / Diff / Shell）→ 匀速流式正文 → 三张镜头卡片 → 生成一张画面
async function* script(prompt, ctx) {
  await wait(340); if (ctx.stopped) return;
  for await (const t of network(prompt.includes("图") ? "先看参考图的色调：冷蓝、低饱和、有雾。再对一下第三集开头的三个镜头，它们现在偏暖，和参考不一致。打算把色温降下来，景别保持不变。" : "先检索第三集对应的镜头参数，核对色调、景别和时长，然后写入调色补丁并运行预览渲染命令核对输出。", ctx)) yield { think: t };
  if (ctx.stopped) return;
  yield { tool: { id: "inspect", kind: "read", name: "read_storyboard", label: "读取第三集 48 个镜头", path: "storyboard/ep03.json", args: { episode: 3, range: "01-05" } } };
  await wait(520); if (ctx.stopped) return;
  yield { toolUpdate: { id: "inspect", status: "done", ms: 520, result: { matched: 3, currentTempK: 5900, durationSec: 13 } } };
  yield { tool: { id: "grade", kind: "edit", name: "apply_color_lut", label: "写入 5200K 雨夜冷调补丁", path: "storyboard/ep03.grade.json" } };
  await wait(620); if (ctx.stopped) return;
  yield { toolUpdate: { id: "grade", status: "done", ms: 620, diff: "--- a/storyboard/ep03.grade.json\n+++ b/storyboard/ep03.grade.json\n@@ -2,4 +2,5 @@\n-  \"tempK\": 5900,\n-  \"shot3Framing\": \"medium\"\n+  \"tempK\": 5200,\n+  \"lut\": \"rain_night_5200k\",\n+  \"shot3Framing\": \"close_up\"" } };
  yield { tool: { id: "render", kind: "bash", name: "run_preview_render", label: "运行预览帧渲染", command: '$ ffmpeg -i ep03.mov -vf "lut3d=rain_night_5200k.cube" preview/shot_03_05.mp4' } };
  await wait(560); if (ctx.stopped) return;
  yield { toolUpdate: { id: "render", status: "done", ms: 560, exitCode: 0, output: "rendered 3 frames (5200K) -> preview/shot_03_05.mp4 [consistency: 0.96]" } };
  yield* network("改好了。开头三个镜头的色温都降到了 **5200K**，雨夜更冷峻一些；第 3 个镜头切成了侧面特写，车灯穿过雨幕照亮侧脸的高光会更突出。\n\n下面是更新后的三个镜头，预览帧已按新设定重新生成：", ctx);
  if (ctx.stopped) return;
  for (let k = 1; k <= 3; k++) { await wait(k === 1 ? 120 : 110); if (ctx.stopped) return; yield { card: CARDS[k - 1] }; }
  yield { image: { g: SCENES[(Math.random() * SCENES.length) | 0] } };
  for (let p = 0; p < 1 && !ctx.stopped; ) { await wait(120); p = Math.min(1, p + .06 + Math.random() * .06); yield { imageProgress: p }; }
  if (ctx.stopped) return;
  yield { imageDone: true };
  await wait(240);
}

export function initChat(ctx = {}) {
  const box = document.getElementById("chatBox"), chat = mountChat(box, { history: demoHistory(), respond: script, hiRes, rail: "left", traceMode: "visible", toolStyle: "timeline", historyMode: "auto", userMarkdown: true, submitKey: "enter" });
  const sec = box.closest(".spec") || document;
  // 过程展示、工具样式、历史加载、用户 Markdown、排版密度、刻度轨与输入框磨砂配置切换
  const bindSeg = (name, fn, def = 0) => { const el = sec.querySelector(`[data-seg="${name}"]`); if (el && ctx.initSeg) ctx.initSeg(el, fn, def); };
  bindSeg("chattrace", (v) => chat.setTraceMode(v), 0);
  bindSeg("chattool", (v) => chat.setToolStyle(v), 0);
  bindSeg("chathist", (v) => chat.setHistoryMode(v), 0);
  bindSeg("chatmd", (v) => chat.setUserMarkdown(v === "on"), 0);
  bindSeg("chatdensity", (v) => chat.setDensity(v), 0);
  bindSeg("chatrail", (v) => chat.setRail(v === "off" ? false : v), 0);
  bindSeg("chatblur", (v) => chat.setComposerBlur(v), 2);
  // 演示按钮
  sec.addEventListener("click", (e) => {
    const sim = e.target.closest("[data-chat-sim]")?.dataset.chatSim; if (!sim) return;
    if (sim === "stream") chat.send("把第三集开头的雨夜再调冷一点，并重新出预览");
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
    title: "新对话", placeholder: "随心输入",
    empty: { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] },
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
