import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createCount, createLongText, toast } from "satin-ui/components";
import "./count-0.css";

export default function CountDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      // 单行：<input maxlength="20" data-count>，右边的计数跟着滚动，快满变色，写满还在敲时抖一下
      for (const input of root.querySelectorAll("input[data-count]")) createCount(input);

      // 长文本：<div data-ta data-max="120">…<textarea>…</div>
      // 自动长高 + 量环计数；快满"还剩 N 字"，超出"超出 N 字"并整框变红；⌘↵ 提交
      createLongText(root.querySelector("[data-ta]"), { onSubmit: () => toast({ text: "画面描述已保存" }) });
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="grid-m auto" style="--min:260px;gap:24px;align-items:start">
        <div class="stack" style="gap:18px">
          <div class="sn-field">
            <label class="sn-lbl" for="c-title">镜头标题</label>
            <span class="sn-ib sn-has-post sn-has-count">
              <input class="sn-input sn-lg" id="c-title" maxlength="20" placeholder="一句话说清这个镜头" data-count="" />
              <span class="sn-post">
                <span class="sn-counter">
                  <span class="sn-roll">
                    <span>0</span>
                  </span>
                  <span>/20</span>
                </span>
              </span>
            </span>
          </div>
          <div class="sn-field">
            <label class="sn-lbl" for="c-name">角色名</label>
            <span class="sn-ib sn-has-post sn-has-count">
              <input class="sn-input" id="c-name" maxlength="8" value="林夏" data-count="" />
              <span class="sn-post">
                <span class="sn-counter">
                  <span class="sn-roll">
                    <span>0</span>
                  </span>
                  <span>/8</span>
                </span>
              </span>
            </span>
          </div>
        </div>
        <div class="sn-field">
          <label class="sn-lbl" for="c-desc">画面描述</label>
          <div class="sn-box-in" data-ta="" data-max="120" data-max-lines="7">
            <textarea id="c-desc" rows="3" placeholder="写清楚人物、动作和光线，生成会更准。可以一直往下写，框会跟着长高。"></textarea>
            <div class="sn-ta-foot">
              <span class="sn-hint">⇧↵ 换行 · ⌘↵ 保存</span>
              <span class="sn-ta-count">
                <svg class="sn-uring" viewBox="0 0 16 16">
                  <circle class="sn-bg" cx="8" cy="8" r="6"></circle>
                  <circle class="sn-fg" cx="8" cy="8" r="6"></circle>
                </svg>
                <span class="sn-txt"><span class="sn-roll">
  <span>0</span>
</span> / 120</span>
              </span>
            </div>
          </div>
          <div class="sn-help">中文、英文、标点都按一个字算；表情按一个字算。</div>
        </div>
      </div>
    </div>
  );
}
