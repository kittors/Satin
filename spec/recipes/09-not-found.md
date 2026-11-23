# 404 页面

极简整页 404：互动机械光圈视觉雕塑、一句清晰提示与首页/返回双按钮。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<main class="sn-e404" data-nf-root>
  <div class="sn-e404-wrap">
    <div class="sn-e404-trio" aria-label="404">
      <svg class="sn-e404-digit" viewBox="0 0 88 124" aria-hidden="true">
        <path class="sn-e404-digit-solid" fill-rule="evenodd" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" />
      </svg>

      <button type="button" class="sn-e404-lens" data-nf-lens aria-label="点击触发光圈快门">
        <svg class="sn-e404-lens-svg" viewBox="0 0 140 140" aria-hidden="true">
          <defs>
            <clipPath id="sn-e404-iris-clip"><circle cx="70" cy="70" r="42" /></clipPath>
          </defs>
          <g class="sn-e404-dial">
            <line class="sn-e404-tick-major" x1="70" y1="8" x2="70" y2="15" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(30 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(60 70 70)" />
            <line class="sn-e404-tick-major" x1="70" y1="8" x2="70" y2="15" transform="rotate(90 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(120 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(150 70 70)" />
            <line class="sn-e404-tick-major" x1="70" y1="8" x2="70" y2="15" transform="rotate(180 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(210 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(240 70 70)" />
            <line class="sn-e404-tick-major" x1="70" y1="8" x2="70" y2="15" transform="rotate(270 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(300 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(330 70 70)" />
          </g>
          <g class="sn-e404-iris-wrap">
            <circle class="sn-e404-barrel" cx="70" cy="70" r="42" />
            <g clip-path="url(#sn-e404-iris-clip)">
              <g class="sn-e404-blades">
                <path class="sn-e404-blade" d="M58 51 H118 V18 H58 Z" />
                <path class="sn-e404-blade-alt" d="M58 51 H118 V18 H58 Z" transform="rotate(60 70 70)" />
                <path class="sn-e404-blade" d="M58 51 H118 V18 H58 Z" transform="rotate(120 70 70)" />
                <path class="sn-e404-blade-alt" d="M58 51 H118 V18 H58 Z" transform="rotate(180 70 70)" />
                <path class="sn-e404-blade" d="M58 51 H118 V18 H58 Z" transform="rotate(240 70 70)" />
                <path class="sn-e404-blade-alt" d="M58 51 H118 V18 H58 Z" transform="rotate(300 70 70)" />
              </g>
            </g>
            <circle class="sn-e404-dot" cx="70" cy="70" r="2.2" />
          </g>
        </svg>
      </button>

      <svg class="sn-e404-digit" viewBox="0 0 88 124" aria-hidden="true">
        <path class="sn-e404-digit-solid" fill-rule="evenodd" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" />
      </svg>
    </div>

    <div class="sn-e404-head">
      <h1>这一页不在镜头里</h1>
      <p>你访问的地址可能已移动或失效。</p>
    </div>

    <div class="sn-e404-acts">
      <a class="sn-btn sn-primary" href="/">回到首页</a>
      <button type="button" class="sn-btn sn-secondary" data-nf-back>返回上一页</button>
    </div>
  </div>
</main>
<script type="module">
const root = document.querySelector("[data-nf-root]");
if (root) {
  let rot = 0, timer = 0;
  const shoot = () => {
    rot += 30;
    root.style.setProperty("--sn-e404-rot", rot + "deg");
    root.classList.remove("sn-shutter");
    void root.offsetWidth;
    root.classList.add("sn-shutter");
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.remove("sn-shutter"), 180);
  };

  root.querySelector("[data-nf-lens]")?.addEventListener("click", shoot);
  root.querySelector("[data-nf-back]")?.addEventListener("click", () => { if (history.length > 1) history.back(); });

  root.addEventListener("pointermove", (e) => {
    const r = root.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    root.style.setProperty("--sn-e404-x", (nx * 5).toFixed(1) + "px");
    root.style.setProperty("--sn-e404-y", (ny * 5).toFixed(1) + "px");
  });
  root.addEventListener("pointerleave", () => {
    root.style.setProperty("--sn-e404-x", "0px");
    root.style.setProperty("--sn-e404-y", "0px");
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

## 设计思路

- **极简三层结构**：页面居中留出充裕呼吸空间，只呈现 `4 [光圈 0] 4` 主符号、一句主副文案与两颗胶囊操作按钮，绝不堆砌状态栏、路径参数与多余卡片墙。
- **藏巧于简的光学交互**：静态时克制如几何字体雕塑；指针移动时内部 6 叶片机械光圈作 `±5px` 轻柔追焦，点击光圈或按空格键触发一次利落的快门收合与刻度微转。
- **主题与无障碍**：全走 `--sn-*` 中性色令牌，浅色与深色模式无缝适配；开启 `prefers-reduced-motion` 自动关闭位移动效。
