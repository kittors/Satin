import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function TableDemo6() {
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
      <div class="sn-tbl-wrap">
        <div class="sn-tbl-sc">
          <table class="sn-tbl" aria-label="搜索结果">
            <thead>
              <tr>
                <th>项目</th>
                <th>负责人</th>
                <th>状态</th>
                <th class="sn-r">镜头</th>
                <th class="sn-r">时长</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sn-tbl-empty">
                <td colspan="5">
                  <div class="sn-tbl-none">
                    <span class="sn-art" data-i="search"></span>
                    <b>没有找到"雨夜"相关的项目</b>
                    <span>换个关键词，或者清除筛选再看看。</span>
                    <button class="sn-btn sn-secondary sn-sm">清除筛选</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
