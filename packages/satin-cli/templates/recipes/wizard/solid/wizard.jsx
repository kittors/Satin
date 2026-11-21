import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

export default function Wizard() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sn-page sn-narrow">
        <header class="sn-page-hd">
          <div>
            <h1>新建项目</h1>
            <p>三步：基本信息、导入原文、生成设置</p>
          </div>
        </header>
        <div class="sn-steps" style="margin-bottom: var(--sn-sp-24)">
          <span class="sn-st sn-done"><span class="sn-n">1</span>基本信息</span>
          <span class="sn-ln sn-done">
            <i></i>
          </span>
          <span class="sn-st sn-cur"><span class="sn-n">2</span>导入原文</span>
          <span class="sn-ln">
            <i></i>
          </span>
          <span class="sn-st"><span class="sn-n">3</span>生成设置</span>
        </div>
        <form class="sn-panel" novalidate>
          <div class="sn-form" style="max-width: none">
            <div class="sn-field" data-f="src">
              <span class="sn-lbl">从哪里开始</span>
              <sn-segmented items='["小说改编","原创剧本","空白项目"]' value="小说改编"></sn-segmented>
            </div>
            <div class="sn-field" data-f="text">
              <label class="sn-lbl" for="w-text">粘贴原文</label>
              <textarea class="sn-input" id="w-text" rows="8" placeholder="把第一集的原文贴在这里"></textarea>
              <div class="sn-help">最多 2 万字；更长的分几集导入。</div>
              <div class="sn-err">
                <span></span>
              </div>
            </div>
          </div>
          <div class="sn-panel-ft" style="justify-content: space-between">
            <button type="button" class="sn-btn sn-ghost" data-i="arrow-left:before">上一步</button>
            <button type="submit" class="sn-btn sn-primary">下一步</button>
          </div>
        </form>
      </div>
    </div>
  );
}
