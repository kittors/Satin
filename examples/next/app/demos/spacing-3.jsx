"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./spacing-3.css";

export default function SpacingDemo3() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-sa" data-bar="auto" data-over="auto" style={{ "--sn-sa-bar": "5px", "--sn-sa-inset": "1px" }}>
        <div data-sa="x" className="sn-sa-vp sn-fx" style={{ overscrollBehavior: "auto" }}>
          <table className="sp-ctl">
            <thead>
              <tr>
                <th>尺寸</th>
                <th>高度</th>
                <th>左右内边距</th>
                <th>胶囊形</th>
                <th>图标和字</th>
                <th>用在哪里</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>sm</td>
                <td className="sn-num">28</td>
                <td className="sn-num">10</td>
                <td className="sn-num">12</td>
                <td className="sn-num">6</td>
                <td>表格里、工具条、紧凑的筛选</td>
              </tr>
              <tr>
                <td>md</td>
                <td className="sn-num">32</td>
                <td className="sn-num">12</td>
                <td className="sn-num">14</td>
                <td className="sn-num">8</td>
                <td>默认</td>
              </tr>
              <tr>
                <td>lg</td>
                <td className="sn-num">36～40</td>
                <td className="sn-num">16</td>
                <td className="sn-num">16</td>
                <td className="sn-num">8</td>
                <td>主要表单、主要按钮</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="sn-sa-bar sn-y" hidden aria-hidden="true">
          <i className="sn-sa-thumb"></i>
        </div>
        <div className="sn-sa-bar sn-x" hidden aria-hidden="true">
          <i className="sn-sa-thumb"></i>
        </div>
      </div>
    </div>
  );
}
