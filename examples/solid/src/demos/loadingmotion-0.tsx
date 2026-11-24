import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./loadingmotion-0.css";

export default function LoadingmotionDemo0() {
  let root!: HTMLDivElement;
  let off = () => {};
  onSettled(() => {
    if (!root) return;
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el: HTMLDivElement) => (root = el)}>
      <div class="lm-cmp" id="lmCompare">
        <div class="lm-bar">
          <div class="sn-seg sn-sm" data-seg="lmnav" role="tablist" aria-label="切换分集">
            <span class="sn-thumb" style="width: 64px; transform: translateX(0px) scaleX(1) scaleY(1);"></span>
            <button type="button" data-v="ep3" role="tab" aria-selected="true" tabindex="0">第三集</button>
            <button type="button" data-v="ep4" role="tab" aria-selected="false" tabindex="-1">第四集</button>
            <button type="button" data-v="ep5" role="tab" aria-selected="false" tabindex="-1">第五集</button>
          </div>
          <div class="lm-delay">
            <span class="sn-cap">模拟延迟</span>
            <div class="sn-seg sn-sm" data-seg="lmdelay" role="tablist" aria-label="模拟延迟">
              <span class="sn-thumb" style="width: 68px; transform: translateX(0px) scaleX(1) scaleY(1);"></span>
              <button type="button" data-v="160" role="tab" aria-selected="true" tabindex="0">160ms</button>
              <button type="button" data-v="420" role="tab" aria-selected="false" tabindex="-1">420ms</button>
              <button type="button" data-v="850" role="tab" aria-selected="false" tabindex="-1">850ms</button>
            </div>
          </div>
        </div>
        <div class="lm-cols">
          <div class="lm-pane">
            <div class="lm-hd">
              <b>直接清空</b>
              <span class="lm-stat" data-lm-raw-stat="">160ms</span>
            </div>
            <div class="lm-bd" data-lm-raw="">
              <div class="lm-layer">
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span class="lm-txt">
                    <b>01 · 车站外，雨刚停</b>
                    <span>远景 · 5200K 冷调</span>
                  </span>
                  <time class="lm-dur">00:04</time>
                </div>
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1511087273610-b219e302a808?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span class="lm-txt">
                    <b>02 · 林夏走进候车厅</b>
                    <span>全景 · 缓推</span>
                  </span>
                  <time class="lm-dur">00:06</time>
                </div>
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span class="lm-txt">
                    <b>03 · 站台上的末班车</b>
                    <span>中景 · 固定</span>
                  </span>
                  <time class="lm-dur">00:05</time>
                </div>
              </div>
            </div>
          </div>
          <div class="lm-pane lm-pane-good">
            <div class="lm-hd">
              <b>Satin 过渡</b>
              <span class="lm-stat" data-lm-satin-stat="">160ms</span>
            </div>
            <div class="lm-bd" data-lm-satin="">
              <div class="lm-layer">
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span class="lm-txt">
                    <b>01 · 车站外，雨刚停</b>
                    <span>远景 · 5200K 冷调</span>
                  </span>
                  <time class="lm-dur">00:04</time>
                </div>
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1511087273610-b219e302a808?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span class="lm-txt">
                    <b>02 · 林夏走进候车厅</b>
                    <span>全景 · 缓推</span>
                  </span>
                  <time class="lm-dur">00:06</time>
                </div>
                <div class="lm-row">
                  <span class="lm-thumb">
                    <img src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=240&q=70" alt="" decoding="async" />
                  </span>
                  <span class="lm-txt">
                    <b>03 · 站台上的末班车</b>
                    <span>中景 · 固定</span>
                  </span>
                  <time class="lm-dur">00:05</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
