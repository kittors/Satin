import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function TableDemo6() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-tbl-wrap">
        <div className="sn-tbl-sc">
          <table className="sn-tbl" aria-label="搜索结果">
            <thead>
              <tr>
                <th>项目</th>
                <th>负责人</th>
                <th>状态</th>
                <th className="sn-r">镜头</th>
                <th className="sn-r">时长</th>
              </tr>
            </thead>
            <tbody>
              <tr className="sn-tbl-empty">
                <td colSpan={5}>
                  <div className="sn-tbl-none">
                    <span className="sn-art" data-i="search"></span>
                    <b>没有找到"雨夜"相关的项目</b>
                    <span>换个关键词，或者清除筛选再看看。</span>
                    <button className="sn-btn sn-secondary sn-sm">清除筛选</button>
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
