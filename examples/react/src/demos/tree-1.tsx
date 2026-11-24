import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function TreeDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="treeLazyHost">
        <div className="sn-tree">
          <div className="sn-tree-vp sn-sa sn-sa-in" data-tr-host="" aria-label="远程异步懒加载目录树" data-bar="auto" data-over="contain">
            <div className="sn-sa-vp sn-fy" role="tree" aria-label="远程异步懒加载目录树">
              <div className="sn-tree-space">
                <div className="sn-tree-rows">
                  <div className="sn-tr" role="treeitem" data-id="lz-ep1" data-depth="0" aria-level={1} aria-expanded="false">
                    <button type="button" className="sn-tr-tw" data-tr-tw="lz-ep1" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="folder"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">第一集 · 远程素材库</span>
                    <span className="sn-tr-badge">远程</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="lz-ep2" data-depth="0" aria-level={1} aria-expanded="false">
                    <button type="button" className="sn-tr-tw" data-tr-tw="lz-ep2" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="folder"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">第二集 · 分镜渲染帧</span>
                    <span className="sn-tr-badge">远程</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="lz-retry" data-depth="0" aria-level={1} aria-expanded="false">
                    <button type="button" className="sn-tr-tw" data-tr-tw="lz-retry" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="archive"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">历史归档（首次模拟失败可重试）</span>
                    <span className="sn-tr-badge">演示重试</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sn-sa-bar sn-y" hidden aria-hidden="true">
              <i className="sn-sa-thumb"></i>
            </div>
            <div className="sn-sa-bar sn-x" hidden aria-hidden="true">
              <i className="sn-sa-thumb"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
