"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./layout-1.css";

export default function LayoutDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
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
                <th>断点</th>
                <th>容器宽度</th>
                <th>栅格</th>
                <th>列间距</th>
                <th>主区边距</th>
                <th>侧栏</th>
                <th>二级栏</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>compact</td>
                <td className="sn-num">&lt; 720</td>
                <td className="sn-num">4 列</td>
                <td className="sn-num">16</td>
                <td className="sn-num">16</td>
                <td>收进抽屉，顶栏左边出菜单按钮</td>
                <td>只剩列表，点开详情盖上来</td>
              </tr>
              <tr>
                <td>regular</td>
                <td className="sn-num">720～1199</td>
                <td className="sn-num">8 列</td>
                <td className="sn-num">24</td>
                <td className="sn-num">24（1100 起 32）</td>
                <td>图标栏 64（1100 起展开 232）</td>
                <td className="sn-num">240</td>
              </tr>
              <tr>
                <td>wide</td>
                <td className="sn-num">≥ 1200</td>
                <td className="sn-num">12 列</td>
                <td className="sn-num">24</td>
                <td className="sn-num">32（1440 起 40）</td>
                <td className="sn-num">232</td>
                <td className="sn-num">240（1280 起 280）</td>
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
