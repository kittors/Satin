import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function TreeDemo2() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="treeVirtHost">
        <div className="sn-tree sn-tree-virt">
          <div className="sn-tree-bar">
            <div className="sn-ib sn-has-pre sn-has-post sn-tree-q">
              <span className="sn-pre">
                <span data-i="search"></span>
              </span>
              <input className="sn-input sn-sm" type="text" data-tr-q="" placeholder="搜索节点…" aria-label="搜索节点…" />
              <span className="sn-post">
                <button type="button" className="sn-clear" data-tr-clr="" aria-label="清空搜索">
                  <span data-i="x"></span>
                </button>
              </span>
            </div>
            <span className="sn-tree-stat" data-tr-stat="">共 10100 项</span>
            <div className="sn-tree-acts">
              <button type="button" className="sn-btn sn-ghost sn-sm sn-ibtn" data-tr-exp="1" data-tip="全部展开" aria-label="全部展开">
                <span data-i="chevrons-up-down"></span>
              </button>
            </div>
          </div>
          <div className="sn-tree-vp sn-sa sn-sa-in sn-ov-y" data-tr-host="" aria-label="万级虚拟树形无限列表" data-bar="auto" data-over="contain">
            <div className="sn-sa-vp sn-fy" role="tree" aria-label="万级虚拟树形无限列表">
              <div className="sn-tree-space">
                <div className="sn-tree-rows">
                  <div className="sn-tr sn-open" role="treeitem" data-id="vg-0" data-depth="0" aria-level={1} aria-expanded="true">
                    <button type="button" className="sn-tr-tw" data-tr-tw="vg-0" aria-label="折叠">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="folder"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">第 001 场 · 分镜序列</span>
                    <span className="sn-tr-meta">100 镜</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-0" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-0" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="image"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-01 · 实景定调.png</span>
                    <span className="sn-tr-meta">2.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-1" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-1" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="film"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-02 · 运镜预览.mov</span>
                    <span className="sn-tr-meta">5.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-2" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-2" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="file-text"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-03 · 台词脚本.md</span>
                    <span className="sn-tr-meta">8.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-3" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-3" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="image"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-04 · 实景定调.png</span>
                    <span className="sn-tr-meta">11.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-4" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-4" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="film"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-05 · 运镜预览.mov</span>
                    <span className="sn-tr-meta">14.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-5" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-5" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="file-text"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-06 · 台词脚本.md</span>
                    <span className="sn-tr-meta">17.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-6" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-6" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="image"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-07 · 实景定调.png</span>
                    <span className="sn-tr-meta">20.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-7" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-7" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="film"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-08 · 运镜预览.mov</span>
                    <span className="sn-tr-meta">23.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-8" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-8" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="file-text"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-09 · 台词脚本.md</span>
                    <span className="sn-tr-meta">26.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-9" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-9" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="image"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-10 · 实景定调.png</span>
                    <span className="sn-tr-meta">29.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-10" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-10" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="film"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-11 · 运镜预览.mov</span>
                    <span className="sn-tr-meta">32.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-11" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-11" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="file-text"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-12 · 台词脚本.md</span>
                    <span className="sn-tr-meta">35.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-12" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-12" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="image"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-13 · 实景定调.png</span>
                    <span className="sn-tr-meta">38.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="vn-0-13" data-depth="1" aria-level={2}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="vn-0-13" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-ico">
                      <span data-i="film"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">镜头 001-14 · 运镜预览.mov</span>
                    <span className="sn-tr-meta">41.4 MB</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sn-sa-bar sn-y" aria-hidden="true">
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
