# 移动端 H5 下单

舒展留白的移动端结算页：三张白卡片承托收货、商品与摘要，底部操作栏固定。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>
.sn-ord-addr { display: flex; align-items: center; gap: var(--sn-sp-12); padding: var(--sn-sp-16); cursor: pointer; }
.sn-ord-addr-tx { flex: 1; min-width: 0; display: grid; gap: var(--sn-sp-4); }
.sn-ord-addr-hd { display: flex; align-items: baseline; gap: var(--sn-sp-8); }
.sn-ord-addr-hd b { font: 600 calc(15px * var(--sn-font-scale, 1))/calc(22px * var(--sn-font-scale, 1)) var(--sn-sans); }
.sn-ord-addr-hd span { font: 400 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); font-variant-numeric: tabular-nums; }
.sn-ord-addr-tx p { margin: 0; font: 400 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sn-ord-hero { display: block; width: 100%; height: 148px; border-radius: var(--sn-r-lg); object-fit: cover; background: var(--sn-fill-subtle); }
.sn-ord-prod { display: grid; gap: var(--sn-sp-16); }
.sn-ord-prod-hd { display: flex; align-items: baseline; justify-content: space-between; gap: var(--sn-sp-12); }
.sn-ord-prod-hd b { font: 600 calc(17px * var(--sn-font-scale, 1))/calc(24px * var(--sn-font-scale, 1)) var(--sn-sans); letter-spacing: -.01em; }
.sn-ord-prod-sub { margin: var(--sn-sp-2) 0 0; font: 400 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); }
.sn-ord-ctrl { display: flex; align-items: center; justify-content: space-between; gap: var(--sn-sp-12); padding-top: var(--sn-sp-12); box-shadow: inset 0 1px 0 color-mix(in srgb, var(--sn-line) 70%, transparent); }
.sn-ord-kv { display: flex; align-items: center; justify-content: space-between; gap: var(--sn-sp-12); min-height: 50px; padding: var(--sn-sp-12) var(--sn-sp-16); cursor: pointer; }
.sn-ord-kv + .sn-ord-kv { box-shadow: inset 0 1px 0 color-mix(in srgb, var(--sn-line) 70%, transparent); }
.sn-ord-kv > span:first-child { font: 400 calc(14px * var(--sn-font-scale, 1))/calc(20px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label2); }
.sn-ord-kv-r { display: inline-flex; align-items: center; gap: var(--sn-sp-4); font: 500 calc(14px * var(--sn-font-scale, 1))/calc(20px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); }
.sn-ord-kv-r .sn-ic { width: 15px; height: 15px; color: var(--sn-label3); }
.sn-ord-bar-meta { display: grid; gap: var(--sn-sp-2); }
.sn-ord-bar-meta small { font: 400 calc(11px * var(--sn-font-scale, 1))/1 var(--sn-sans); color: var(--sn-label3); }
</style>
<main class="sn-page sn-narrow sn-screen" data-order-root>
  <header class="sn-page-hd">
    <a class="sn-nav-back sn-nav-circle" href="/cart" aria-label="返回购物车" data-i="arrow-left"></a>
    <div><h1>确认订单</h1></div>
  </header>

  <div class="sn-stack sn-gap-16">
    <section class="sn-panel sn-flush">
      <div class="sn-ord-addr" tabindex="0" role="button" data-ord-addr>
        <div class="sn-ord-addr-tx">
          <div class="sn-ord-addr-hd"><b>林夏</b><span>138 0000 1234</span></div>
          <p>上海市徐汇区漕溪北路 88&nbsp;号 12&nbsp;楼</p>
        </div>
        <span class="sn-end" data-i="chevron-right" style="color: var(--sn-label3)"></span>
      </div>
    </section>

    <section class="sn-panel sn-ord-prod">
      <img class="sn-ord-hero" src="https://images.unsplash.com/photo-1534105615256-13940a56ff44?auto=format&fit=crop&w=720&h=360&q=85" alt="折叠台灯" width="720" height="360">
      <div>
        <div class="sn-ord-prod-hd">
          <b>折叠台灯</b>
          <b class="sn-num" data-ord-unit>¥189</b>
        </div>
        <p class="sn-ord-prod-sub" data-ord-spec>暖白 · 三档调光 · USB-C 充电</p>
      </div>
      <div class="sn-ord-ctrl">
        <div class="sn-row sn-gap-8" role="radiogroup" aria-label="选择颜色" data-ord-colors>
          <button type="button" class="sn-chip sn-on" aria-checked="true" role="radio" data-color="暖白">暖白</button>
          <button type="button" class="sn-chip" aria-checked="false" role="radio" data-color="冷白">冷白</button>
          <button type="button" class="sn-chip" aria-checked="false" role="radio" data-color="胡桃木">胡桃木</button>
        </div>
        <sn-stepper value="1" min="1" max="9" data-ord-qty></sn-stepper>
      </div>
    </section>

    <section class="sn-panel sn-flush">
      <div class="sn-ord-kv" tabindex="0" role="button" data-ord-ship>
        <span>配送</span>
        <span class="sn-ord-kv-r">明天上午 · 免运费<span data-i="chevron-right"></span></span>
      </div>
      <div class="sn-ord-kv" tabindex="0" role="button" data-ord-coupon>
        <span>优惠</span>
        <span class="sn-ord-kv-r sn-num sn-c-success">−¥20<span data-i="chevron-right"></span></span>
      </div>
      <div class="sn-ord-kv" tabindex="0" role="button" data-ord-pay>
        <span>支付方式</span>
        <span class="sn-ord-kv-r"><span data-ord-pay-val>微信支付</span><span data-i="chevron-right"></span></span>
      </div>
    </section>
  </div>

  <div class="sn-bottom-bar">
    <div class="sn-grow sn-ord-bar-meta">
      <small>应付</small>
      <b class="sn-t-title1 sn-num" data-ord-total>¥169</b>
    </div>
    <button type="button" class="sn-btn sn-primary sn-lg" data-ord-submit>立即支付</button>
  </div>
</main>
<script type="module">
import { busy, toast } from "satin-ui/components";

const root = document.querySelector("[data-order-root]");
if (root) {
  const UNIT = 189, OFF = 20;
  const totEl = root.querySelector("[data-ord-total]");
  const unitEl = root.querySelector("[data-ord-unit]");
  const specEl = root.querySelector("[data-ord-spec]");
  const qtyEl = root.querySelector("[data-ord-qty]");
  const sync = () => {
    const q = Math.max(1, Number(qtyEl?.getAttribute("value") || qtyEl?.value || 1));
    const sub = UNIT * q;
    if (unitEl) unitEl.textContent = "¥" + sub;
    if (totEl) totEl.textContent = "¥" + Math.max(0, sub - OFF);
  };
  qtyEl?.addEventListener("change", sync);
  qtyEl?.addEventListener("input", sync);

  const colors = root.querySelector("[data-ord-colors]");
  colors?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-color]");
    if (!btn) return;
    for (const b of colors.querySelectorAll("button[data-color]")) {
      const on = b === btn;
      b.classList.toggle("sn-on", on);
      b.setAttribute("aria-checked", String(on));
    }
    if (specEl) specEl.textContent = btn.dataset.color + " · 三档调光 · USB-C 充电";
  });

  const payRow = root.querySelector("[data-ord-pay]");
  const payVal = root.querySelector("[data-ord-pay-val]");
  payRow?.addEventListener("click", () => {
    if (!payVal) return;
    payVal.textContent = payVal.textContent === "微信支付" ? "支付宝" : "微信支付";
    toast({ text: "已切换至" + payVal.textContent, tone: "info" });
  });

  const submitBtn = root.querySelector("[data-ord-submit]");
  submitBtn?.addEventListener("click", () => {
    busy(submitBtn, new Promise((r) => setTimeout(r, 600)).then(() => {
      toast({ text: "订单已创建，正在拉起支付", tone: "success" });
    }));
  });
}
</script>
```

## 移动端 UI 设计要点（反 AI 味规范）

- **留白舒展，克制信息密度**（`mobile-breathing`）：不把十余项表单塞满一屏，只突出一个视觉主角（大图商品卡）与精炼的核心区块，组间留出 16px 呼吸间距。
- **拒绝行前灰底小方盒装饰图标**（`no-icon-box`）：「配送」「优惠」「支付方式」与收货人地址靠清晰中文与字号层次即可一目了然，不强凑时钟、标签、铅笔等装饰图标，更不套浅灰圆角方盒。
- **圆形返回按钮与原生安全区**：顶栏采用 38px 圆形柔底箭头返回，底栏饱满圆角主按钮留足底部安全区，内容从不被截断。
