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
          <span className="sn-art" data-i="folder-open"></span>
          <h4>还没有项目</h4>
          <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
          <div className="sn-acts">
            <button className="sn-btn sn-primary" data-i="plus:before">新建项目</button>
            <button className="sn-btn sn-secondary">导入原文</button>
          </div>
        </div>
        <div className="sn-empty-state">
          <span className="sn-art" data-i="search"></span>
          <h4>没有找到"雨夜"相关的镜头</h4>
          <p>换个关键词，或者清除筛选再看看。</p>
          <div className="sn-acts">
            <button className="sn-btn sn-secondary">清除筛选</button>
          </div>
        </div>
        <div className="sn-empty-state">
          <span className="sn-art" data-i="wifi-off"></span>
          <h4>加载失败</h4>
          <p>网络好像断了，恢复后会自动重试。</p>
          <div className="sn-acts">
            <button className="sn-btn sn-secondary" data-act="" data-retry="">重试</button>
          </div>
        </div>
      </div>
    </div>
  );
}
