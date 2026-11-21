"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createCanvasGrid } from "satin-ui/canvas-grid";
import "satin-ui/css/grid.css";
import "satin-ui/css/data.css";

export default function CgridDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 整张表画在一块画布上：百万行照样流畅；交互和 DOM 版一致
      const grid = createCanvasGrid(root.querySelector("#grid"), { rows: 1000000 }); // 卸载时 grid.destroy()
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-grid cgrid" id="gridCanvas">
        <div className="sn-g-bar">
          <span className="sn-ib sn-has-pre" style={{ width: "220px" }}>
            <span className="sn-pre" data-i="search"></span>
            <input className="sn-input sn-sm" data-g-q="" placeholder="搜索名称，比如 书店 9" aria-label="搜索名称" />
          </span>
          <div className="sn-seg sn-sm" data-seg="cgtree">
            <span className="sn-thumb"></span>
            <button data-v="flat">平铺</button>
            <button data-v="tree">树形</button>
          </div>
          <button className="sn-btn sn-ghost sn-sm" data-g-expand="" hidden data-i="chevrons-up-down:before">全部展开</button>
          <div className="sn-seg sn-sm" data-seg="cgmode">
            <span className="sn-thumb"></span>
            <button data-v="known">按需加载</button>
            <button data-v="append">滚到底再加载</button>
          </div>
          <div className="sn-seg sn-sm" data-seg="cgsb">
            <span className="sn-thumb"></span>
            <button data-v="gutter">常驻滚动条</button>
            <button data-v="auto">自动隐藏</button>
          </div>
          <div className="sn-seg sn-sm" data-seg="cglines">
            <span className="sn-thumb"></span>
            <button data-v="row">行线</button>
            <button data-v="grid">网格</button>
          </div>
          <span className="sn-g-filters" data-g-filters=""></span>
          <span className="sn-g-info" data-g-info=""></span>
        </div>
        <div className="sn-g-frame">
          <div className="sn-g-vp" tabIndex="0" role="grid" aria-label="数据表格，一百万行，画布绘制">
            <div className="sn-g-head" role="row"></div>
            <canvas className="sn-cg-cv" aria-hidden="true"></canvas>
            <div className="sn-cg-sizer"></div>
          </div>
          <i className="sn-g-shade sn-l" aria-hidden="true"></i>
          <i className="sn-g-shade sn-r" aria-hidden="true"></i>
          <div className="sn-cg-sr" aria-live="polite"></div>
        </div>
      </div>
    </div>
  );
}
