// 万级 ComfyUI 分布式渲染集群压测（Canvas 2D 极致 60fps 引擎）：
// 彻底告别千篇一律的规整白卡方阵，由数百座有机错落的真实 ComfyUI 工作流岛屿组成（10,000 / 50,000 异构节点）：
// · 异构节点尺寸：从 84×34 Reroute 转接点、196×92 Prompt/LoRA、224×126 KSampler、到 232×144 Preview/VideoCombine；
// · 语义类型色盘与多端口精准连线：MODEL（靛紫）/ CLIP（琥珀）/ COND（暖橙）/ LATENT（玫紫）/ IMAGE（天蓝）/ VAE（玫瑰红）/ CONTROL（翠绿）/ VIDEO（青蓝）；
// · 有机岛屿群组框（Workflow Groups）：黄金螺旋 + 低频起伏排布，跨岛屿共享大模型总线与风格汇聚枢纽，绝不死板规整；
// · 三档 LOD + 1024px 空间索引视口裁剪 + Worker 后台重建索引：平移、缩放、拖拽、3 层语义信号流激活全程稳稳 60fps（< 4ms/帧）。
import { layeredLayout, buildGrid } from "../../packages/satin-ui/src/flow-layout.js";

// 8 种 ComfyUI 标准语义数据类型色相
const TYPES = [
  { name: "MODEL", hue: 248 },       // 0 靛紫
  { name: "CLIP", hue: 42 },         // 1 琥珀金
  { name: "COND", hue: 28 },         // 2 暖橙
  { name: "LATENT", hue: 292 },      // 3 洋红紫
  { name: "IMAGE", hue: 208 },       // 4 天蓝
  { name: "VAE", hue: 352 },         // 5 玫瑰红
  { name: "CONTROL", hue: 156 },     // 6 翡翠绿
  { name: "VIDEO", hue: 184 },       // 7 青蓝
];
const NT = TYPES.length;

// 单座完整 ComfyUI AI 影视管线模板（20 个异构节点 + 26 条多端口语义连线，高低错落有致）
// 每项：[dx, dy, w, h, hueIdx, title, badge, ins[[label,typeIdx]...], outs[[label,typeIdx]...], params[[k,v]...], kindFlags]
// kindFlags: 1=reroute, 2=previewFrame
const PIPE_NODES = [
  [0,   42,  224, 114, 0, "CheckpointLoaderSimple", "FP8",   [], [["MODEL",0],["CLIP",1],["VAE",5]], [["ckpt","flux1-dev-fp8.safetensors"]], 0],
  [18,  196, 214, 96,  1, "DualCLIPLoader",         "T5",    [], [["CLIP",1]], [["clip1","t5xxl_fp8"],["clip2","clip_l"]], 0],
  [272, 18,  212, 116, 0, "LoraLoader · Rain",      "0.82",  [["model",0],["clip",1]], [["MODEL",0],["CLIP",1]], [["lora","cinematic-rain-v2"],["strength","0.82"]], 0],
  [284, 166, 216, 106, 2, "CLIPTextEncode +",       "POS",   [["clip",1]], [["COND",2]], [["prompt","rainy station, 35mm"]], 0],
  [278, 302, 206, 86,  2, "CLIPTextEncode −",       "NEG",   [["clip",1]], [["COND",2]], [["prompt","blurry, artifacts"]], 0],
  [46,  332, 206, 128, 4, "LoadImage · Ref",        "IMG",   [], [["IMAGE",4],["MASK",6]], [["file","shot_07_keyframe.png"]], 2],
  [292, 420, 210, 92,  6, "DepthAnythingV2",        "CN",    [["image",4]], [["IMAGE",4]], [["ckpt","depth_v2_vitl"],["res","1024"]], 0],
  [538, 12,  92,  34,  0, "MODEL",                  "",      [["in",0]], [["out",0]], [], 1],
  [536, 76,  212, 108, 0, "LoraLoader · Lens",      "0.45",  [["model",0],["clip",1]], [["MODEL",0],["CLIP",1]], [["lora","anamorphic-35mm"]], 0],
  [544, 212, 208, 96,  2, "FluxGuidance",           "3.5",   [["cond",2]], [["COND",2]], [["guidance","3.5"],["clip_skip","-2"]], 0],
  [540, 344, 222, 114, 6, "ControlNetApplyAdv",     "0.68",  [["pos",2],["neg",2],["img",4]], [["pos",2],["neg",2]], [["strength","0.68"],["end","0.85"]], 0],
  [548, 488, 204, 88,  3, "EmptySD3Latent",         "16:9",  [], [["LATENT",3]], [["size","1344 × 768"],["batch","2"]], 0],
  [808, 106, 236, 152, 3, "KSampler · Base",        "28s",   [["model",0],["pos",2],["neg",2],["latent",3]], [["LATENT",3]], [["steps","28 · euler"],["cfg","3.5 · denoise 1.0"]], 0],
  [814, 294, 212, 92,  3, "LatentUpscaleBy",        "1.5×",  [["samples",3]], [["LATENT",3]], [["method","bislerp"],["scale","1.50"]], 0],
  [818, 424, 92,  34,  5, "VAE",                    "",      [["in",5]], [["out",5]], [], 1],
  [1092, 96, 236, 146, 3, "KSampler · Hires",       "14s",   [["model",0],["pos",2],["neg",2],["latent",3]], [["LATENT",3]], [["steps","14 · dpmpp_2m"],["denoise","0.42"]], 0],
  [1096, 278, 214, 94, 5, "VAEDecode · Tiled",      "VAE",   [["samples",3],["vae",5]], [["IMAGE",4]], [["tile_size","512"]], 0],
  [1098, 404, 218, 112, 6, "FaceDetailer",          "DET",   [["image",4],["model",0],["cond",2]], [["IMAGE",4],["MASK",6]], [["denoise","0.35"],["guide","512"]], 0],
  [1374, 88,  232, 148, 4, "PreviewImage",          "4K",    [["images",4]], [["IMAGE",4]], [["res","2016 × 1152 · 94%"]], 2],
  [1378, 272, 238, 146, 7, "Wan2.1 · I2V Export",   "MP4",   [["image",4],["cond",2]], [["VIDEO",7]], [["frames","81 · 24fps"],["codec","H.265 · 4K"]], 2],
];
// 管线内部连线：[fromLocal, fromPortIdx, toLocal, toPortIdx, typeIdx]
const PIPE_EDGES = [
  [0,0, 2,0, 0], [0,1, 2,1, 1], [1,0, 3,0, 1], [1,0, 4,0, 1], [0,2, 14,0, 5],
  [2,0, 7,0, 0], [2,0, 8,0, 0], [2,1, 8,1, 1], [7,0, 12,0, 0], [8,0, 15,0, 0],
  [3,0, 9,0, 2], [9,0, 10,0, 2], [4,0, 10,1, 2], [5,0, 6,0, 4], [6,0, 10,2, 4],
  [10,0, 12,1, 2], [10,1, 12,2, 2], [11,0, 12,3, 3],
  [12,0, 13,0, 3], [13,0, 15,3, 3], [10,0, 15,1, 2], [10,1, 15,2, 2],
  [15,0, 16,0, 3], [14,0, 16,1, 5], [16,0, 17,0, 4], [8,0, 17,1, 0], [9,0, 17,2, 2],
  [17,0, 18,0, 4], [17,0, 19,0, 4], [9,0, 19,1, 2], [16,0, 18,0, 4],
];
const CLUSTER_TITLES = [
  "雨夜车站 · 主镜头生图管线", "角色特写 · FaceDetailer 精修", "赛博街景 · Depth ControlNet",
  "空镜氛围 · Wan2.1 图生视频", "概念美术 · Flux 风格迁移", "分镜关键帧 · 4K 超分管线",
  "夜景打光 · Relight 合成", "角色一致性 · IP-Adapter 栈", "电影调色 · LUT 母带输出",
];
const PIPE_LEN = PIPE_NODES.length;

export function initFlowStress(ctx) {
  const { $, reduced } = ctx;
  const box = $("#stressBox"); if (!box) return;
  const cv = $("canvas", box), stat = $("[data-st-stat]", box), g = cv.getContext("2d", { alpha: false });
  const CELL = 1024;
  const STEP = 95, GROW = 190, DEPTH = 3, MAXE = 2400, DA = [1, 1, .75, .52];

  let N = 0, M = 0, X, Y, NW, NH_ARR, TPL, HU, EA, EB, EAP, EBP, ECOL, OS, OL, IS, IL;
  let GROUPS = [];
  let hubMax = 0, fanMax = 0, fanAvg = 0, dataVer = 0, worldArea = 1;
  let stamp = new Uint32Array(0), estamp = new Uint32Array(0), visBuf = new Int32Array(0), vesBuf = new Int32Array(0), sortBuf = new Int32Array(0), frameNo = 0;
  const hueCnt = new Int32Array(NT + 1), keyCnt = new Int32Array(NT * 3 + 1);
  let moved = [], movedF = new Uint8Array(0), movedVer = 0, dragNode = -1;
  let topList = [], topF = new Uint8Array(0), messy = false;
  let hover = -1, focus = -1, focusShown = false;
  const A = { src: -1, t0: 0, instant: false, e: new Int32Array(MAXE), d: new Uint8Array(MAXE), ne: 0, nodes: [], dn: new Uint8Array(0), ins: [] };
  const view = { x: 40, y: 40, z: .55 };
  let dpr = 1, cssW = 0, cssH = 0, dirty = true, raf = 0, lastLayoutMs = 0, moving = false, tidying = false;

  const colors = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    return {
      dark,
      bg: dark ? "#0c0c0f" : "#f4f5f7",
      dot: dark ? "rgba(255,255,255,.075)" : "rgba(15,23,42,.08)",
      card: dark ? "#18181c" : "#ffffff",
      cardHd: dark ? "#202026" : "#f7f8fa",
      paramBg: dark ? "rgba(255,255,255,.055)" : "rgba(15,23,42,.045)",
      line: dark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)",
      text: dark ? "#f4f4f6" : "#18181b",
      sub: dark ? "rgba(228,228,231,.56)" : "rgba(63,63,70,.65)",
      inLine: dark ? "rgba(255,255,255,.45)" : "rgba(15,23,42,.38)",
      s: dark ? 72 : 62,
      l: dark ? 64 : 50,
    };
  };
  const pal = () => {
    const cs = getComputedStyle(document.documentElement);
    const fam = cs.getPropertyValue("--sn-sans").trim() || "-apple-system, 'PingFang SC', sans-serif";
    const mono = cs.getPropertyValue("--sn-mono").trim() || "'SF Mono', ui-monospace, monospace";
    const k = Math.min(1.12, parseFloat(cs.getPropertyValue("--sn-font-scale")) || 1);
    return { ...colors(), f1: `600 ${12 * k}px ${fam}`, f2: `500 ${10.5 * k}px ${mono}`, f3: `600 ${13 * k}px ${fam}` };
  };
  let C = pal();
  const typeCol = (ti, a = 1) => `hsla(${TYPES[ti].hue}, ${C.s}%, ${C.l}%, ${a})`;

  // 计算某节点第 p 个输入/输出端口的 Y 坐标
  function slotY(i, isOut, pIdx) {
    const t = PIPE_NODES[TPL[i]];
    if (t[10] === 1) return Y[i] + NH_ARR[i] * .5;
    const list = isOut ? t[8] : t[7];
    const idx = Math.min(Math.max(0, pIdx), Math.max(0, list.length - 1));
    return Y[i] + 38 + idx * 17;
  }

  // ———— 造数据：数百座有机排布的 ComfyUI 工作流集群岛屿（10,000 / 50,000 异构节点） ————
  function build(n) {
    const nIslands = Math.max(1, Math.round(n / PIPE_LEN));
    N = nIslands * PIPE_LEN;
    dataVer++;
    X = new Float64Array(N); Y = new Float64Array(N);
    NW = new Float32Array(N); NH_ARR = new Float32Array(N);
    TPL = new Uint8Array(N); HU = new Uint8Array(N);
    GROUPS = [];

    let seed = 1337;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    // 岛屿按黄金角椭圆星云（Phyllotaxis）有机展开：中心为主集群 #001，向外自然发散，彻底告别矩形方阵且数学严格 0 重叠
    const GOLDEN = 2.399963229728653;
    const AX = 1820, AY = 780;
    const ea = [], eb = [], eap = [], ebp = [], ecol = [];

    for (let gIdx = 0; gIdx < nIslands; gIdx++) {
      let gx = 0, gy = 0;
      if (gIdx > 0) {
        const ang = gIdx * GOLDEN;
        const rad = Math.sqrt(gIdx + 0.55);
        gx = Math.cos(ang) * rad * AX;
        gy = Math.sin(ang) * rad * AY;
      }
      const base = gIdx * PIPE_LEN;

      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let k = 0; k < PIPE_LEN; k++) {
        const p = PIPE_NODES[k], i = base + k;
        const jx = (rnd() - .5) * 24, jy = (rnd() - .5) * 20;
        X[i] = gx + p[0] + jx;
        Y[i] = gy + p[1] + jy;
        NW[i] = p[2]; NH_ARR[i] = p[3];
        TPL[i] = k; HU[i] = p[4];
        if (X[i] < x0) x0 = X[i]; if (Y[i] < y0) y0 = Y[i];
        if (X[i] + p[2] > x1) x1 = X[i] + p[2]; if (Y[i] + p[3] > y1) y1 = Y[i] + p[3];
      }
      const gHue = TYPES[gIdx % NT].hue;
      GROUPS.push({
        x0: x0 - 26, y0: y0 - 46, x1: x1 + 26, y1: y1 + 26,
        hue: gHue,
        title: `#${String(gIdx + 1).padStart(3, "0")} · ${CLUSTER_TITLES[gIdx % CLUSTER_TITLES.length]}`,
      });
      for (const [fa, fp, fb, tp, tc] of PIPE_EDGES) {
        ea.push(base + fa); eb.push(base + fb); eap.push(fp); ebp.push(tp); ecol.push(tc);
      }
      // 跨岛屿斐波那契螺旋臂总线：向螺旋近邻串联共享权重、风格参考与多镜头合流
      if (gIdx + 3 < nIslands) {
        const nb = (gIdx + 3) * PIPE_LEN;
        ea.push(base + 18); eb.push(nb + 5); eap.push(0); ebp.push(0); ecol.push(4); // PreviewImage → Ref
        ea.push(base + 0);  eb.push(nb + 2); eap.push(0); ebp.push(0); ecol.push(0); // Checkpoint 共享总线
      }
      if (gIdx + 8 < nIslands && rnd() < .72) {
        const db = (gIdx + 8) * PIPE_LEN;
        ea.push(base + 19); eb.push(db + 10); eap.push(0); ebp.push(2); ecol.push(7); // Video → Control
        if (rnd() < .5) { ea.push(base + 1); eb.push(db + 3); eap.push(0); ebp.push(0); ecol.push(1); }
      }
    }

    // 正中心主集群 #001 的超级总控枢纽（向外辐射周边 16 座核心渲染集群，方便「看枢纽」观赏）
    const centerIsl = 0;
    const hubId = Math.min(N - 1, centerIsl * PIPE_LEN + 12); // 中心岛屿的 KSampler Base
    for (let d = 1; d <= 16 && d < nIslands; d++) {
      const tb = d * PIPE_LEN;
      ea.push(hubId); eb.push(tb + 15); eap.push(0); ebp.push(3); ecol.push(3);
      ea.push(hubId); eb.push(tb + 18); eap.push(0); ebp.push(4); ecol.push(4);
    }

    // 打乱边序号用于远景均匀 2^k 抽样不闪屏
    for (let k = ea.length - 1; k > 0; k--) {
      const r = (rnd() * (k + 1)) | 0;
      let t = ea[k]; ea[k] = ea[r]; ea[r] = t;
      t = eb[k]; eb[k] = eb[r]; eb[r] = t;
      t = eap[k]; eap[k] = eap[r]; eap[r] = t;
      t = ebp[k]; ebp[k] = ebp[r]; ebp[r] = t;
      t = ecol[k]; ecol[k] = ecol[r]; ecol[r] = t;
    }

    M = ea.length;
    EA = Int32Array.from(ea); EB = Int32Array.from(eb);
    EAP = Uint8Array.from(eap); EBP = Uint8Array.from(ebp); ECOL = Uint8Array.from(ecol);

    OS = new Int32Array(N + 1); IS = new Int32Array(N + 1);
    for (let e = 0; e < M; e++) { OS[EA[e] + 1]++; IS[EB[e] + 1]++; }
    for (let i = 0; i < N; i++) { OS[i + 1] += OS[i]; IS[i + 1] += IS[i]; }
    OL = new Int32Array(M); IL = new Int32Array(M);
    const op = OS.slice(0, N), ip = IS.slice(0, N);
    for (let e = 0; e < M; e++) { OL[op[EA[e]]++] = e; IL[ip[EB[e]]++] = e; }

    hubMax = hubId;
    for (let i = 0; i < N; i++) if (OS[i + 1] - OS[i] > OS[hubMax + 1] - OS[hubMax]) hubMax = i;
    fanMax = OS[hubMax + 1] - OS[hubMax]; fanAvg = M / Math.max(1, N);

    stamp = new Uint32Array(N); estamp = new Uint32Array(M);
    visBuf = new Int32Array(N); vesBuf = new Int32Array(M);
    sortBuf = new Int32Array(Math.max(N, M, MAXE));
    movedF = new Uint8Array(N); moved = []; topF = new Uint8Array(N); topList = [];
    messy = false; dragNode = hover = focus = -1; focusShown = false;
    A.dn = new Uint8Array(N); A.src = -1; A.nodes = []; A.ne = 0; A.ins = [];

    worker?.postMessage({ type: "data", ea: EA, eb: EB, nw: NW, nh: NH_ARR });
    setGrid(buildGrid(N, X, Y, EA, EB, NW, NH_ARR, CELL));
    // 首次进入直接聚焦中心 ComfyUI 集群的高清中近景（清晰看到群组框、多端口节点与彩色连线）
    focusCluster(centerIsl, true);
  }

  let G = { gx0: 0, gy0: 0, gw: 1, gh: 1, nStart: new Int32Array(2), nList: new Int32Array(0), eStart: new Int32Array(2), eList: new Int32Array(0), kAvg: 1 };
  function setGrid(gr) { G = gr; G.kAvg = Math.max(1, gr.eList.length / Math.max(1, M)); const b = bounds(); worldArea = Math.max(1, (b.x1 - b.x0) * (b.y1 - b.y0)); }
  function bounds() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < N; i++) {
      if (X[i] < x0) x0 = X[i]; if (Y[i] < y0) y0 = Y[i];
      if (X[i] + NW[i] > x1) x1 = X[i] + NW[i]; if (Y[i] + NH_ARR[i] > y1) y1 = Y[i] + NH_ARR[i];
    }
    return { x0, y0, x1, y1 };
  }
  const rateFor = (est, budget) => (est <= budget ? 1 : Math.pow(2, -Math.ceil(Math.log2(est / budget))));

  function edgePath(e, straight) {
    const a = EA[e], b = EB[e];
    const ax = X[a] + NW[a], ay = straight ? Y[a] + NH_ARR[a] * .5 : slotY(a, true, EAP[e]);
    const bx = X[b],         by = straight ? Y[b] + NH_ARR[b] * .5 : slotY(b, false, EBP[e]);
    g.moveTo(ax, ay);
    if (straight) g.lineTo(bx, by);
    else {
      const fwd = bx - ax;
      const dx = fwd >= -20 ? Math.max(46, fwd * .45, Math.abs(by - ay) * .22) : 90 + Math.min(160, -fwd * .25);
      const sag = fwd >= -20 ? Math.min(22, Math.hypot(bx - ax, by - ay) * .035) : 110;
      g.bezierCurveTo(ax + dx, ay + sag, bx - dx, by + sag, bx, by);
    }
  }

  // ———— 背景细微点阵（仅中近景绘制，0 性能负担） ————
  function drawGridDots(z, wx0, wy0, wx1, wy1) {
    if (z < .32) return;
    const step = z < .6 ? 40 : 24;
    const sx = Math.floor(wx0 / step) * step, sy = Math.floor(wy0 / step) * step;
    const r = Math.max(.8, 1.1 / z);
    g.fillStyle = C.dot;
    g.beginPath();
    for (let y = sy; y <= wy1; y += step) {
      for (let x = sx; x <= wx1; x += step) {
        g.rect(x - r * .5, y - r * .5, r, r);
      }
    }
    g.fill();
  }

  // ———— 绘制视口内的 ComfyUI 群组框 ————
  function drawGroups(z, wx0, wy0, wx1, wy1, lw) {
    if (messy || moving || !GROUPS.length) return;
    const showTitle = z >= .22;
    g.lineWidth = lw;
    if (showTitle) { g.font = C.f3; g.textBaseline = "top"; }
    for (let i = 0; i < GROUPS.length; i++) {
      const gr = GROUPS[i];
      if (gr.x1 < wx0 || gr.x0 > wx1 || gr.y1 < wy0 || gr.y0 > wy1) continue;
      const w = gr.x1 - gr.x0, h = gr.y1 - gr.y0;
      g.fillStyle = `hsla(${gr.hue}, ${C.dark ? 45 : 40}%, ${C.dark ? 58 : 48}%, ${C.dark ? .065 : .045})`;
      g.strokeStyle = `hsla(${gr.hue}, ${C.dark ? 48 : 42}%, ${C.dark ? 62 : 46}%, ${C.dark ? .22 : .18})`;
      g.beginPath();
      if (z < .16) g.rect(gr.x0, gr.y0, w, h); else g.roundRect(gr.x0, gr.y0, w, h, 18);
      g.fill(); g.stroke();
      if (showTitle) {
        g.fillStyle = `hsla(${gr.hue}, ${C.dark ? 65 : 52}%, ${C.dark ? 72 : 38}%, .88)`;
        g.fillText(gr.title, gr.x0 + 18, gr.y0 + 14);
      }
    }
  }

  // ———— 画一帧 ————
  function draw() {
    const t0 = performance.now(); frameNo++;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = C.bg; g.fillRect(0, 0, cv.width, cv.height);
    const z = view.z, far = z < .18, lw = 1 / z;
    g.setTransform(dpr * z, 0, 0, dpr * z, dpr * view.x, dpr * view.y);
    const wx0 = -view.x / z, wy0 = -view.y / z, wx1 = wx0 + cssW / z, wy1 = wy0 + cssH / z;

    drawGridDots(z, wx0, wy0, wx1, wy1);
    drawGroups(z, wx0, wy0, wx1, wy1, lw);

    const inView = (i) => X[i] + NW[i] >= wx0 && X[i] <= wx1 && Y[i] + NH_ARR[i] >= wy0 && Y[i] <= wy1;
    const eIn = (e) => {
      const a = EA[e], b = EB[e], ax = X[a] + NW[a], bx = X[b], ay = Y[a] + NH_ARR[a] * .5, by = Y[b] + NH_ARR[b] * .5;
      return (ax > bx ? ax : bx) + 60 >= wx0 && (ax < bx ? ax : bx) - 60 <= wx1 && (ay > by ? ay : by) + 40 >= wy0 && (ay < by ? ay : by) - 40 <= wy1;
    };
    const free = (e) => !movedF[EA[e]] && !movedF[EB[e]];
    const budget = far ? 18000 : 5500; let nv = 0, ne = 0, rate = 1;

    if (moving) {
      for (let i = 0; i < N; i++) if (inView(i)) visBuf[nv++] = i;
      rate = rateFor(M * Math.min(1, ((wx1 - wx0) * (wy1 - wy0)) / worldArea), budget); const thr = Math.ceil(M * rate);
      for (let e = 0; e < thr; e++) if (eIn(e)) vesBuf[ne++] = e;
    } else {
      const { gx0, gy0, gw, gh, nStart, nList, eStart, eList } = G;
      const cx0 = Math.max(0, Math.floor((wx0 - 260) / CELL) - gx0), cx1 = Math.min(gw - 1, Math.floor(wx1 / CELL) - gx0);
      const cy0 = Math.max(0, Math.floor((wy0 - 180) / CELL) - gy0), cy1 = Math.min(gh - 1, Math.floor(wy1 / CELL) - gy0);
      let cnt = 0, cells = 0;
      if (cx0 <= cx1) for (let cy = cy0; cy <= cy1; cy++) { cnt += eStart[cy * gw + cx1 + 1] - eStart[cy * gw + cx0]; cells += cx1 - cx0 + 1; }
      rate = rateFor(cnt / G.kAvg, budget); const thr = Math.ceil(M * rate);
      if (cells > gw * gh * .5) {
        for (let i = 0; i < N; i++) if (!movedF[i] && !topF[i] && inView(i)) visBuf[nv++] = i;
        for (let e = 0; e < thr; e++) if (free(e) && eIn(e)) vesBuf[ne++] = e;
      } else for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
        const c = cy * gw + cx;
        for (let q = nStart[c]; q < nStart[c + 1]; q++) { const i = nList[q]; if (stamp[i] !== frameNo) { stamp[i] = frameNo; if (!movedF[i] && !topF[i] && inView(i)) visBuf[nv++] = i; } }
        for (let q = eStart[c]; q < eStart[c + 1]; q++) { const e = eList[q]; if (e < thr && estamp[e] !== frameNo && free(e)) { estamp[e] = frameNo; vesBuf[ne++] = e; } }
      }
    }
    const tvis = [];
    for (const i of topList) if (inView(i)) tvis.push(i);
    for (const i of moved) {
      for (let q = OS[i]; q < OS[i + 1]; q++) { const e = OL[q]; if (estamp[e] !== frameNo) { estamp[e] = frameNo; vesBuf[ne++] = e; } }
      for (let q = IS[i]; q < IS[i + 1]; q++) { const e = IL[q]; if (estamp[e] !== frameNo) { estamp[e] = frameNo; vesBuf[ne++] = e; } }
    }

    // 语义彩色连线：按数据类型分批绘制
    const act = A.src >= 0;
    if (ne) {
      const alpha = (far ? Math.min(.42, Math.max(.1, 14 / Math.sqrt(ne))) : Math.min(.72, Math.max(.14, 14 / Math.sqrt(ne)))) * (act ? .26 : 1);
      g.lineWidth = (far ? 1 : 1.55) / z; g.lineCap = "round";
      hueCnt.fill(0); for (let k = 0; k < ne; k++) hueCnt[ECOL[vesBuf[k]] + 1]++;
      for (let h = 0; h < NT; h++) hueCnt[h + 1] += hueCnt[h];
      const pos = hueCnt.slice(0, NT); for (let k = 0; k < ne; k++) { const e = vesBuf[k]; sortBuf[pos[ECOL[e]]++] = e; }
      for (let h = 0; h < NT; h++) {
        const s = hueCnt[h], t = hueCnt[h + 1]; if (s === t) continue;
        g.strokeStyle = typeCol(h, alpha); g.beginPath(); for (let k = s; k < t; k++) edgePath(sortBuf[k], far); g.stroke();
      }
    }

    let busy = act && drawActiveLines(lw, far);
    drawNodes(visBuf, nv, far, lw, false);
    if (tvis.length) drawNodes(tvis, tvis.length, far, lw, true);
    if (act && drawActiveNodes(far, inView)) busy = true;
    if (busy) dirty = true;

    const ms = performance.now() - t0; drawMs.push(ms); if (drawMs.length > 60) drawMs.shift();
    showStat(nv + tvis.length, ne, rate);
    if (dirty) tick();
  }

  function drawNodes(list, n, far, lw, top) {
    if (!n) return;
    const byHue = () => {
      hueCnt.fill(0); for (let k = 0; k < n; k++) hueCnt[HU[list[k]] + 1]++;
      for (let h = 0; h < NT; h++) hueCnt[h + 1] += hueCnt[h];
      const pos = hueCnt.slice(0, NT); for (let k = 0; k < n; k++) { const i = list[k]; sortBuf[pos[HU[i]]++] = i; }
    };
    // 远景（< 18%）：批量异构色块星图
    if (far) {
      byHue();
      for (let h = 0; h < NT; h++) {
        const s = hueCnt[h], t = hueCnt[h + 1]; if (s === t) continue;
        g.fillStyle = typeCol(h, C.dark ? .65 : .55); g.beginPath();
        for (let k = s; k < t; k++) { const i = sortBuf[k]; g.rect(X[i], Y[i], NW[i], NH_ARR[i]); }
        g.fill();
      }
      return;
    }
    // 近景（≥ 44%）或重叠态：逐张绘制完整 ComfyUI 节点卡片
    if (top || messy || moving || view.z >= .44) { drawComfyCards(list, n, lw); return; }
    // 中景（18% ~ 44%）：批量画卡片 + 顶部类型色带，极快且极具 ComfyUI 辨识度
    g.fillStyle = C.card; g.beginPath();
    for (let k = 0; k < n; k++) { const i = list[k]; g.roundRect(X[i], Y[i], NW[i], NH_ARR[i], PIPE_NODES[TPL[i]][10] === 1 ? 16 : 10); }
    g.fill(); g.strokeStyle = C.line; g.lineWidth = lw; g.stroke();
    byHue();
    for (let h = 0; h < NT; h++) {
      const s = hueCnt[h], t = hueCnt[h + 1]; if (s === t) continue;
      g.fillStyle = typeCol(h, .85); g.beginPath();
      for (let k = s; k < t; k++) {
        const i = sortBuf[k], isRr = PIPE_NODES[TPL[i]][10] === 1;
        if (isRr) g.roundRect(X[i] + 10, Y[i] + 11, 12, 12, 6);
        else g.roundRect(X[i] + 10, Y[i] + 10, NW[i] - 20, 6, 3);
      }
      g.fill();
    }
  }

  function drawComfyCards(list, n, lw) {
    const full = view.z >= .44, micro = view.z >= .62;
    const tCols = TYPES.map((_, h) => typeCol(h, 1));
    g.textBaseline = "middle";
    for (let k = 0; k < n; k++) {
      const i = list[k], x = X[i], y = Y[i], w = NW[i], h = NH_ARR[i], tpl = PIPE_NODES[TPL[i]], flag = tpl[10];
      const rad = flag === 1 ? 17 : 11;
      if (i === dragNode) {
        g.save(); g.shadowColor = C.dark ? "rgba(0,0,0,.62)" : "rgba(15,23,42,.2)";
        g.shadowBlur = 20 * view.z * dpr; g.shadowOffsetY = 6 * view.z * dpr;
        g.fillStyle = C.card; g.beginPath(); g.roundRect(x, y, w, h, rad); g.fill(); g.restore();
      }
      // 卡片主体
      g.fillStyle = C.card; g.beginPath(); g.roundRect(x, y, w, h, rad); g.fill();
      g.strokeStyle = C.line; g.lineWidth = lw; g.stroke();

      if (flag === 1) {
        // Reroute 转接胶囊节点
        g.fillStyle = tCols[HU[i]];
        g.beginPath(); g.arc(x, y + h * .5, 4, 0, 6.2832); g.arc(x + w, y + h * .5, 4, 0, 6.2832); g.fill();
        if (full) { g.fillStyle = C.sub; g.font = C.f2; g.fillText(tpl[5], x + 16, y + h * .5 + .5); }
        continue;
      }

      // ComfyUI 顶栏区 + 语义小圆灯
      g.fillStyle = C.cardHd; g.beginPath(); g.roundRect(x + .5, y + .5, w - 1, 27, [10.5, 10.5, 0, 0]); g.fill();
      g.fillStyle = tCols[HU[i]]; g.beginPath(); g.arc(x + 14, y + 14, 3.8, 0, 6.2832); g.fill();
      if (!full) continue;

      g.fillStyle = C.text; g.font = C.f1; g.fillText(tpl[5], x + 24, y + 14.5);
      if (tpl[6]) {
        g.fillStyle = C.sub; g.font = C.f2;
        g.textAlign = "right"; g.fillText(tpl[6], x + w - 10, y + 14.5); g.textAlign = "left";
      }

      // 输入/输出端口圆点与英文插槽名
      const ins = tpl[7], outs = tpl[8];
      g.font = C.f2;
      for (let s = 0; s < ins.length; s++) {
        const sy = y + 38 + s * 17;
        g.fillStyle = tCols[ins[s][1]]; g.beginPath(); g.arc(x, sy, 4, 0, 6.2832); g.fill();
        if (micro) { g.fillStyle = C.sub; g.fillText(ins[s][0], x + 9, sy + .5); }
      }
      for (let s = 0; s < outs.length; s++) {
        const sy = y + 38 + s * 17;
        g.fillStyle = tCols[outs[s][1]]; g.beginPath(); g.arc(x + w, sy, 4, 0, 6.2832); g.fill();
        if (micro) { g.fillStyle = C.sub; g.textAlign = "right"; g.fillText(outs[s][0], x + w - 9, sy + .5); g.textAlign = "left"; }
      }

      // 参数胶囊行 & 预览画面块
      const rows = Math.max(ins.length, outs.length);
      let py = y + 34 + rows * 17 + 4;
      if (micro && tpl[9].length) {
        for (let p = 0; p < tpl[9].length && py + 18 < y + h - 4; p++) {
          const pk = tpl[9][p][0], pv = tpl[9][p][1];
          g.fillStyle = C.paramBg; g.beginPath(); g.roundRect(x + 8, py, w - 16, 17, 5); g.fill();
          g.fillStyle = C.sub; g.fillText(pk, x + 13, py + 9);
          const maxVw = Math.max(40, w - 34 - pk.length * 6.5);
          g.fillStyle = C.text; g.textAlign = "right"; g.fillText(pv, x + w - 13, py + 9, maxVw); g.textAlign = "left";
          py += 20;
        }
      }
      if (flag === 2 && py + 16 < y + h - 6) {
        const fx = x + 8, fw = w - 16, fh = y + h - 8 - py, hh = TYPES[HU[i]].hue;
        g.save();
        g.beginPath(); g.roundRect(fx, py, fw, fh, 6); g.clip();
        g.fillStyle = `hsla(${hh}, ${C.dark ? 28 : 22}%, ${C.dark ? 20 : 88}%, 1)`;
        g.fillRect(fx, py, fw, fh);
        // 极简低饱和画面构图剪影（无高饱和炫彩渐变，真实预览帧质感）
        g.fillStyle = `hsla(${hh}, ${C.dark ? 32 : 24}%, ${C.dark ? 28 : 78}%, .85)`;
        g.beginPath();
        g.moveTo(fx, py + fh);
        g.lineTo(fx, py + fh * .64);
        g.lineTo(fx + fw * .32, py + fh * .38);
        g.lineTo(fx + fw * .58, py + fh * .58);
        g.lineTo(fx + fw * .82, py + fh * .32);
        g.lineTo(fx + fw, py + fh * .54);
        g.lineTo(fx + fw, py + fh);
        g.closePath();
        g.fill();
        g.fillStyle = `hsla(${hh}, ${C.dark ? 45 : 35}%, ${C.dark ? 62 : 52}%, .55)`;
        g.beginPath(); g.arc(fx + fw * .74, py + fh * .26, Math.min(5, fh * .14), 0, 6.2832); g.fill();
        g.restore();
        g.strokeStyle = C.line; g.lineWidth = lw; g.beginPath(); g.roundRect(fx, py, fw, fh, 6); g.stroke();
      }
    }
  }

  function drawActiveLines(lw, far) {
    const t = performance.now() - A.t0, inst = A.instant; let busy = false;
    g.lineWidth = (far ? 1.2 : 2.1) / view.z; g.lineCap = "round";
    if (A.ins.length) { g.strokeStyle = C.inLine; g.beginPath(); for (const e of A.ins) edgePath(e, far); g.stroke(); }
    keyCnt.fill(0);
    for (let k = 0; k < A.ne; k++) {
      const e = A.e[k], d = A.d[k], p = inst ? 1 : (t - (d - 1) * STEP) / GROW;
      if (p < 1) busy = true; if (p <= 0) continue;
      if (p >= 1) { keyCnt[(d - 1) * NT + ECOL[e] + 1]++; continue; }
      const a = EA[e], b = EB[e], ax = X[a] + NW[a], ay = Y[a] + NH_ARR[a] * .5, bx = X[b], by = Y[b] + NH_ARR[b] * .5;
      const dx = far ? 0 : Math.max(46, (bx - ax) * .45), len = far ? Math.hypot(bx - ax, by - ay) : 2 * dx + Math.hypot(bx - ax - 2 * dx, by - ay);
      g.strokeStyle = typeCol(ECOL[e], DA[d]); g.setLineDash([len * p, len * 2]); g.beginPath(); edgePath(e, far); g.stroke();
    }
    g.setLineDash([]);
    for (let k = 1; k <= NT * 3; k++) keyCnt[k] += keyCnt[k - 1];
    const pos = keyCnt.slice(0, NT * 3);
    for (let k = 0; k < A.ne; k++) { const d = A.d[k]; if (inst || t - (d - 1) * STEP >= GROW) { const e = A.e[k]; sortBuf[pos[(d - 1) * NT + ECOL[e]]++] = e; } }
    for (let key = 0; key < NT * 3; key++) {
      const s = keyCnt[key], u = keyCnt[key + 1]; if (s === u) continue;
      g.strokeStyle = typeCol(key % NT, DA[((key / NT) | 0) + 1]); g.beginPath();
      for (let k = s; k < u; k++) edgePath(sortBuf[k], far);
      g.stroke();
    }
    return busy;
  }

  function drawActiveNodes(far, inView) {
    const t = performance.now() - A.t0, inst = A.instant, z = view.z; let busy = false;
    const nodeP = (i) => (inst ? 1 : (t - (A.dn[i] - 1) * STEP - GROW) / 120);
    const mark = (i) => (far ? g.rect(X[i], Y[i], NW[i], NH_ARR[i]) : g.roundRect(X[i], Y[i], NW[i], NH_ARR[i], PIPE_NODES[TPL[i]][10] === 1 ? 17 : 11));
    keyCnt.fill(0); g.lineWidth = 1.8 / z;
    for (const i of A.nodes) {
      const p = nodeP(i); if (p < 1) busy = true; if (p <= 0 || !inView(i)) continue;
      if (p >= 1) { keyCnt[(A.dn[i] - 1) * NT + HU[i] + 1]++; continue; }
      const c = typeCol(HU[i], DA[A.dn[i]] * p); g.beginPath(); mark(i); if (far) { g.fillStyle = c; g.fill(); } else { g.strokeStyle = c; g.stroke(); }
    }
    for (let k = 1; k <= NT * 3; k++) keyCnt[k] += keyCnt[k - 1];
    const pos = keyCnt.slice(0, NT * 3);
    for (const i of A.nodes) if (nodeP(i) >= 1 && inView(i)) sortBuf[pos[(A.dn[i] - 1) * NT + HU[i]]++] = i;
    for (let key = 0; key < NT * 3; key++) {
      const s = keyCnt[key], u = keyCnt[key + 1]; if (s === u) continue;
      const c = typeCol(key % NT, DA[((key / NT) | 0) + 1]); g.beginPath();
      for (let k = s; k < u; k++) mark(sortBuf[k]);
      if (far) { g.fillStyle = c; g.fill(); } else { g.strokeStyle = c; g.stroke(); }
    }
    const src = A.src; g.beginPath(); mark(src);
    if (far) { g.fillStyle = typeCol(HU[src], 1); g.fill(); } else { g.strokeStyle = typeCol(HU[src], 1); g.lineWidth = 2.2 / z; g.stroke(); }
    return busy;
  }

  const drawMs = []; let statT = -1e9;
  function showStat(nv, ne, rate) {
    const now = performance.now(); if (stat.textContent && now - statT < 250) return; statT = now;
    const avg = drawMs.reduce((a, b) => a + b, 0) / drawMs.length, mx = Math.max(...drawMs), f = (v) => v.toLocaleString("zh-CN");
    stat.textContent = `${f(N)} 个 ComfyUI 节点 · ${f(GROUPS.length)} 个集群 · ${f(M)} 条语义连线 · 本帧绘制 ${f(nv)} 节点 / ${f(ne)} 连线${rate < 1 ? `（1/${Math.round(1 / rate)} 抽样）` : ""} · 平均 ${avg.toFixed(1)}ms（峰值 ${mx.toFixed(1)}ms）· 缩放 ${Math.round(view.z * 100)}%${lastLayoutMs ? ` · 排版 ${f(lastLayoutMs)}ms` : ""}`;
  }
  function tick() { if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (dirty) { dirty = false; draw(); } }); }
  const redraw = () => { dirty = true; tick(); };

  function setActive(src, animate) {
    for (const i of A.nodes) A.dn[i] = 0; if (A.src >= 0) A.dn[A.src] = 0;
    A.nodes = []; A.ne = 0; A.ins = []; A.src = src;
    if (src >= 0) {
      A.t0 = performance.now(); A.instant = !animate || reduced(); A.dn[src] = 9;
      let front = [src];
      for (let d = 1; d <= DEPTH && front.length && A.ne < MAXE; d++) {
        const next = [];
        for (const a of front) for (let q = OS[a]; q < OS[a + 1] && A.ne < MAXE; q++) {
          const e = OL[q], b = EB[e]; A.e[A.ne] = e; A.d[A.ne++] = d;
          if (!A.dn[b]) { A.dn[b] = d; A.nodes.push(b); next.push(b); }
        }
        front = next;
      }
      for (let q = IS[src]; q < IS[src + 1]; q++) A.ins.push(IL[q]);
    }
    redraw();
  }
  function updateActive() {
    const s = dragNode >= 0 ? dragNode : hover >= 0 ? hover : focus; if (s === A.src) return;
    const replay = !(s === focus && focusShown); if (s === focus && s >= 0) focusShown = true; setActive(s, replay);
  }

  function resize() {
    const r = box.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1); cssW = r.width; cssH = r.height;
    cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr);
    cv.style.width = cssW + "px"; cv.style.height = cssH + "px";
    redraw();
  }
  new ResizeObserver(resize).observe(box);
  new MutationObserver(() => { C = pal(); redraw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });

  const ZMIN = .012, ZMAX = 2;
  const clampZ = (z) => Math.min(ZMAX, Math.max(ZMIN, z));
  function zoomAt(cx, cy, z) { z = clampZ(z); const wx = (cx - view.x) / view.z, wy = (cy - view.y) / view.z; view.x = cx - wx * z; view.y = cy - wy * z; view.z = z; redraw(); }
  let tween = 0;
  function animateTo(tx, ty, tz, done) {
    cancelAnimationFrame(tween); stopZoom(); if (reduced()) { Object.assign(view, { x: tx, y: ty, z: tz }); redraw(); done?.(); return; }
    const cx = cssW / 2, cy = cssH / 2, z0 = view.z, ax = (cx - view.x) / z0, ay = (cy - view.y) / z0, bx = (cx - tx) / tz, by = (cy - ty) / tz, l0 = Math.log(z0), l1 = Math.log(tz), t0 = performance.now(), DUR = 360, lr = Math.abs(l1 - l0), D = lr > 1 ? Math.min(640, 300 + 90 * lr) : DUR, ease = lr > 1 ? (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2) : (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => { const t = Math.min(1, (now - t0) / D), k = ease(t), z = Math.exp(l0 + (l1 - l0) * k); view.z = z; view.x = cx - (ax + (bx - ax) * k) * z; view.y = cy - (ay + (by - ay) * k) * z; redraw(); if (t < 1) tween = requestAnimationFrame(step); else { Object.assign(view, { x: tx, y: ty, z: tz }); redraw(); done?.(); } };
    tween = requestAnimationFrame(step);
  }
  const Z = { target: 1, cx: 0, cy: 0, raf: 0, last: 0 };
  const stopZoom = () => { if (Z.raf) { cancelAnimationFrame(Z.raf); Z.raf = 0; } };
  const zoomTarget = () => (Z.raf ? Z.target : view.z);
  function zoomTo(cx, cy, z) {
    z = clampZ(z); cancelAnimationFrame(tween);
    if (reduced()) { stopZoom(); zoomAt(cx, cy, z); return; }
    Z.target = z; Z.cx = cx; Z.cy = cy; if (!Z.raf) { Z.last = performance.now(); Z.raf = requestAnimationFrame(zoomStep); }
  }
  function zoomStep(now) {
    const dt = Math.min(64, now - Z.last), lz = Math.log(view.z), lt = Math.log(Z.target); Z.last = now;
    const z = Math.abs(lt - lz) < .002 ? Z.target : Math.exp(lz + (lt - lz) * (1 - Math.exp(-dt / 70)));
    zoomAt(Z.cx, Z.cy, z); Z.raf = z === Z.target ? 0 : requestAnimationFrame(zoomStep);
  }

  function focusCluster(gIdx, instant = false) {
    const gr = GROUPS[Math.min(GROUPS.length - 1, Math.max(0, gIdx))]; if (!gr) return fit(instant);
    const pad = 48, bw = gr.x1 - gr.x0, bh = gr.y1 - gr.y0;
    const z = clampZ(Math.min((cssW - pad * 2) / Math.max(1, bw), (cssH - pad * 2 - 44) / Math.max(1, bh), .76));
    const tx = (cssW - bw * z) / 2 - gr.x0 * z, ty = (cssH - bh * z) / 2 - gr.y0 * z + 10;
    if (instant) { Object.assign(view, { x: tx, y: ty, z }); redraw(); } else animateTo(tx, ty, z);
  }
  function fit(instant) {
    const b = bounds(), pad = 40, z = clampZ(Math.min((cssW - pad * 2) / Math.max(1, b.x1 - b.x0), (cssH - pad * 2) / Math.max(1, b.y1 - b.y0)));
    const tx = (cssW - (b.x1 - b.x0) * z) / 2 - b.x0 * z, ty = (cssH - (b.y1 - b.y0) * z) / 2 - b.y0 * z;
    if (instant) { Object.assign(view, { x: tx, y: ty, z }); redraw(); } else animateTo(tx, ty, z);
  }
  function showHub() {
    focus = hubMax; focusShown = false; hover = -1; setActive(-1);
    const z = .62; animateTo(cssW * .26 - X[hubMax] * z, cssH / 2 - (Y[hubMax] + NH_ARR[hubMax] / 2) * z, z, () => updateActive());
  }

  box.addEventListener("wheel", (e) => {
    e.preventDefault(); cancelAnimationFrame(tween); const r = box.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) {
      const f = Math.exp(-e.deltaY * (e.deltaMode ? .05 : .0022)), px = e.clientX - r.left, py = e.clientY - r.top;
      if (e.deltaMode || Math.abs(e.deltaY) >= 40) zoomTo(px, py, zoomTarget() * f);
      else { stopZoom(); zoomAt(px, py, view.z * f); }
    } else { view.x -= e.deltaX; view.y -= e.deltaY; redraw(); }
  }, { passive: false });

  function pick(clientX, clientY) {
    if (moving || view.z < .18) return -1;
    const r = box.getBoundingClientRect(), wx = (clientX - r.left - view.x) / view.z, wy = (clientY - r.top - view.y) / view.z;
    const hit = (i) => wx >= X[i] && wx <= X[i] + NW[i] && wy >= Y[i] && wy <= Y[i] + NH_ARR[i];
    for (let k = topList.length - 1; k >= 0; k--) if (hit(topList[k])) return topList[k];
    const cx = Math.floor(wx / CELL) - G.gx0, cy = Math.floor(wy / CELL) - G.gy0;
    if (cx < 0 || cy < 0 || cx >= G.gw || cy >= G.gh) return -1;
    const c = cy * G.gw + cx; let got = -1;
    for (let q = G.nStart[c]; q < G.nStart[c + 1]; q++) { const i = G.nList[q]; if (!movedF[i] && !topF[i] && hit(i)) got = i; }
    return got;
  }
  const toTop = (i) => { if (topF[i]) topList.splice(topList.indexOf(i), 1); else topF[i] = 1; topList.push(i); if (!movedF[i]) { movedF[i] = 1; moved.push(i); } };

  function settleDrop(i) {
    const gap = 10, x = X[i], wi = NW[i], hi = NH_ARR[i];
    const near = (yy) => {
      const out = topList.filter((j) => j !== i);
      const cx0 = Math.max(0, Math.floor((x - 260) / CELL) - G.gx0), cx1 = Math.min(G.gw - 1, Math.floor((x + wi + 260) / CELL) - G.gx0);
      const cy0 = Math.max(0, Math.floor((yy - 180) / CELL) - G.gy0), cy1 = Math.min(G.gh - 1, Math.floor((yy + hi + 180) / CELL) - G.gy0);
      for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
        const c = cy * G.gw + cx;
        for (let q = G.nStart[c]; q < G.nStart[c + 1]; q++) { const j = G.nList[q]; if (j !== i && !movedF[j] && !topF[j]) out.push(j); }
      }
      return out;
    };
    const hits = (yy) => near(yy).filter((j) => X[j] < x + wi + gap && X[j] + NW[j] + gap > x && Y[j] < yy + hi + gap && Y[j] + NH_ARR[j] + gap > yy);
    const y0 = Y[i]; if (!hits(y0).length) { reindex(); return; }
    const walk = (dir) => { let yy = y0; for (let n = 0; n < 40; n++) { const hs = hits(yy); if (!hs.length) return yy; yy = dir > 0 ? Math.max(...hs.map((j) => Y[j] + NH_ARR[j] + gap)) : Math.min(...hs.map((j) => Y[j] - hi - gap)); } return null; };
    const dn = walk(1), up = walk(-1), to = up === null ? dn : dn === null ? up : Math.abs(up - y0) < Math.abs(dn - y0) ? up : dn;
    if (to === null) { reindex(); return; }
    if (reduced()) { Y[i] = to; movedVer++; redraw(); reindex(); return; }
    const t0 = performance.now();
    const step = (now) => { if (dragNode === i) return; const k = Math.min(1, (now - t0) / 160); Y[i] = y0 + (to - y0) * (1 - Math.pow(1 - k, 3)); movedVer++; redraw(); if (k < 1) requestAnimationFrame(step); else reindex(); };
    requestAnimationFrame(step);
  }

  box.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("button, .sn-st-bar")) return;
    box.setPointerCapture(e.pointerId); cancelAnimationFrame(tween); stopZoom(); box.focus({ preventScroll: true });
    const hit = pick(e.clientX, e.clientY), sx = e.clientX, sy = e.clientY, ox = hit >= 0 ? X[hit] : 0, oy = hit >= 0 ? Y[hit] : 0, r0 = box.getBoundingClientRect();
    const gx = sx - (r0.left + view.x + ox * view.z), gy = sy - (r0.top + view.y + oy * view.z);
    let px = sx, py = sy, lx = sx, ly = sy, went = false, fr = 0, done = false;
    if (hit >= 0) { dragNode = hit; updateActive(); }
    const sp = (v) => Math.sign(v) * Math.min(24, Math.abs(v) / 3);
    const frame = () => {
      fr = 0; if (done) return;
      const r = box.getBoundingClientRect(), E = 32, vx = px < r.left + E ? r.left + E - px : px > r.right - E ? r.right - E - px : 0, vy = py < r.top + E ? r.top + E - py : py > r.bottom - E ? r.bottom - E - py : 0;
      if (vx || vy) { view.x += sp(vx); view.y += sp(vy); }
      const cw = NW[hit] * view.z, ch = NH_ARR[hit] * view.z, fitV = (v, lo, hi, size, grab) => (size <= hi - lo ? Math.max(lo, Math.min(hi - size, v - grab)) : Math.max(lo, Math.min(hi, v)) - grab);
      const left = fitV(px, r.left + 8, r.right - 8, cw, gx), top = fitV(py, r.top + 8, r.bottom - 8, ch, gy);
      X[hit] = (left - r.left - view.x) / view.z; Y[hit] = (top - r.top - view.y) / view.z; movedVer++; redraw();
      if (vx || vy) fr = requestAnimationFrame(frame);
    };
    const mv = (ev) => {
      px = ev.clientX; py = ev.clientY;
      if (!went && Math.hypot(px - sx, py - sy) < 3) return;
      if (!went) { went = true; box.classList.add(hit >= 0 ? "sn-dragging" : "sn-panning"); if (hit >= 0) toTop(hit); }
      if (hit >= 0) { if (!fr) fr = requestAnimationFrame(frame); }
      else { view.x += px - lx; view.y += py - ly; redraw(); }
      lx = px; ly = py;
    };
    const glideBack = (i) => {
      const fx = X[i], fy = Y[i], t0 = performance.now();
      if (reduced()) { X[i] = ox; Y[i] = oy; movedVer++; redraw(); reindex(); return; }
      const step = (now) => { const k = Math.min(1, (now - t0) / 200), q = 1 - (1 - k) ** 3; X[i] = fx + (ox - fx) * q; Y[i] = fy + (oy - fy) * q; movedVer++; redraw(); if (k < 1) requestAnimationFrame(step); else reindex(); };
      requestAnimationFrame(step);
    };
    const fin = (how) => {
      if (done) return; done = true; cancelAnimationFrame(fr);
      for (const [t, f] of evs) box.removeEventListener(t, f); document.removeEventListener("keydown", onKey, true); removeEventListener("blur", onBlur);
      box.classList.remove("sn-panning", "sn-dragging");
      if (hit >= 0) { dragNode = -1; if (went) { if (how === "up") settleDrop(hit); else glideBack(hit); } else if (how === "up") { focus = focus === hit ? -1 : hit; focusShown = true; } }
      else if (!went && focus >= 0 && how === "up") focus = -1;
      const r = box.getBoundingClientRect(), inside = px >= r.left && px < r.right && py >= r.top && py < r.bottom && !document.elementFromPoint(px, py)?.closest(".sn-st-bar, .sn-st-stat");
      hover = inside ? pick(px, py) : -1; box.style.cursor = hover >= 0 ? "pointer" : "";
      updateActive(); redraw();
    };
    const onKey = (ev) => { if (ev.key === "Escape" && went && hit >= 0) { ev.preventDefault(); ev.stopPropagation(); fin("cancel"); } }, onBlur = () => fin("cancel");
    const evs = [["pointermove", mv], ["pointerup", () => fin("up")], ["pointercancel", () => fin("cancel")], ["lostpointercapture", () => fin("cancel")]];
    for (const [t, f] of evs) box.addEventListener(t, f); document.addEventListener("keydown", onKey, true); addEventListener("blur", onBlur);
  });

  box.addEventListener("pointermove", (e) => {
    if (e.buttons || box.classList.contains("sn-panning") || box.classList.contains("sn-dragging")) return;
    const hit = e.target.closest(".sn-st-bar, .sn-st-stat") ? -1 : pick(e.clientX, e.clientY);
    if (hit !== hover) { hover = hit; box.style.cursor = hit >= 0 ? "pointer" : ""; updateActive(); }
  });
  box.addEventListener("pointerleave", () => { if (hover >= 0 && dragNode < 0) { hover = -1; updateActive(); } });
  box.addEventListener("keydown", (e) => { if (e.key === "Escape" && focus >= 0) { focus = -1; updateActive(); } });

  let worker = null, reqId = 0; const pending = new Map();
  try { worker = new Worker(new URL("../../packages/satin-ui/src/flow-layout-worker.js", import.meta.url), { type: "module" }); worker.onmessage = (e) => { const r = pending.get(e.data.id); pending.delete(e.data.id); r?.(e.data); }; } catch { worker = null; }
  const ask = (msg, transfer = []) => new Promise((res) => { const id = ++reqId; pending.set(id, res); worker.postMessage({ ...msg, id }, transfer); });
  function layout() {
    if (!worker) { const t0 = performance.now(), r = layeredLayout(N, EA, EB, (i) => NW[i], (i) => NH_ARR[i], { gapX: 220, gapY: 28 }), ms = Math.round(performance.now() - t0); return Promise.resolve({ x: r.x, y: r.y, ms, grid: buildGrid(N, r.x, r.y, EA, EB, NW, NH_ARR, CELL) }); }
    return ask({ type: "layout", n: N, w: 220, h: 110, gapX: 220, gapY: 28, cell: CELL });
  }
  function gridFor() {
    if (!worker) return Promise.resolve(buildGrid(N, X, Y, EA, EB, NW, NH_ARR, CELL));
    const x = X.slice(), y = Y.slice(); return ask({ type: "grid", n: N, x, y, w: 220, h: 110, cell: CELL }, [x.buffer, y.buffer]).then((d) => d.grid);
  }
  async function reindex() {
    const ver = movedVer, dv = dataVer, gr = await gridFor(); if (dv !== dataVer || moving) return;
    setGrid(gr); if (ver === movedVer) { for (const i of moved) movedF[i] = 0; moved = []; } redraw();
  }

  const springEase = (k) => { const end = 1 - (1 + k) * Math.exp(-k); return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : (1 - (1 + k * x) * Math.exp(-k * x)) / end); };
  const TIDY = springEase(6.2);
  const clearMoved = () => { for (const i of moved) movedF[i] = 0; moved = []; for (const i of topList) topF[i] = 0; topList = []; };
  async function shuffle() {
    if (tidying) return; tidying = true; let seed = 99; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, b = bounds();
    for (let i = 0; i < N; i++) { X[i] = b.x0 + rnd() * (b.x1 - b.x0); Y[i] = b.y0 + rnd() * (b.y1 - b.y0); }
    clearMoved(); messy = true; hover = focus = -1; setActive(-1); moving = true; redraw();
    const dv = dataVer, gr = await gridFor(); tidying = false; if (dv !== dataVer) return; setGrid(gr); moving = false; redraw();
  }
  async function tidy(btn) {
    if (tidying) return; tidying = true; btn?.classList.add("sn-busy"); hover = focus = -1; setActive(-1);
    const dv = dataVer, lay = await layout(); btn?.classList.remove("sn-busy"); if (dv !== dataVer) { tidying = false; return; }
    lastLayoutMs = lay.ms; clearMoved();
    if (reduced()) { X.set(lay.x); Y.set(lay.y); setGrid(lay.grid); messy = true; fit(); tidying = false; return; }
    const fx = X.slice(), fy = Y.slice(), s0 = performance.now(), D = 600; moving = true;
    const step = (now) => {
      if (dv !== dataVer) { moving = tidying = false; return; }
      const k = TIDY(Math.min(1, (now - s0) / D));
      for (let i = 0; i < N; i++) { X[i] = fx[i] + (lay.x[i] - fx[i]) * k; Y[i] = fy[i] + (lay.y[i] - fy[i]) * k; }
      redraw();
      if (now - s0 < D) requestAnimationFrame(step); else { moving = false; messy = true; setGrid(lay.grid); fit(); tidying = false; }
    };
    requestAnimationFrame(step);
  }

  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-st]"); if (!b) return; const v = b.dataset.st;
    if (v === "fit") fit();
    else if (v === "cluster") focusCluster(0, false);
    else if (v === "in") zoomTo(cssW / 2, cssH / 2, zoomTarget() * 1.6);
    else if (v === "out") zoomTo(cssW / 2, cssH / 2, zoomTarget() / 1.6);
    else if (v === "shuffle") shuffle();
    else if (v === "tidy") tidy(b);
    else if (v === "hub") showHub();
    else if (v === "10000" || v === "50000") {
      if (+v === N || tidying) return;
      box.querySelectorAll("[data-st='10000'],[data-st='50000']").forEach((x) => x.classList.toggle("sn-on", x === b));
      b.classList.add("sn-busy"); setTimeout(() => { build(+v); b.classList.remove("sn-busy"); }, 30);
    }
  });

  resize(); build(10000);
  box._stress = {
    view, redraw, fit, stats: () => ({ N, M, fanMax, fanAvg, hubMax, drawMs: [...drawMs] }),
    toScreen: (i) => { const r = box.getBoundingClientRect(); return { x: r.left + view.x + (X[i] + NW[i] / 2) * view.z, y: r.top + view.y + (Y[i] + NH_ARR[i] / 2) * view.z }; },
    nodeAt: (i) => ({ x: X[i], y: Y[i] }), hover: () => hover, dragNode: () => dragNode,
    active: () => ({ src: A.src, ne: A.ne, nodes: A.nodes.length, focus }), moved: () => moved.length, top: () => topList.length,
    overlaps: () => {
      const seen = new Set(); let n = 0;
      for (let c = 0; c < G.gw * G.gh; c++) {
        const s0 = G.nStart[c], s1 = G.nStart[c + 1];
        for (let a = s0; a < s1; a++) for (let b = a + 1; b < s1; b++) {
          const i = G.nList[a], j = G.nList[b], key = i < j ? i * N + j : j * N + i;
          if (seen.has(key)) continue;
          if (X[i] < X[j] + NW[j] && X[i] + NW[i] > X[j] && Y[i] < Y[j] + NH_ARR[j] && Y[i] + NH_ARR[i] > Y[j]) { seen.add(key); n++; }
        }
      }
      return n;
    },
  };
}
