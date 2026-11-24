import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function TreeDemo1() {
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
      <div id="treeLazyHost">
        <div class="sn-tree">
          <div class="sn-tree-vp sn-sa sn-sa-in" data-tr-host="" aria-label="远程异步懒加载目录树" data-bar="auto" data-over="contain">
            <div class="sn-sa-vp sn-fy" role="tree" aria-label="远程异步懒加载目录树">
              <div class="sn-tree-space">
                <div class="sn-tree-rows">
                  <div class="sn-tr" role="treeitem" data-id="lz-ep1" data-depth="0" aria-level="1" aria-expanded="false">
                    <button type="button" class="sn-tr-tw" data-tr-tw="lz-ep1" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span class="sn-tr-ico">
                      <span data-i="folder"></span>
                    </span>
                    <span class="sn-tr-lbl" data-tip-full="">第一集 · 远程素材库</span>
                    <span class="sn-tr-badge">远程</span>
                  </div>
                  <div class="sn-tr" role="treeitem" data-id="lz-ep2" data-depth="0" aria-level="1" aria-expanded="false">
                    <button type="button" class="sn-tr-tw" data-tr-tw="lz-ep2" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span class="sn-tr-ico">
                      <span data-i="folder"></span>
                    </span>
                    <span class="sn-tr-lbl" data-tip-full="">第二集 · 分镜渲染帧</span>
                    <span class="sn-tr-badge">远程</span>
                  </div>
                  <div class="sn-tr" role="treeitem" data-id="lz-retry" data-depth="0" aria-level="1" aria-expanded="false">
                    <button type="button" class="sn-tr-tw" data-tr-tw="lz-retry" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span class="sn-tr-ico">
                      <span data-i="archive"></span>
                    </span>
                    <span class="sn-tr-lbl" data-tip-full="">历史归档（首次模拟失败可重试）</span>
                    <span class="sn-tr-badge">演示重试</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
              <i class="sn-sa-thumb"></i>
            </div>
            <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
              <i class="sn-sa-thumb"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
