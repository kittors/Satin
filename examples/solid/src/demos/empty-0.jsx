import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function EmptyDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sn-empty-grid">
        <div class="sn-empty-state">
          <span class="sn-art" data-i="folder-open"></span>
          <h4>还没有项目</h4>
          <p>新建或导入原文即可开始。</p>
          <div class="sn-acts">
            <button class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
            <button class="sn-btn sn-secondary">导入原文</button>
          </div>
        </div>
        <div class="sn-empty-state">
          <span class="sn-art" data-i="search"></span>
          <h4>未找到“雨夜”相关镜头</h4>
          <p>换个关键词，或清除当前筛选。</p>
          <div class="sn-acts">
            <button class="sn-btn sn-secondary">清除筛选</button>
          </div>
        </div>
        <div class="sn-empty-state">
          <span class="sn-art" data-i="wifi-off"></span>
          <h4>暂时无法加载</h4>
          <p>连接已中断，网络恢复后自动重试。</p>
          <div class="sn-acts">
            <button class="sn-btn sn-secondary" data-act="" data-retry="">重试</button>
          </div>
        </div>
      </div>
    </div>
  );
}
