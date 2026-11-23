import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import { busy, toast } from "satin-ui/components";

defineElements();

export default function MobileOrder() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      const root = root.querySelector("[data-order-root]");
      if (root) {
      const UNIT = 189, OFF = 20;
      const subEl = root.querySelector("[data-ord-sub]");
      const totEl = root.querySelector("[data-ord-total]");
      const qtyEl = root.querySelector("[data-ord-qty]");
      const sync = () => {
        const q = Math.max(1, Number(qtyEl?.getAttribute("value") || qtyEl?.value || 1));
        const sub = UNIT * q;
        if (subEl) subEl.textContent = "¥" + sub.toFixed(2);
        if (totEl) totEl.textContent = "¥" + Math.max(0, sub - OFF).toFixed(2);
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
      });

      const submitBtn = root.querySelector("[data-ord-submit]");
      submitBtn?.addEventListener("click", () => {
        busy(submitBtn, new Promise((r) => setTimeout(r, 600)).then(() => {
          toast({ text: "订单已创建，正在拉起支付", tone: "success" });
        }));
      });
      }
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <style>.sn-ord-note {"{"{"}"} all: unset; box-sizing: border-box; flex: 1; min-width: 0; text-align: right; font: 400 calc(14px * var(--sn-font-scale, 1))/calc(20px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); {"}"} .sn-ord-note::placeholder {"{"{"}"} color: var(--sn-label-off); {"}"} .sn-ord-hr {"{"{"}"} height: 1px; margin: var(--sn-sp-10) 0; background: var(--sn-line); {"}"} .sn-ord-sum {"{"{"}"} padding: var(--sn-sp-2) var(--sn-sp-4) 0; display: grid; gap: var(--sn-sp-4); font-size: calc(12.5px * var(--sn-font-scale, 1)); {"}"} .sn-ord-bar-meta {"{"{"}"} display: grid; gap: 2px; {"}"} .sn-ord-bar-meta small {"{"{"}"} font: 400 calc(11px * var(--sn-font-scale, 1))/1 var(--sn-sans); color: var(--sn-label3); {"}"}</style>
      <main class="sn-page sn-narrow sn-screen" data-order-root="">
        <header class="sn-page-hd">
          <a class="sn-nav-back sn-nav-circle" href="/cart" aria-label="返回购物车" data-i="arrow-left"></a>
          <div>
            <h1>确认订单</h1>
          </div>
        </header>
        <div class="sn-stack sn-gap-8">
          <section class="sn-panel sn-flush">
            <div class="sn-set-list" style="border: 0; border-radius: 0">
              <div class="sn-set-row" tabindex="0">
                <span class="sn-ico" data-i="map-pin"></span>
                <div class="sn-tx">
                  <b>林夏 · 138 0000 1234</b>
                  <span>上海市徐汇区漕溪北路 88&nbsp;号 12&nbsp;楼</span>
                </div>
                <span class="sn-end" data-i="chevron-right"></span>
              </div>
            </div>
          </section>
          <section class="sn-panel">
            <div class="sn-row sn-gap-12" style="align-items: flex-start">
              <img src="https://images.unsplash.com/photo-1534105615256-13940a56ff44?auto=format&fit=crop&w=200&h=200&q=85" alt="折叠台灯" width="76" height="76" style="border-radius: var(--sn-r-lg); object-fit: cover; flex: none" />
              <div class="sn-grow" style="display: grid; gap: 4px; min-width: 0">
                <div class="sn-row sn-between" style="align-items: baseline">
                  <b>折叠台灯</b>
                  <b class="sn-num" data-ord-unit="">¥189</b>
                </div>
                <span class="sn-t-caption sn-c-tertiary">三档调光 · USB-C 磁吸快充</span>
                <div class="sn-row sn-gap-8" style="margin-top: 6px" role="radiogroup" aria-label="选择颜色" data-ord-colors="">
                  <button type="button" class="sn-chip sn-on" aria-checked="true" role="radio" data-color="暖白">暖白</button>
                  <button type="button" class="sn-chip" aria-checked="false" role="radio" data-color="冷白">冷白</button>
                  <button type="button" class="sn-chip" aria-checked="false" role="radio" data-color="胡桃木">胡桃木</button>
                </div>
              </div>
            </div>
            <div class="sn-ord-hr"></div>
            <div class="sn-row sn-between">
              <span class="sn-t-body sn-c-secondary">购买数量</span>
              <sn-stepper value="1" min="1" max="9" unit="件" data-ord-qty=""></sn-stepper>
            </div>
          </section>
          <section class="sn-panel sn-flush">
            <div class="sn-set-list" style="border: 0; border-radius: 0">
              <div class="sn-set-row" tabindex="0">
                <span class="sn-ico" data-i="clock"></span>
                <div class="sn-tx">
                  <b>配送时间</b>
                </div>
                <span class="sn-val">明天 09:00–12:00</span>
                <span class="sn-end" data-i="chevron-right"></span>
              </div>
              <div class="sn-set-row" tabindex="0">
                <span class="sn-ico" data-i="tag"></span>
                <div class="sn-tx">
                  <b>优惠券</b>
                </div>
                <span class="sn-val sn-num sn-c-success">−¥20</span>
                <span class="sn-end" data-i="chevron-right"></span>
              </div>
              <label class="sn-set-row" for="o-note">
                <span class="sn-ico" data-i="pencil"></span>
                <div class="sn-tx" style="flex: none">
                  <b>订单备注</b>
                </div>
                <input class="sn-ord-note" id="o-note" type="text" placeholder="选填，如放门口无需致电" />
              </label>
            </div>
          </section>
          <section class="sn-panel sn-flush">
            <div class="sn-set-list" role="radiogroup" aria-label="支付方式" style="border: 0; border-radius: 0">
              <label class="sn-set-row">
                <span class="sn-ico" data-i="message-circle"></span>
                <div class="sn-tx">
                  <b>微信支付</b>
                  <span>推荐 · 极速免密</span>
                </div>
                <span class="sn-radio">
                  <input type="radio" name="pay" checked />
                  <span class="sn-box"></span>
                </span>
              </label>
              <label class="sn-set-row">
                <span class="sn-ico" data-i="shield"></span>
                <div class="sn-tx">
                  <b>支付宝</b>
                  <span>支持花呗与余额</span>
                </div>
                <span class="sn-radio">
                  <input type="radio" name="pay" />
                  <span class="sn-box"></span>
                </span>
              </label>
            </div>
          </section>
          <div class="sn-ord-sum">
            <div class="sn-row sn-between">
              <span class="sn-c-tertiary">商品小计</span>
              <span class="sn-num sn-c-secondary" data-ord-sub="">¥189.00</span>
            </div>
            <div class="sn-row sn-between">
              <span class="sn-c-tertiary">运费</span>
              <span class="sn-c-secondary">免运费</span>
            </div>
            <div class="sn-row sn-between">
              <span class="sn-c-tertiary">优惠立减</span>
              <span class="sn-num sn-c-success">−¥20.00</span>
            </div>
          </div>
        </div>
        <div class="sn-bottom-bar">
          <div class="sn-grow sn-ord-bar-meta">
            <small>应付金额</small>
            <b class="sn-t-title2 sn-num" data-ord-total="">¥169.00</b>
          </div>
          <button type="button" class="sn-btn sn-primary sn-lg" data-ord-submit="">立即支付</button>
        </div>
      </main>
    </div>
  );
}
