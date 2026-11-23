import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function EmptyDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-empty-grid">
        <div className="sn-empty-state">
          <sn-empty-art name="projects"></sn-empty-art>
          <h4>还没有项目</h4>
          <p>新建或导入原文即可开始。</p>
          <div className="sn-acts">
            <button className="sn-btn sn-primary" data-i="plus:before">新建项目</button>
            <button className="sn-btn sn-secondary">导入原文</button>
          </div>
        </div>
        <div className="sn-empty-state">
          <sn-empty-art name="search"></sn-empty-art>
          <h4>未找到“雨夜”相关镜头</h4>
          <p>换个关键词，或清除当前筛选。</p>
          <div className="sn-acts">
            <button className="sn-btn sn-secondary">清除筛选</button>
          </div>
        </div>
        <div className="sn-empty-state">
          <sn-empty-art name="error"></sn-empty-art>
          <h4>暂时无法加载</h4>
          <p>连接已中断，网络恢复后自动重试。</p>
          <div className="sn-acts">
            <button className="sn-btn sn-secondary" data-act="" data-retry="">重试</button>
          </div>
        </div>
      </div>
    </div>
  );
}
