import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";
import "satin-ui/css/grid.css";
import "satin-ui/css/data.css";

export default function GridDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      // 虚拟滚动、按需取块（筛选排序在后台线程）、固定列、拖列、改列宽行高、框选合并单元格、树形、编辑、拖行
      // 空容器：工具条、表头、表体都由 createDataGrid 填好；卸载时调 grid.destroy()（后台线程、放进 <head> 的样式一起撤）
      const grid = createDataGrid(root.querySelector("#grid"), { rows: 100000 });
      // 列和数据现在是内置的演示项目表；接自己的列和数据的接口还在整理，暂时没有公开
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sn-grid" id="gridDom">
        <div class="sn-g-bar">
          <span class="sn-ib sn-has-pre" style="width:220px">
            <span class="sn-pre" data-i="search"></span>
            <input class="sn-input sn-sm" data-g-q="" placeholder="搜索名称，比如 站台" aria-label="搜索名称" />
          </span>
          <div class="sn-seg sn-sm" data-seg="gtree">
            <span class="sn-thumb"></span>
            <button data-v="flat">平铺</button>
            <button data-v="tree">树形</button>
          </div>
          <button class="sn-btn sn-ghost sn-sm" data-g-expand="" hidden data-i="chevrons-up-down:before">全部展开</button>
          <div class="sn-seg sn-sm" data-seg="gmode">
            <span class="sn-thumb"></span>
            <button data-v="known">按需加载</button>
            <button data-v="append">滚到底再加载</button>
          </div>
          <div class="sn-seg sn-sm" data-seg="gsb">
            <span class="sn-thumb"></span>
            <button data-v="gutter">常驻滚动条</button>
            <button data-v="auto">自动隐藏</button>
          </div>
          <div class="sn-seg sn-sm" data-seg="glines">
            <span class="sn-thumb"></span>
            <button data-v="row">行线</button>
            <button data-v="grid">网格</button>
          </div>
          <span class="sn-g-filters" data-g-filters=""></span>
          <span class="sn-g-info" data-g-info=""></span>
        </div>
        <div class="sn-g-frame">
          <div class="sn-g-vp" tabindex="0" role="grid" aria-label="数据表格，十万行">
            <div class="sn-g-head" role="row"></div>
            <div class="sn-g-body" role="rowgroup">
              <div class="sn-g-foot" hidden></div>
            </div>
          </div>
          <i class="sn-g-shade sn-l" aria-hidden="true"></i>
          <i class="sn-g-shade sn-r" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  );
}
