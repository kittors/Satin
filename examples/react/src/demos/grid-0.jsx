"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";
import "satin-ui/css/grid.css";
import "satin-ui/css/data.css";

export default function GridDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 虚拟滚动、按需取块（筛选排序在后台线程）、固定列、拖列、改列宽行高、框选合并单元格、树形、编辑、拖行
      // 空容器：工具条、表头、表体都由 createDataGrid 填好；卸载时调 grid.destroy()（后台线程、放进 <head> 的样式一起撤）
      const grid = createDataGrid(root.querySelector("#grid"), { rows: 100000 });
      // 列和数据现在是内置的演示项目表；接自己的列和数据的接口还在整理，暂时没有公开
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-grid" id="gridDom">
        <div className="sn-g-bar">
          <span className="sn-ib sn-has-pre" style={{ width: "220px" }}>
            <span className="sn-pre" data-i="search"></span>
            <input className="sn-input sn-sm" data-g-q="" placeholder="搜索名称，比如 站台" aria-label="搜索名称" />
          </span>
          <div className="sn-seg sn-sm" data-seg="gtree">
            <span className="sn-thumb"></span>
            <button data-v="flat">平铺</button>
            <button data-v="tree">树形</button>
          </div>
          <button className="sn-btn sn-ghost sn-sm" data-g-expand="" hidden data-i="chevrons-up-down:before">全部展开</button>
          <div className="sn-seg sn-sm" data-seg="gmode">
            <span className="sn-thumb"></span>
            <button data-v="known">按需加载</button>
            <button data-v="append">滚到底再加载</button>
          </div>
          <div className="sn-seg sn-sm" data-seg="gsb">
            <span className="sn-thumb"></span>
            <button data-v="gutter">常驻滚动条</button>
            <button data-v="auto">自动隐藏</button>
          </div>
          <div className="sn-seg sn-sm" data-seg="glines">
            <span className="sn-thumb"></span>
            <button data-v="row">行线</button>
            <button data-v="grid">网格</button>
          </div>
          <span className="sn-g-filters" data-g-filters=""></span>
          <span className="sn-g-info" data-g-info=""></span>
        </div>
        <div className="sn-g-frame">
          <div className="sn-g-vp" tabIndex="0" role="grid" aria-label="数据表格，十万行">
            <div className="sn-g-head" role="row"></div>
            <div className="sn-g-body" role="rowgroup">
              <div className="sn-g-foot" hidden></div>
            </div>
          </div>
          <i className="sn-g-shade sn-l" aria-hidden="true"></i>
          <i className="sn-g-shade sn-r" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  );
}
