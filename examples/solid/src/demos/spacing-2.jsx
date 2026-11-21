import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./spacing-2.css";

export default function SpacingDemo2() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sp-tools">
        <span class="sn-cap">密度</span>
        <div class="sn-seg sn-sm" data-seg="spdensity">
          <span class="sn-thumb" style="width: 52px; transform: translateX(52px) scaleX(1) scaleY(1);"></span>
          <button data-v="compact" role="tab" aria-selected="false" tabindex="-1">紧凑</button>
          <button data-v="default" role="tab" aria-selected="true" tabindex="0">标准</button>
          <button data-v="comfortable" role="tab" aria-selected="false" tabindex="-1">宽松</button>
        </div>
        <label class="sn-check" data-c=""><input type="checkbox" data-sp-show="" checked /><span class="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span class="sn-bar"></span>
</span>显示间距标注（绿：内边距，紫：间隙）</label>
      </div>
      <div class="sp-stage" id="spStage" data-density="default">
        <article class="sp-card" data-sp-pad="" data-sp-gap="">
          <div class="sp-thumb"></div>
          <div class="sp-head" data-sp-gap="">
            <b>雨夜车站</b>
            <span>第三集 · 48 个镜头 · 3 分钟前改过</span>
          </div>
          <div class="sp-tags" data-sp-gap="">
            <span class="sn-tag">电影感</span>
            <span class="sn-tag">16:9</span>
            <span class="sn-tag">林夏</span>
          </div>
          <div class="sp-acts" data-sp-gap="">
            <button class="sn-btn sn-secondary sn-sm">预览</button>
            <button class="sn-btn sn-primary sn-sm">继续编辑</button>
          </div>
        </article>
        <section class="sp-panel" data-sp-pad="" data-sp-gap="">
          <div class="sp-grp" data-sp-gap="">
            <b>导出</b>
            <div class="sp-line">
              <span>分辨率</span>
              <span>1080p</span>
            </div>
            <div class="sp-line">
              <span>帧率</span>
              <span>24</span>
            </div>
          </div>
          <div class="sp-grp" data-sp-gap="">
            <b>字幕</b>
            <div class="sp-line">
              <span>语言</span>
              <span>中英双语</span>
            </div>
            <div class="sp-line">
              <span>位置</span>
              <span>底部居中</span>
            </div>
          </div>
        </section>
        <div class="sp-overlay" aria-hidden="true">
          <i class="pad" style="left: 0px; top: 0px; width: 280px; height: 16px;">
            <b>16</b>
          </i>
          <i class="pad" style="left: 0px; top: 295.5px; width: 280px; height: 16px;">
            <b>16</b>
          </i>
          <i class="pad" style="left: 0px; top: 16px; width: 16px; height: 279.5px;">
            <b>16</b>
          </i>
          <i class="pad" style="left: 264px; top: 16px; width: 16px; height: 279.5px;">
            <b>16</b>
          </i>
          <i class="pad" style="left: 312px; top: 0px; width: 280px; height: 24px;">
            <b>24</b>
          </i>
          <i class="pad" style="left: 312px; top: 184px; width: 280px; height: 24px;">
            <b>24</b>
          </i>
          <i class="pad" style="left: 312px; top: 24px; width: 24px; height: 160px;">
            <b>24</b>
          </i>
          <i class="pad" style="left: 568px; top: 24px; width: 24px; height: 160px;">
            <b>24</b>
          </i>
          <i class="sn-gap" style="left: 16px; top: 155.5px; width: 248px; height: 16px;">
            <b>16</b>
          </i>
          <i class="sn-gap" style="left: 16px; top: 211.5px; width: 248px; height: 16px;">
            <b>16</b>
          </i>
          <i class="sn-gap" style="left: 16px; top: 251.5px; width: 248px; height: 16px;">
            <b>16</b>
          </i>
          <i class="sn-gap out-r" style="left: 16px; top: 191.5px; width: 248px; height: 4px;">
            <b>4</b>
          </i>
          <i class="sn-gap out-t" style="left: 68px; top: 227.5px; width: 8px; height: 24px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-t" style="left: 117.2px; top: 227.5px; width: 8px; height: 24px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-t" style="left: 60px; top: 267.5px; width: 8px; height: 28px;">
            <b>8</b>
          </i>
          <i class="sn-gap" style="left: 336px; top: 96px; width: 232px; height: 16px;">
            <b>16</b>
          </i>
          <i class="sn-gap out-r" style="left: 336px; top: 40px; width: 232px; height: 8px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-r" style="left: 336px; top: 68px; width: 232px; height: 8px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-r" style="left: 336px; top: 128px; width: 232px; height: 8px;">
            <b>8</b>
          </i>
          <i class="sn-gap out-r" style="left: 336px; top: 156px; width: 232px; height: 8px;">
            <b>8</b>
          </i>
        </div>
      </div>
    </div>
  );
}
