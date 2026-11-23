# 404 页面

面向精密创作工具与现代 Web 应用的整页 404 方案——「镜头 404 · 光学取景器」。摒弃廉价卡通插画、彩色渐变背景与网络段子，以纯中性黑白灰工业质感构建可互动的光学取景画幅：指针移动时 6 叶片机械光圈阻尼追焦，点击光圈或按空格键触发机械快门收合、场记笔记轮换与 `NumberFlow` 镜头号滚动；下方保留直白的返回动作与 3 张高频直达入口卡，桌面、平板与手机全自适应。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<main class="sn-e404" data-nf-root>
  <div class="sn-e404-wrap">
    <section class="sn-e404-frame" data-nf-frame aria-label="404 光学取景器">
      <div class="sn-e404-hud">
        <div class="sn-e404-hud-l">
          <i class="sn-e404-rec" aria-hidden="true"></i>
          <span class="sn-e404-tag">FRAME 404</span>
          <span class="sn-e404-path">
            <code data-nf-path>/projects/rainy-station/shot-404</code>
            <button type="button" class="sn-e404-copybtn" data-nf-copy data-tip="复制路径" aria-label="复制当前路径">
              <span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span>
            </button>
          </span>
        </div>
        <span class="sn-e404-coord" data-nf-coord aria-hidden="true">X +00 · Y +00</span>
      </div>

      <div class="sn-e404-stage" data-nf-stage>
        <i class="sn-e404-corner sn-tl" aria-hidden="true"></i>
        <i class="sn-e404-corner sn-tr" aria-hidden="true"></i>
        <i class="sn-e404-corner sn-bl" aria-hidden="true"></i>
        <i class="sn-e404-corner sn-br" aria-hidden="true"></i>
        <div class="sn-e404-flash" aria-hidden="true"></div>

        <div class="sn-e404-trio">
          <svg class="sn-e404-digit" viewBox="0 0 88 124" aria-hidden="true">
            <path class="sn-e404-digit-ghost" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" transform="translate(4 4)" />
            <path class="sn-e404-digit-solid" fill-rule="evenodd" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" />
          </svg>

          <button type="button" class="sn-e404-lens" data-nf-lens aria-label="点击对焦快门，重新拍摄当前空帧">
            <svg class="sn-e404-lens-svg" viewBox="0 0 140 140" aria-hidden="true">
              <defs>
                <clipPath id="sn-e404-iris-clip"><circle cx="70" cy="70" r="44" /></clipPath>
              </defs>
              <g class="sn-e404-dial">
                <line class="sn-e404-tick-major" x1="70" y1="6" x2="70" y2="15" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(15 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(30 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(45 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(60 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(75 70 70)" />
                <line class="sn-e404-tick-major" x1="70" y1="6" x2="70" y2="15" transform="rotate(90 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(105 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(120 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(135 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(150 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(165 70 70)" />
                <line class="sn-e404-tick-major" x1="70" y1="6" x2="70" y2="15" transform="rotate(180 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(195 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(210 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(225 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(240 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(255 70 70)" />
                <line class="sn-e404-tick-major" x1="70" y1="6" x2="70" y2="15" transform="rotate(270 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(285 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(300 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(315 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(330 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(345 70 70)" />
                <polygon class="sn-e404-mark" points="70,18 67,13 73,13" />
              </g>
              <g class="sn-e404-iris-wrap">
                <circle class="sn-e404-barrel" cx="70" cy="70" r="44" />
                <g clip-path="url(#sn-e404-iris-clip)">
                  <g class="sn-e404-blades">
                    <path class="sn-e404-blade" d="M58 49 H118 V18 H58 Z" />
                    <path class="sn-e404-blade-alt" d="M58 49 H118 V18 H58 Z" transform="rotate(60 70 70)" />
                    <path class="sn-e404-blade" d="M58 49 H118 V18 H58 Z" transform="rotate(120 70 70)" />
                    <path class="sn-e404-blade-alt" d="M58 49 H118 V18 H58 Z" transform="rotate(180 70 70)" />
                    <path class="sn-e404-blade" d="M58 49 H118 V18 H58 Z" transform="rotate(240 70 70)" />
                    <path class="sn-e404-blade-alt" d="M58 49 H118 V18 H58 Z" transform="rotate(300 70 70)" />
                  </g>
                </g>
                <path class="sn-e404-reticle" d="M60 65 V60 H65 M75 60 H80 V65 M80 75 V80 H75 M65 80 H60 V75" />
                <circle class="sn-e404-dot" cx="70" cy="70" r="2" />
              </g>
            </svg>
          </button>

          <svg class="sn-e404-digit" viewBox="0 0 88 124" aria-hidden="true">
            <path class="sn-e404-digit-ghost" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" transform="translate(4 4)" />
            <path class="sn-e404-digit-solid" fill-rule="evenodd" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" />
          </svg>
        </div>
      </div>

      <div class="sn-e404-bar">
        <span class="sn-e404-note" data-nf-note aria-live="polite">第 1 镜 · 已对焦，但这一页不在当前时间线上。</span>
        <span class="sn-e404-meta">
          <span class="sn-e404-specs">F/2.8 · 24 FPS</span>
          <span class="sn-e404-take">TAKE <span data-nf-take>01</span></span>
        </span>
      </div>
    </section>

    <div class="sn-e404-head">
      <h1>这一页不在这个镜头里</h1>
      <p>你访问的地址可能已移除、改名，或这一场戏尚未开机。</p>
    </div>

    <div class="sn-e404-acts">
      <a class="sn-btn sn-primary" href="/" data-i="house:before">回到首页</a>
      <button type="button" class="sn-btn sn-secondary" data-nf-back data-i="arrow-left:before">返回上一页</button>
      <button type="button" class="sn-btn sn-ghost" data-nf-shutter data-i="rotate-cw:before">重新对焦<kbd class="sn-kbd">Space</kbd></button>
    </div>

    <nav class="sn-e404-links" aria-label="常用入口">
      <a class="sn-card sn-bordered sn-sm sn-interactive sn-e404-link" href="/components">
        <div class="sn-e404-link-top"><span class="sn-e404-link-ic" data-i="layout-grid"></span><b>组件总览</b><span class="sn-e404-link-arr" data-i="arrow-up-right"></span></div>
        <p>64 个即用组件与 7 框架示例</p>
      </a>
      <a class="sn-card sn-bordered sn-sm sn-interactive sn-e404-link" href="/recipes">
        <div class="sn-e404-link-top"><span class="sn-e404-link-ic" data-i="rows-3"></span><b>页面配方</b><span class="sn-e404-link-arr" data-i="arrow-up-right"></span></div>
        <p>9 套完整业务骨架开箱即用</p>
      </a>
      <a class="sn-card sn-bordered sn-sm sn-interactive sn-e404-link" href="/guide">
        <div class="sn-e404-link-top"><span class="sn-e404-link-ic" data-i="book-open"></span><b>设计规范</b><span class="sn-e404-link-arr" data-i="arrow-up-right"></span></div>
        <p>令牌、动效与去 AI 味准则</p>
      </a>
    </nav>
  </div>
</main>
<script type="module">
import { createNumberFlow, copied } from "satin-ui/components";

const root = document.querySelector("[data-nf-root]");
const frame = root?.querySelector("[data-nf-frame]");
const stage = root?.querySelector("[data-nf-stage]");
const coord = root?.querySelector("[data-nf-coord]");
const noteEl = root?.querySelector("[data-nf-note]");
const takeEl = root?.querySelector("[data-nf-take]");
const pathEl = root?.querySelector("[data-nf-path]");

if (root && frame && stage) {
  const NOTES = [
    "已对焦，但这一页不在当前时间线上。",
    "切换广角复核，场记表里没有这个编号。",
    "镜面干净，只是你要找的那场戏还没开机。",
    "光线与构图正常，唯独目标地址缺席。",
    "连续空拍多次，建议直接回到有画面的一页。",
  ];
  let take = 1, rot = 0, timer = 0;
  const nf = takeEl ? createNumberFlow(takeEl, { value: 1, effect: "roll", format: (v) => String(Math.round(v)).padStart(2, "0") }) : null;

  const shoot = () => {
    take += 1;
    rot += 30;
    frame.style.setProperty("--sn-e404-rot", rot + "deg");
    frame.classList.remove("sn-shutter");
    void frame.offsetWidth;
    frame.classList.add("sn-shutter");
    clearTimeout(timer);
    timer = setTimeout(() => frame.classList.remove("sn-shutter"), 180);
    nf?.set(take);
    if (noteEl) noteEl.textContent = `第 ${take} 镜 · ${NOTES[(take - 1) % NOTES.length]}`;
  };

  root.querySelector("[data-nf-lens]")?.addEventListener("click", shoot);
  root.querySelector("[data-nf-shutter]")?.addEventListener("click", shoot);
  root.querySelector("[data-nf-back]")?.addEventListener("click", () => { if (history.length > 1) history.back(); });

  const copyBtn = root.querySelector("[data-nf-copy]");
  copyBtn?.addEventListener("click", () => {
    const txt = pathEl?.textContent?.trim() || location.pathname;
    navigator.clipboard?.writeText(txt).catch(() => {});
    copied(copyBtn);
  });

  const fmt = (n) => (n >= 0 ? "+" : "-") + String(Math.abs(Math.round(n))).padStart(2, "0");
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    frame.style.setProperty("--sn-e404-x", (nx * 8).toFixed(1) + "px");
    frame.style.setProperty("--sn-e404-y", (ny * 8).toFixed(1) + "px");
    if (coord) coord.textContent = `X ${fmt(nx * 48)} · Y ${fmt(ny * 32)}`;
  });
  stage.addEventListener("pointerleave", () => {
    frame.style.setProperty("--sn-e404-x", "0px");
    frame.style.setProperty("--sn-e404-y", "0px");
    if (coord) coord.textContent = "X +00 · Y +00";
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "")) {
      e.preventDefault();
      shoot();
    }
  });
}
</script>
```

## 设计思路与层次拆解

| 区域 | 构成与视觉职责 | 交互与防错要点 |
|---|---|---|
| 顶部取景标尺（`.sn-e404-hud`） | 状态圆点 + `FRAME 404` + 路径胶囊（可一键复制）+ 右侧微坐标 | 复制后图标原地切为对勾；窄屏自动隐藏右侧坐标以保单行利落 |
| 光学取景舞台（`.sn-e404-stage`） | 十字极淡参考线 + 四角光学 L 型折角 + 双层几何 `4` + 中央 6 叶片机械光圈 `0` | 指针移动时镜筒 ±8px 阻尼跟手；点击光圈或按 `Space` 触发快门叶片收合与柔和遮幅闪动 |
| 底部场记条（`.sn-e404-bar`） | 左侧单行场记状态句 + 右侧 `F/2.8 · 24 FPS` 与 `TAKE 01` | 场记区单行截断固定高度，切换文字零抖动；`TAKE` 计数走 `createNumberFlow` 纵向滚动 |
| 主信息与快捷导航 | 22/600 短标题 + ≤18 字平衡断行说明 + 主/次/轻三操作 + 3 张 `.sn-card.sn-bordered` 直达卡 | 仅「回到首页」用实心主按钮；卡片与外框平级并列，严守不嵌套卡片原则 |

## 接入业务项目的注意事项

- **真实路径替换**：在路由未命中时，把 `[data-nf-path]` 的文本填为真实 `location.pathname + location.hash`，方便用户一键复制反馈给排查人员。
- **主次出口实用优先**：快门互动只是克制的彩蛋，首屏永远一眼能看到「回到首页」「返回上一页」以及 3 个高频入口，手机端（`< 640px`）自动收敛为单列。
- **无障碍与动态偏好**：开启系统 `prefers-reduced-motion` 时，光圈旋转、防抖位移与快门遮幅自动关闭过渡，点击依然正常计数与更新场记文字（`aria-live="polite"`）。
