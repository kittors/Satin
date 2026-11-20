// 流程图压力测试 · 神经网络：一万（或五万）个节点、六万（或三十万）条线，画在一块画布上。
// 数据像神经网络：每张卡右边扇出 3～12 条线，约 3% 是枢纽（18～40 条），连到下一列（偶尔隔一列）里相对位置附近的卡；
// 列有宽有窄（整体是个不规则的纺锤形），间距不等，顺着低频波浪弯，卡一团一团的——不是规整的网格。
// 1. 只画看得见的：按 1024px 的格子建空间索引，视口外的节点和线一个都不碰；视口盖住大半张图时直接按编号扫线，不翻格子。
// 2. 线多了就抽样：一帧最多画 2 万条直线（远）或 6 千条曲线（中、近），多出来的按编号均匀抽——线的编号是打乱的，取前面的就是均匀抽样；
//    抽样率取 2 的幂，平移时不闪。线的透明度跟着这一帧画了多少条走，越多越淡，叠起来是一层网，不糊。
// 3. 细节分级：远（< 0.2）色块 + 直线；中（< 0.55）圆角卡片 + 类型色块 + 曲线；近（≥ 0.55）完整卡片：标题、说明、端口。同色的一次画完。
// 4. 激活：悬停或钉住（点一下）一张卡，信号顺着输出往后传三层，每层晚 110ms，每条线 200ms 从起点长到终点，越往后越淡；
//    其余的线压暗，进来的线用中性色淡淡标出。线始终 1px，不加光晕。
// 5. 卡片能拖：连线跟着走，被拖的卡压在最上面、带一层投影；松手后在后台线程重建空间索引，建好之前拖过的卡单独处理，画和点都不受影响。
// 6. 只有视图、悬停、拖动或激活动画在进行的那一帧才重画。右上角实时显示本帧画了多少、花了多少毫秒。
// 7. "整理"在后台线程用分层布局（flow-layout.js）重排全部节点，显示排版用时，节点按弹簧曲线移到新位置。
import { layeredLayout, buildGrid } from "../../packages/satin-ui/src/flow-layout.js";

export function initFlowStress(ctx) {
  const { $, reduced } = ctx;
  const box = $("#stressBox"); if (!box) return;
  const cv = $("canvas", box), stat = $("[data-st-stat]", box), g = cv.getContext("2d", { alpha: false });
  const W = 200, H = 64, CELL = 1024, GX = W + 420, HUES = [214, 248, 286, 156, 30, 188], NH = HUES.length;
  const TITLES = ["导入原文", "拆分章节", "生成分镜", "生成画面", "配音", "合成视频", "导出"];
  const STEP = 110, GROW = 200, DEPTH = 3, MAXE = 2400, DA = [1, 1, .72, .5]; // 激活：每层晚 110ms、每条线 200ms 长到头、往后三层、最多 2400 条；越往后越淡
  let N = 0, M = 0, X, Y, HU, EA, EB, OS, OL, IS, IL, hubMax = 0, fanMax = 0, fanAvg = 0, dataVer = 0, worldArea = 1;
  let stamp = new Uint32Array(0), estamp = new Uint32Array(0), visBuf = new Int32Array(0), vesBuf = new Int32Array(0), sortBuf = new Int32Array(0), frameNo = 0;
  const hueCnt = new Int32Array(NH + 1), keyCnt = new Int32Array(NH * 3 + 1);
  let moved = [], movedF = new Uint8Array(0), movedVer = 0, dragNode = -1; // 位置变了、还没进索引的卡
  let topList = [], topF = new Uint8Array(0), messy = false; // 拖过的卡（一直画在最上面）；打乱之后卡会叠在一起
  let hover = -1, focus = -1, focusShown = false;
  const A = { src: -1, t0: 0, instant: false, e: new Int32Array(MAXE), d: new Uint8Array(MAXE), ne: 0, nodes: [], dn: new Uint8Array(0), ins: [] };
  const view = { x: 40, y: 40, z: .5 }; let dpr = 1, cssW = 0, cssH = 0, dirty = true, raf = 0, lastLayoutMs = 0, moving = false, tidying = false;
  const colors = () => { const dark = document.documentElement.dataset.theme === "dark"; return { dark, bg: dark ? "#0e0e10" : "#e8e8ed", card: dark ? "#1c1c1e" : "#ffffff", line: dark ? "rgba(255,255,255,.09)" : "rgba(0,0,0,.08)", text: dark ? "#f5f5f7" : "#1d1d1f", sub: dark ? "rgba(235,235,245,.5)" : "rgba(60,60,67,.6)", inLine: dark ? "rgba(255,255,255,.42)" : "rgba(0,0,0,.34)", s: dark ? 70 : 58, l: dark ? 66 : 52 }; };
  // 卡片上的字：字体、字号跟主题定制走
  const pal = () => { const cs = getComputedStyle(document.documentElement), fam = cs.getPropertyValue("--sn-sans").trim() || "-apple-system, 'PingFang SC', sans-serif", k = Math.min(1.14, parseFloat(cs.getPropertyValue("--sn-font-scale")) || 1); return { ...colors(), f1: `600 ${13 * k}px ${fam}`, f2: `400 ${12 * k}px ${fam}` }; };
  let C = pal();
  const hueCol = (h, a = 1) => `hsla(${HUES[h]}, ${C.s}%, ${C.l}%, ${a})`;

  // ———— 造数据：像神经网络 ————
  function build(n) {
    N = n; dataVer++;
    const L = n > 20000 ? 160 : 72;
    X = new Float64Array(N); Y = new Float64Array(N); HU = new Uint8Array(N);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const gauss = () => { let u = 0; while (!u) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * rnd()); };
    const ls = new Int32Array(L + 1), ymin = new Float64Array(L), ymax = new Float64Array(L);
    // 1) 位置——不要网格：
    //    每列卡数中间多、两头少，再加点起伏，整体是个不规则的纺锤形（像神经网络的层：两头窄、中间宽）；列和列的间距也不等（0.8～1.2 倍）；
    //    列整体顺着一条低频波浪弯（相邻列相位只差一点，弯得平行，不会撞），列的中心上下慢慢漂；
    //    列里一团一团的（一团 5～28 张，团和团之间空出约 1～4 张卡的高度），同一团同一种颜色；卡左右错开一点
    const shape = []; let tot = 0;
    for (let l = 0; l < L; l++) { const v = .3 + Math.pow(Math.sin((Math.PI * (l + .5)) / L), .8) * (.75 + rnd() * .5); shape.push(v); tot += v; }
    const cnt = shape.map((v) => Math.max(8, Math.round((v / tot) * N))); let diff = N - cnt.reduce((a, b) => a + b, 0);
    for (let l = 0; diff !== 0; l = (l + 1) % L) { if (diff > 0) { cnt[l]++; diff--; } else if (cnt[l] > 8) { cnt[l]--; diff++; } }
    const ph1 = rnd() * 6.2832, ph2 = rnd() * 6.2832, ph3 = rnd() * 6.2832; let xc = 0;
    for (let l = 0, s = 0; l < L; l++) {
      const e = s + cnt[l]; ls[l] = s; ls[l + 1] = e;
      let y = 0, left = 0, hue = (rnd() * NH) | 0;
      for (let i = s; i < e; i++) {
        if (left <= 0) { left = 5 + ((rnd() * 24) | 0); y += H * (.8 + rnd() * 3.2); hue = (hue + 1 + ((rnd() * 3) | 0)) % NH; }
        left--; Y[i] = y; HU[i] = hue; y += H + 8 + rnd() * 16;
      }
      const shift = 1600 * Math.sin((l / L) * Math.PI * 1.4 + ph3) - y / 2;
      for (let i = s; i < e; i++) { Y[i] += shift; X[i] = xc + 260 * Math.sin(Y[i] / 3000 + ph1 + l * .18) + 140 * Math.sin(Y[i] / 1300 + ph2 + l * .07) + (rnd() - .5) * 70; }
      ymin[l] = Y[s]; ymax[l] = Y[e - 1]; xc += GX * (.8 + rnd() * .4); s = e;
    }
    // 2) 连线：每张卡往右连 3～12 条（约 3% 是枢纽，18～40 条），连到下一列（12% 隔一列，枢纽 30%）里"相对位置"附近的卡——
    //    列高不一样，按在列里的相对高度对上，纺锤变宽、变窄的地方线就自然散开、收拢；普通卡集中在 ±420 内，枢纽 ±1800
    const nearest = (l, y) => { let lo = ls[l], hi = ls[l + 1] - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (Y[m] < y) lo = m + 1; else hi = m; } return lo > ls[l] && y - Y[lo - 1] < Y[lo] - y ? lo - 1 : lo; };
    const ea = [], eb = [], pick = new Set();
    for (let l = 0; l < L - 1; l++) for (let i = ls[l]; i < ls[l + 1]; i++) {
      const hub = rnd() < .03, fan = hub ? 18 + ((rnd() * 23) | 0) : 3 + ((rnd() * rnd() * 10) | 0), sig = hub ? 1800 : 420, rel = (Y[i] - ymin[l]) / Math.max(1, ymax[l] - ymin[l]); pick.clear();
      for (let f = 0, tries = 0; f < fan && tries < fan * 3; tries++) {
        const tl = l < L - 2 && rnd() < (hub ? .3 : .12) ? l + 2 : l + 1, j = nearest(tl, ymin[tl] + rel * (ymax[tl] - ymin[tl]) + gauss() * sig);
        if (pick.has(j)) continue; pick.add(j); ea.push(i); eb.push(j); f++;
      }
    }
    // 3) 打乱线的编号：远处只画一部分时，按编号取前面的就是均匀抽样
    for (let k = ea.length - 1; k > 0; k--) { const r = (rnd() * (k + 1)) | 0, ta = ea[k], tb = eb[k]; ea[k] = ea[r]; eb[k] = eb[r]; ea[r] = ta; eb[r] = tb; }
    M = ea.length; EA = Int32Array.from(ea); EB = Int32Array.from(eb);
    // 4) 出线、进线的邻接表（压缩行格式）：激活往后传、拖动时找连线都靠它
    OS = new Int32Array(N + 1); IS = new Int32Array(N + 1);
    for (let e = 0; e < M; e++) { OS[EA[e] + 1]++; IS[EB[e] + 1]++; }
    for (let i = 0; i < N; i++) { OS[i + 1] += OS[i]; IS[i + 1] += IS[i]; }
    OL = new Int32Array(M); IL = new Int32Array(M); const op = OS.slice(0, N), ip = IS.slice(0, N);
    for (let e = 0; e < M; e++) { OL[op[EA[e]]++] = e; IL[ip[EB[e]]++] = e; }
    hubMax = 0; for (let i = 1; i < N; i++) if (OS[i + 1] - OS[i] > OS[hubMax + 1] - OS[hubMax]) hubMax = i;
    fanMax = OS[hubMax + 1] - OS[hubMax]; fanAvg = M / Math.max(1, ls[L - 1]);
    stamp = new Uint32Array(N); estamp = new Uint32Array(M); visBuf = new Int32Array(N); vesBuf = new Int32Array(M); sortBuf = new Int32Array(Math.max(N, M, MAXE));
    movedF = new Uint8Array(N); moved = []; topF = new Uint8Array(N); topList = []; messy = false; dragNode = hover = focus = -1; focusShown = false;
    A.dn = new Uint8Array(N); A.src = -1; A.nodes = []; A.ne = 0; A.ins = [];
    worker?.postMessage({ type: "data", ea: EA, eb: EB });
    setGrid(buildGrid(N, X, Y, EA, EB, W, H, CELL)); fit(true);
  }
  // ———— 空间索引（flow-layout.js 的 buildGrid：紧凑的类型化数组）————
  let G = { gx0: 0, gy0: 0, gw: 1, gh: 1, nStart: new Int32Array(2), nList: new Int32Array(0), eStart: new Int32Array(2), eList: new Int32Array(0), kAvg: 1 };
  function setGrid(gr) { G = gr; G.kAvg = Math.max(1, gr.eList.length / Math.max(1, M)); const b = bounds(); worldArea = Math.max(1, (b.x1 - b.x0) * (b.y1 - b.y0)); }
  function bounds() { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (let i = 0; i < N; i++) { if (X[i] < x0) x0 = X[i]; if (Y[i] < y0) y0 = Y[i]; if (X[i] + W > x1) x1 = X[i] + W; if (Y[i] + H > y1) y1 = Y[i] + H; } return { x0, y0, x1, y1 }; }
  const rateFor = (est, budget) => (est <= budget ? 1 : Math.pow(2, -Math.ceil(Math.log2(est / budget))));
  function edgePath(e, straight) { const a = EA[e], b = EB[e], ax = X[a] + W, ay = Y[a] + H / 2, bx = X[b], by = Y[b] + H / 2; g.moveTo(ax, ay); if (straight) g.lineTo(bx, by); else { const dx = Math.max(40, (bx - ax) * .5); g.bezierCurveTo(ax + dx, ay, bx - dx, by, bx, by); } }

  // ———— 画一帧 ————
  function draw() {
    const t0 = performance.now(); frameNo++;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = C.bg; g.fillRect(0, 0, cv.width, cv.height);
    const z = view.z, far = z < .2, lw = 1 / z; g.setTransform(dpr * z, 0, 0, dpr * z, dpr * view.x, dpr * view.y);
    const wx0 = -view.x / z, wy0 = -view.y / z, wx1 = wx0 + cssW / z, wy1 = wy0 + cssH / z;
    const inView = (i) => X[i] + W >= wx0 && X[i] <= wx1 && Y[i] + H >= wy0 && Y[i] <= wy1;
    const eIn = (e) => { const a = EA[e], b = EB[e], ax = X[a] + W, bx = X[b], ay = Y[a] + H / 2, by = Y[b] + H / 2; return (ax > bx ? ax : bx) + 40 >= wx0 && (ax < bx ? ax : bx) - 40 <= wx1 && (ay > by ? ay : by) >= wy0 && (ay < by ? ay : by) <= wy1; };
    const free = (e) => !movedF[EA[e]] && !movedF[EB[e]];
    const budget = far ? 20000 : 6000; let nv = 0, ne = 0, rate = 1;
    if (moving) { // 整理动画中：位置每帧都在变，不走格子，直接逐个比坐标
      for (let i = 0; i < N; i++) if (inView(i)) visBuf[nv++] = i;
      rate = rateFor(M * Math.min(1, ((wx1 - wx0) * (wy1 - wy0)) / worldArea), budget); const thr = Math.ceil(M * rate);
      for (let e = 0; e < thr; e++) if (eIn(e)) vesBuf[ne++] = e;
    } else {
      const { gx0, gy0, gw, gh, nStart, nList, eStart, eList } = G;
      const cx0 = Math.max(0, Math.floor((wx0 - W) / CELL) - gx0), cx1 = Math.min(gw - 1, Math.floor(wx1 / CELL) - gx0), cy0 = Math.max(0, Math.floor((wy0 - H) / CELL) - gy0), cy1 = Math.min(gh - 1, Math.floor(wy1 / CELL) - gy0);
      // 先估这一视口里大概有多少条线：格子里的条目数 ÷ 平均每条线占几格
      let cnt = 0, cells = 0;
      if (cx0 <= cx1) for (let cy = cy0; cy <= cy1; cy++) { cnt += eStart[cy * gw + cx1 + 1] - eStart[cy * gw + cx0]; cells += cx1 - cx0 + 1; }
      rate = rateFor(cnt / G.kAvg, budget); const thr = Math.ceil(M * rate);
      if (cells > gw * gh * .5) { // 视口盖住大半张图：直接按编号扫前面那些线，比翻格子省
        for (let i = 0; i < N; i++) if (!movedF[i] && !topF[i] && inView(i)) visBuf[nv++] = i;
        for (let e = 0; e < thr; e++) if (free(e) && eIn(e)) vesBuf[ne++] = e;
      } else for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
        const c = cy * gw + cx;
        for (let q = nStart[c]; q < nStart[c + 1]; q++) { const i = nList[q]; if (stamp[i] !== frameNo) { stamp[i] = frameNo; if (!movedF[i] && !topF[i] && inView(i)) visBuf[nv++] = i; } }
        for (let q = eStart[c]; q < eStart[c + 1]; q++) { const e = eList[q]; if (e < thr && estamp[e] !== frameNo && free(e)) { estamp[e] = frameNo; vesBuf[ne++] = e; } }
      }
    }
    // 拖过的卡：按最新位置单独收，最后画（后拖的在上）；其中位置变了、索引还没重建的，连线也单独收，不抽样
    const tvis = [];
    for (const i of topList) if (inView(i)) tvis.push(i);
    for (const i of moved) {
      for (let q = OS[i]; q < OS[i + 1]; q++) { const e = OL[q]; if (estamp[e] !== frameNo) { estamp[e] = frameNo; vesBuf[ne++] = e; } }
      for (let q = IS[i]; q < IS[i + 1]; q++) { const e = IL[q]; if (estamp[e] !== frameNo) { estamp[e] = frameNo; vesBuf[ne++] = e; } }
    }
    // 线：按颜色计数排序，同色一次画完；线越多越淡
    const act = A.src >= 0;
    if (ne) {
      const alpha = (far ? Math.min(.4, Math.max(.1, 15 / Math.sqrt(ne))) : Math.min(.5, Math.max(.07, 11 / Math.sqrt(ne)))) * (act ? .3 : 1);
      g.lineWidth = lw; g.lineCap = "round";
      hueCnt.fill(0); for (let k = 0; k < ne; k++) hueCnt[HU[EA[vesBuf[k]]] + 1]++;
      for (let h = 0; h < NH; h++) hueCnt[h + 1] += hueCnt[h];
      const pos = hueCnt.slice(0, NH); for (let k = 0; k < ne; k++) { const e = vesBuf[k]; sortBuf[pos[HU[EA[e]]]++] = e; }
      for (let h = 0; h < NH; h++) {
        const s = hueCnt[h], t = hueCnt[h + 1]; if (s === t) continue;
        g.strokeStyle = hueCol(h, alpha); g.beginPath(); for (let k = s; k < t; k++) edgePath(sortBuf[k], far); g.stroke();
      }
    }
    // 激活的线也画在卡片下面：隔列的线从中间那列卡片底下走，不压字；卡片的点亮描边在卡片之后画
    let busy = act && drawActiveLines(lw, far);
    // 节点：拖过的卡最后画，压在上面
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
    const byHue = () => { hueCnt.fill(0); for (let k = 0; k < n; k++) hueCnt[HU[list[k]] + 1]++; for (let h = 0; h < NH; h++) hueCnt[h + 1] += hueCnt[h]; const pos = hueCnt.slice(0, NH); for (let k = 0; k < n; k++) { const i = list[k]; sortBuf[pos[HU[i]]++] = i; } };
    if (far) {
      byHue();
      for (let h = 0; h < NH; h++) { const s = hueCnt[h], t = hueCnt[h + 1]; if (s === t) continue; g.fillStyle = hueCol(h, C.dark ? .5 : .42); g.beginPath(); for (let k = s; k < t; k++) { const i = sortBuf[k]; g.rect(X[i], Y[i], W, H); } g.fill(); }
      return;
    }
    if (top || messy || moving) { drawCards(list, n, lw); return; } // 可能叠在一起：一张一张画完整
    g.fillStyle = C.card; g.beginPath(); for (let k = 0; k < n; k++) { const i = list[k]; g.roundRect(X[i], Y[i], W, H, 12); } g.fill();
    g.strokeStyle = C.line; g.lineWidth = lw; g.stroke();
    byHue();
    for (let h = 0; h < NH; h++) { const s = hueCnt[h], t = hueCnt[h + 1]; if (s === t) continue; g.fillStyle = hueCol(h, .9); g.beginPath(); for (let k = s; k < t; k++) { const i = sortBuf[k]; g.roundRect(X[i] + 10, Y[i] + 12, 22, 22, 7); } g.fill(); }
    if (view.z < .55) return;
    g.textBaseline = "middle"; g.fillStyle = C.text; g.font = C.f1;
    for (let k = 0; k < n; k++) { const i = list[k]; g.fillText(`${TITLES[i % TITLES.length]} ${i + 1}`, X[i] + 40, Y[i] + 23); }
    g.fillStyle = C.sub; g.font = C.f2;
    for (let k = 0; k < n; k++) { const i = list[k], out = OS[i + 1] - OS[i]; g.fillText(`第 ${(i % 48) + 1} 个镜头${out ? ` · 连出 ${out} 条` : " · 末端"}`, X[i] + 10, Y[i] + 48); }
    g.fillStyle = C.card; g.lineWidth = 1.5 / view.z; g.beginPath();
    for (let k = 0; k < n; k++) { const i = list[k]; g.moveTo(X[i] + 3.5, Y[i] + H / 2); g.arc(X[i], Y[i] + H / 2, 3.5, 0, 6.2832); g.moveTo(X[i] + W + 3.5, Y[i] + H / 2); g.arc(X[i] + W, Y[i] + H / 2, 3.5, 0, 6.2832); }
    g.fill(); g.strokeStyle = C.dark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.25)"; g.stroke();
  }
  // 一张一张画完整（底、边框、色块、文字、端口画完一张再画下一张）：卡片叠在一起时，上面那张完整盖住下面那张，不会字叠字。
  // 只在可能叠的时候用（拖过的卡、打乱之后、整理动画中）；平时卡片不叠，按颜色批量画更快
  function drawCards(list, n, lw) {
    const full = view.z >= .55, hc = HUES.map((_, h) => hueCol(h, .9)), portLine = C.dark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.25)";
    const F1 = C.f1, F2 = C.f2;
    g.textBaseline = "middle";
    for (let k = 0; k < n; k++) {
      const i = list[k], x = X[i], y = Y[i];
      if (i === dragNode) { g.save(); g.shadowColor = C.dark ? "rgba(0,0,0,.55)" : "rgba(0,0,0,.16)"; g.shadowBlur = 18 * view.z * dpr; g.shadowOffsetY = 6 * view.z * dpr; g.fillStyle = C.card; g.beginPath(); g.roundRect(x, y, W, H, 12); g.fill(); g.restore(); } // 正在拖的那张垫一层投影，像被提起来
      g.fillStyle = C.card; g.beginPath(); g.roundRect(x, y, W, H, 12); g.fill(); g.strokeStyle = C.line; g.lineWidth = lw; g.stroke();
      g.fillStyle = hc[HU[i]]; g.beginPath(); g.roundRect(x + 10, y + 12, 22, 22, 7); g.fill();
      if (!full) continue;
      const out = OS[i + 1] - OS[i];
      g.fillStyle = C.text; g.font = F1; g.fillText(`${TITLES[i % TITLES.length]} ${i + 1}`, x + 40, y + 23);
      g.fillStyle = C.sub; g.font = F2; g.fillText(`第 ${(i % 48) + 1} 个镜头${out ? ` · 连出 ${out} 条` : " · 末端"}`, x + 10, y + 48);
      g.fillStyle = C.card; g.strokeStyle = portLine; g.lineWidth = 1.5 / view.z; g.beginPath(); g.moveTo(x + 3.5, y + H / 2); g.arc(x, y + H / 2, 3.5, 0, 6.2832); g.moveTo(x + W + 3.5, y + H / 2); g.arc(x + W, y + H / 2, 3.5, 0, 6.2832); g.fill(); g.stroke();
    }
  }
  // 激活：信号往后传三层。线和节点分两步画（线在卡片下面、点亮的描边在卡片上面）；返回 true 表示动画还没完，下一帧接着画
  function drawActiveLines(lw, far) {
    const t = performance.now() - A.t0, inst = A.instant; let busy = false;
    g.lineWidth = lw; g.lineCap = "round";
    if (A.ins.length) { g.strokeStyle = C.inLine; g.beginPath(); for (const e of A.ins) edgePath(e, far); g.stroke(); } // 进来的线：中性色淡淡标出，不动画
    // 往后的线：第 d 层晚 (d-1)×110ms 出发，每条 200ms 从起点长到终点（虚线的实段 = 估算的曲线长度 × 进度）；长完的按 层×颜色 一次画
    keyCnt.fill(0);
    for (let k = 0; k < A.ne; k++) {
      const e = A.e[k], d = A.d[k], p = inst ? 1 : (t - (d - 1) * STEP) / GROW;
      if (p < 1) busy = true; if (p <= 0) continue;
      if (p >= 1) { keyCnt[(d - 1) * NH + HU[EA[e]] + 1]++; continue; }
      const a = EA[e], b = EB[e], ax = X[a] + W, ay = Y[a] + H / 2, bx = X[b], by = Y[b] + H / 2, dx = far ? 0 : Math.max(40, (bx - ax) * .5);
      const len = far ? Math.hypot(bx - ax, by - ay) : 2 * dx + Math.hypot(bx - ax - 2 * dx, by - ay);
      g.strokeStyle = hueCol(HU[a], DA[d]); g.setLineDash([len * p, len * 2]); g.beginPath(); edgePath(e, far); g.stroke();
    }
    g.setLineDash([]);
    for (let k = 1; k <= NH * 3; k++) keyCnt[k] += keyCnt[k - 1];
    let pos = keyCnt.slice(0, NH * 3);
    for (let k = 0; k < A.ne; k++) { const d = A.d[k]; if (inst || t - (d - 1) * STEP >= GROW) { const e = A.e[k]; sortBuf[pos[(d - 1) * NH + HU[EA[e]]]++] = e; } }
    for (let key = 0; key < NH * 3; key++) { const s = keyCnt[key], u = keyCnt[key + 1]; if (s === u) continue; g.strokeStyle = hueCol(key % NH, DA[((key / NH) | 0) + 1]); g.beginPath(); for (let k = s; k < u; k++) edgePath(sortBuf[k], far); g.stroke(); }
    return busy;
  }
  function drawActiveNodes(far, inView) {
    const t = performance.now() - A.t0, inst = A.instant, z = view.z; let busy = false, pos;
    // 节点：信号到了（进来的线长到头）才亮，120ms 淡入；亮完的按 层×颜色 一次画
    const nodeP = (i) => (inst ? 1 : (t - (A.dn[i] - 1) * STEP - GROW) / 120);
    const mark = (i) => (far ? g.rect(X[i], Y[i], W, H) : g.roundRect(X[i], Y[i], W, H, 12));
    keyCnt.fill(0); g.lineWidth = 1.5 / z;
    for (const i of A.nodes) {
      const p = nodeP(i); if (p < 1) busy = true; if (p <= 0 || !inView(i)) continue;
      if (p >= 1) { keyCnt[(A.dn[i] - 1) * NH + HU[i] + 1]++; continue; }
      const c = hueCol(HU[i], DA[A.dn[i]] * p); g.beginPath(); mark(i); if (far) { g.fillStyle = c; g.fill(); } else { g.strokeStyle = c; g.stroke(); }
    }
    for (let k = 1; k <= NH * 3; k++) keyCnt[k] += keyCnt[k - 1];
    pos = keyCnt.slice(0, NH * 3);
    for (const i of A.nodes) if (nodeP(i) >= 1 && inView(i)) sortBuf[pos[(A.dn[i] - 1) * NH + HU[i]]++] = i;
    for (let key = 0; key < NH * 3; key++) {
      const s = keyCnt[key], u = keyCnt[key + 1]; if (s === u) continue; const c = hueCol(key % NH, DA[((key / NH) | 0) + 1]);
      g.beginPath(); for (let k = s; k < u; k++) mark(sortBuf[k]); if (far) { g.fillStyle = c; g.fill(); } else { g.strokeStyle = c; g.stroke(); }
    }
    // 源：实色
    const src = A.src; g.beginPath(); mark(src); if (far) { g.fillStyle = hueCol(HU[src], 1); g.fill(); } else { g.strokeStyle = hueCol(HU[src], 1); g.lineWidth = 2 / z; g.stroke(); }
    return busy;
  }
  const drawMs = []; let statT = 0;
  function showStat(nv, ne, rate) {
    const now = performance.now(); if (now - statT < 250) return; statT = now;
    const avg = drawMs.reduce((a, b) => a + b, 0) / drawMs.length, mx = Math.max(...drawMs), f = (v) => v.toLocaleString("zh-CN");
    stat.textContent = `${f(N)} 个节点 · ${f(M)} 条线，每张卡平均往右连 ${fanAvg.toFixed(1)} 条、最多 ${fanMax} 条 · 本帧画了 ${f(nv)} 个节点、${f(ne)} 条线${rate < 1 ? `（线太多，按 1/${Math.round(1 / rate)} 抽样）` : ""} · 每帧绘制平均 ${avg.toFixed(1)}ms、最多 ${mx.toFixed(1)}ms · 缩放 ${Math.round(view.z * 100)}%${lastLayoutMs ? ` · 上次排版 ${f(lastLayoutMs)}ms` : ""}`;
  }
  function tick() { if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (dirty) { dirty = false; draw(); } }); }
  const redraw = () => { dirty = true; tick(); };

  // ———— 激活：悬停优先，其次钉住的那张；拖动时跟着被拖的卡 ————
  function setActive(src, animate) {
    for (const i of A.nodes) A.dn[i] = 0; if (A.src >= 0) A.dn[A.src] = 0;
    A.nodes = []; A.ne = 0; A.ins = []; A.src = src;
    if (src >= 0) {
      A.t0 = performance.now(); A.instant = !animate || reduced(); A.dn[src] = 9;
      let front = [src];
      for (let d = 1; d <= DEPTH && front.length && A.ne < MAXE; d++) {
        const next = [];
        for (const a of front) for (let q = OS[a]; q < OS[a + 1] && A.ne < MAXE; q++) { const e = OL[q], b = EB[e]; A.e[A.ne] = e; A.d[A.ne++] = d; if (!A.dn[b]) { A.dn[b] = d; A.nodes.push(b); next.push(b); } }
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

  // ———— 尺寸 ————
  function resize() { const r = box.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); cssW = r.width; cssH = r.height; cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr); cv.style.width = cssW + "px"; cv.style.height = cssH + "px"; redraw(); }
  new ResizeObserver(resize).observe(box);
  new MutationObserver(() => { C = pal(); redraw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });
  // ———— 视图 ————
  const ZMIN = .01, ZMAX = 2;
  const clampZ = (z) => Math.min(ZMAX, Math.max(ZMIN, z));
  function zoomAt(cx, cy, z) { z = clampZ(z); const wx = (cx - view.x) / view.z, wy = (cy - view.y) / view.z; view.x = cx - wx * z; view.y = cy - wy * z; view.z = z; redraw(); }
  let tween = 0;
  // 视图过渡（适配、看枢纽）：视口中心对着的世界坐标直线移动，缩放在对数空间里变——不会一边缩放一边"游"
  function animateTo(tx, ty, tz, done) {
    cancelAnimationFrame(tween); stopZoom(); if (reduced()) { Object.assign(view, { x: tx, y: ty, z: tz }); redraw(); done?.(); return; }
    const cx = cssW / 2, cy = cssH / 2, z0 = view.z, ax = (cx - view.x) / z0, ay = (cy - view.y) / z0, bx = (cx - tx) / tz, by = (cy - ty) / tz, l0 = Math.log(z0), l1 = Math.log(tz), t0 = performance.now(), DUR = 360, lr = Math.abs(l1 - l0), D = lr > 1 ? Math.min(640, 300 + 90 * lr) : DUR, ease = lr > 1 ? (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2) : (t) => 1 - Math.pow(1 - t, 3); // 缩放变化大（超过约 2.7 倍）时先慢后快再慢、时长跟着拉长，起步不冲；小的用减速，起步跟手
    const step = (now) => { const t = Math.min(1, (now - t0) / D), k = ease(t), z = Math.exp(l0 + (l1 - l0) * k); view.z = z; view.x = cx - (ax + (bx - ax) * k) * z; view.y = cy - (ay + (by - ay) * k) * z; redraw(); if (t < 1) tween = requestAnimationFrame(step); else { Object.assign(view, { x: tx, y: ty, z: tz }); redraw(); done?.(); } };
    tween = requestAnimationFrame(step);
  }
  // 平滑缩放：缩放量在对数空间里追目标（每帧按 70ms 的时间常数逼近，约 250ms 到位），锚点（指针或视口中心）在屏幕上始终不动。
  // 连续点按钮、连着滚几格鼠标滚轮时目标一直往前推，画面连续地追上去，不会一格一格跳；触控板捏合本来就连续，直接跟手
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

  function fit(instant) { const b = bounds(), pad = 40, z = clampZ(Math.min((cssW - pad * 2) / (b.x1 - b.x0), (cssH - pad * 2) / (b.y1 - b.y0))); const tx = (cssW - (b.x1 - b.x0) * z) / 2 - b.x0 * z, ty = (cssH - (b.y1 - b.y0) * z) / 2 - b.y0 * z; if (instant) { Object.assign(view, { x: tx, y: ty, z }); redraw(); } else animateTo(tx, ty, z); }
  // 看枢纽：跳到往右连得最多的那张卡，放在左边留出右侧看它扇出去的线，到位后钉住并放一遍信号
  function showHub() {
    focus = hubMax; focusShown = false; hover = -1; setActive(-1);
    const z = .7; animateTo(cssW * .14 - X[hubMax] * z, cssH / 2 - (Y[hubMax] + H / 2) * z, z, () => updateActive());
  }
  box.addEventListener("wheel", (e) => {
    e.preventDefault(); cancelAnimationFrame(tween); const r = box.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) {
      const f = Math.exp(-e.deltaY * (e.deltaMode ? .05 : .0022)), px = e.clientX - r.left, py = e.clientY - r.top;
      if (e.deltaMode || Math.abs(e.deltaY) >= 40) zoomTo(px, py, zoomTarget() * f); // 鼠标滚轮一格：平滑追上去
      else { stopZoom(); zoomAt(px, py, view.z * f); } // 触控板捏合：本来就连续，直接跟手
    } else { view.x -= e.deltaX; view.y -= e.deltaY; redraw(); }
  }, { passive: false });
  // 指针下的卡：先看拖过的（按最新位置，后拖的在上面），再查格子
  function pick(clientX, clientY) {
    if (moving || view.z < .2) return -1;
    const r = box.getBoundingClientRect(), wx = (clientX - r.left - view.x) / view.z, wy = (clientY - r.top - view.y) / view.z;
    const hit = (i) => wx >= X[i] && wx <= X[i] + W && wy >= Y[i] && wy <= Y[i] + H;
    for (let k = topList.length - 1; k >= 0; k--) if (hit(topList[k])) return topList[k];
    const cx = Math.floor(wx / CELL) - G.gx0, cy = Math.floor(wy / CELL) - G.gy0;
    if (cx < 0 || cy < 0 || cx >= G.gw || cy >= G.gh) return -1;
    const c = cy * G.gw + cx; let got = -1; for (let q = G.nStart[c]; q < G.nStart[c + 1]; q++) { const i = G.nList[q]; if (!movedF[i] && !topF[i] && hit(i)) got = i; }
    return got;
  }
  // 拖过的卡：一直画在最上面（后拖的在上）；位置变了、索引还没重建的另记在 moved 里
  const toTop = (i) => { if (topF[i]) topList.splice(topList.indexOf(i), 1); else topF[i] = 1; topList.push(i); if (!movedF[i]) { movedF[i] = 1; moved.push(i); } };
  // 松手时和别的卡叠了：竖着挪到最近的空位（上下都试，取挪得少的那边，卡和卡之间留 8px），160ms 滑过去，再重建索引
  function settleDrop(i) {
    const gap = 8, x = X[i];
    const near = (yy) => { const out = topList.filter((j) => j !== i), cx0 = Math.max(0, Math.floor((x - W) / CELL) - G.gx0), cx1 = Math.min(G.gw - 1, Math.floor((x + 2 * W) / CELL) - G.gx0), cy0 = Math.max(0, Math.floor((yy - H) / CELL) - G.gy0), cy1 = Math.min(G.gh - 1, Math.floor((yy + 2 * H) / CELL) - G.gy0);
      for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) { const c = cy * G.gw + cx; for (let q = G.nStart[c]; q < G.nStart[c + 1]; q++) { const j = G.nList[q]; if (j !== i && !movedF[j] && !topF[j]) out.push(j); } }
      return out; };
    const hits = (yy) => near(yy).filter((j) => X[j] < x + W + gap && X[j] + W + gap > x && Y[j] < yy + H + gap && Y[j] + H + gap > yy);
    const y0 = Y[i]; if (!hits(y0).length) { reindex(); return; }
    const walk = (dir) => { let yy = y0; for (let n = 0; n < 40; n++) { const hs = hits(yy); if (!hs.length) return yy; yy = dir > 0 ? Math.max(...hs.map((j) => Y[j] + H + gap)) : Math.min(...hs.map((j) => Y[j] - H - gap)); } return null; };
    const dn = walk(1), up = walk(-1), to = up === null ? dn : dn === null ? up : Math.abs(up - y0) < Math.abs(dn - y0) ? up : dn;
    if (to === null) { reindex(); return; }
    if (reduced()) { Y[i] = to; movedVer++; redraw(); reindex(); return; }
    const t0 = performance.now();
    const step = (now) => { if (dragNode === i) return; const k = Math.min(1, (now - t0) / 160); Y[i] = y0 + (to - y0) * (1 - Math.pow(1 - k, 3)); movedVer++; redraw(); if (k < 1) requestAnimationFrame(step); else reindex(); };
    requestAnimationFrame(step);
  }
  // 按下：在卡上就拖卡（移动超过 3px 才算拖，没拖就是点一下：钉住 / 取消钉住），在空白处就平移。
  // 拖卡：卡跟着指针，但整张卡不出视口（四边留 8px；卡比视口还大时退一步，只保证按住的那一点在里面），卡始终完整看得见；指针到了边上 32px 以内或拖出视口，画布朝那边平移（越靠外越快，每帧最多 24px），卡跟着走。
  // 在哪儿松手都行，卡就放在看得见的那个位置；Esc、切走窗口、指针被系统收走 = 取消，卡 200ms 滑回原处。
  // 收尾时按指针最后的位置重算悬停：指针在画布外（或在工具栏上）就不悬停任何卡——之前拖出画布松手，悬停高亮一直挂在被拖的卡上，连着的线和卡都亮着
  box.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("button, .sn-st-bar")) return;
    box.setPointerCapture(e.pointerId); cancelAnimationFrame(tween); stopZoom(); box.focus({ preventScroll: true });
    const hit = pick(e.clientX, e.clientY), sx = e.clientX, sy = e.clientY, ox = hit >= 0 ? X[hit] : 0, oy = hit >= 0 ? Y[hit] : 0, r0 = box.getBoundingClientRect();
    const gx = sx - (r0.left + view.x + ox * view.z), gy = sy - (r0.top + view.y + oy * view.z); // 按住的那一点在卡上的位置（屏幕像素）
    let px = sx, py = sy, lx = sx, ly = sy, went = false, fr = 0, done = false;
    if (hit >= 0) { dragNode = hit; updateActive(); }
    const sp = (v) => Math.sign(v) * Math.min(24, Math.abs(v) / 3);
    // 拖卡的一帧：先看要不要自动平移，再按"夹在视口里的指针"摆卡；还在边上就下一帧接着平移
    const frame = () => {
      fr = 0; if (done) return;
      const r = box.getBoundingClientRect(), E = 32, vx = px < r.left + E ? r.left + E - px : px > r.right - E ? r.right - E - px : 0, vy = py < r.top + E ? r.top + E - py : py > r.bottom - E ? r.bottom - E - py : 0;
      if (vx || vy) { view.x += sp(vx); view.y += sp(vy); }
      const cw = W * view.z, ch = H * view.z, fit = (v, lo, hi, size, grab) => (size <= hi - lo ? Math.max(lo, Math.min(hi - size, v - grab)) : Math.max(lo, Math.min(hi, v)) - grab);
      const left = fit(px, r.left + 8, r.right - 8, cw, gx), top = fit(py, r.top + 8, r.bottom - 8, ch, gy);
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
    // 取消：卡 200ms 滑回按下时的位置
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
    const hit = e.target.closest(".sn-st-bar, .sn-st-stat") ? -1 : pick(e.clientX, e.clientY); // 指针在工具栏、统计条上：不算悬停在下面的卡上
    if (hit !== hover) { hover = hit; box.style.cursor = hit >= 0 ? "pointer" : ""; updateActive(); }
  });
  box.addEventListener("pointerleave", () => { if (hover >= 0 && dragNode < 0) { hover = -1; updateActive(); } });
  box.addEventListener("keydown", (e) => { if (e.key === "Escape" && focus >= 0) { focus = -1; updateActive(); } });

  // ———— 后台线程：排版、重建索引 ————
  let worker = null, reqId = 0; const pending = new Map();
  try { worker = new Worker(new URL("../../packages/satin-ui/src/flow-layout-worker.js", import.meta.url), { type: "module" }); worker.onmessage = (e) => { const r = pending.get(e.data.id); pending.delete(e.data.id); r?.(e.data); }; } catch { worker = null; }
  const ask = (msg, transfer = []) => new Promise((res) => { const id = ++reqId; pending.set(id, res); worker.postMessage({ ...msg, id }, transfer); });
  function layout() {
    if (!worker) { const t0 = performance.now(), r = layeredLayout(N, EA, EB, () => W, () => H, { gapX: 260, gapY: 24 }), ms = Math.round(performance.now() - t0); return Promise.resolve({ x: r.x, y: r.y, ms, grid: buildGrid(N, r.x, r.y, EA, EB, W, H, CELL) }); }
    return ask({ type: "layout", n: N, w: W, h: H, gapX: 260, gapY: 24, cell: CELL });
  }
  function gridFor() {
    if (!worker) return Promise.resolve(buildGrid(N, X, Y, EA, EB, W, H, CELL));
    const x = X.slice(), y = Y.slice(); return ask({ type: "grid", n: N, x, y, w: W, h: H, cell: CELL }, [x.buffer, y.buffer]).then((d) => d.grid);
  }
  // 拖完：后台按新位置重建索引；建好之前拖过的卡一直单独处理。期间又拖了别的，就只换索引、不清名单
  async function reindex() {
    const ver = movedVer, dv = dataVer, gr = await gridFor(); if (dv !== dataVer || moving) return;
    setGrid(gr); if (ver === movedVer) { for (const i of moved) movedF[i] = 0; moved = []; } redraw();
  }
  // ———— 整理：后台分层排版全部节点（显示用时），节点按弹簧曲线移到新位置 ————
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
    if (reduced()) { X.set(lay.x); Y.set(lay.y); setGrid(lay.grid); messy = false; fit(); tidying = false; return; }
    const fx = X.slice(), fy = Y.slice(), s0 = performance.now(), D = 600; moving = true;
    const step = (now) => {
      if (dv !== dataVer) { moving = tidying = false; return; }
      const k = TIDY(Math.min(1, (now - s0) / D)); for (let i = 0; i < N; i++) { X[i] = fx[i] + (lay.x[i] - fx[i]) * k; Y[i] = fy[i] + (lay.y[i] - fy[i]) * k; } redraw();
      if (now - s0 < D) requestAnimationFrame(step); else { moving = false; messy = false; setGrid(lay.grid); fit(); tidying = false; } // 索引是后台线程按终点建好的，直接换上
    };
    requestAnimationFrame(step);
  }
  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-st]"); if (!b) return; const v = b.dataset.st;
    if (v === "fit") fit(); else if (v === "in") zoomTo(cssW / 2, cssH / 2, zoomTarget() * 1.6); else if (v === "out") zoomTo(cssW / 2, cssH / 2, zoomTarget() / 1.6);
    else if (v === "shuffle") shuffle(); else if (v === "tidy") tidy(b); else if (v === "hub") showHub();
    else if (v === "10000" || v === "50000") {
      if (+v === N || tidying) return; box.querySelectorAll("[data-st='10000'],[data-st='50000']").forEach((x) => x.classList.toggle("sn-on", x === b));
      b.classList.add("sn-busy"); setTimeout(() => { build(+v); b.classList.remove("sn-busy"); }, 30); // 先让按钮的状态画出来，再造数据
    }
  });
  resize(); build(10000);
  // 调试、测试用
  box._stress = {
    view, redraw, fit, stats: () => ({ N, M, fanMax, fanAvg, hubMax, drawMs: [...drawMs] }),
    toScreen: (i) => { const r = box.getBoundingClientRect(); return { x: r.left + view.x + (X[i] + W / 2) * view.z, y: r.top + view.y + (Y[i] + H / 2) * view.z }; },
    nodeAt: (i) => ({ x: X[i], y: Y[i] }), hover: () => hover, dragNode: () => dragNode, active: () => ({ src: A.src, ne: A.ne, nodes: A.nodes.length, focus }), moved: () => moved.length, top: () => topList.length,
    overlaps: () => { const seen = new Set(); let n = 0; for (let c = 0; c < G.gw * G.gh; c++) { const s0 = G.nStart[c], s1 = G.nStart[c + 1]; for (let a = s0; a < s1; a++) for (let b = a + 1; b < s1; b++) { const i = G.nList[a], j = G.nList[b], key = i < j ? i * N + j : j * N + i; if (seen.has(key)) continue; if (X[i] < X[j] + W && X[i] + W > X[j] && Y[i] < Y[j] + H && Y[i] + H > Y[j]) { seen.add(key); n++; } } } return n; },
  };
}
