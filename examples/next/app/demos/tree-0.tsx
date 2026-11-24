"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function TreeDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="treeBasicHost">
        <div className="sn-tree">
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
            <span className="sn-tree-stat" data-tr-stat="">共 15 项</span>
            <div className="sn-tree-acts">
              <button type="button" className="sn-btn sn-ghost sn-sm sn-ibtn" data-tr-exp="1" data-tip="全部展开" aria-label="全部展开">
                <span data-i="chevrons-up-down"></span>
              </button>
            </div>
          </div>
          <div className="sn-tree-vp sn-sa sn-sa-in sn-ov-y" data-tr-host="" aria-label="项目资产目录树" data-checkable="1" data-bar="auto" data-over="contain">
            <div className="sn-sa-vp sn-fy" role="tree" aria-label="项目资产目录树" aria-multiselectable="true">
              <div className="sn-tree-space">
                <div className="sn-tree-rows">
                  <div className="sn-tr sn-open" role="treeitem" data-id="proj" data-depth="0" aria-level={1} aria-expanded="true">
                    <button type="button" className="sn-tr-tw" data-tr-tw="proj" aria-label="折叠">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check sn-mixed" data-tr-chk="proj">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="clapperboard"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">雨夜车站 · 第三集</span>
                    <span className="sn-tr-meta">48 镜</span>
                  </div>
                  <div className="sn-tr sn-open" role="treeitem" data-id="script" data-depth="1" aria-level={2} aria-expanded="true">
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw" data-tr-tw="script" aria-label="折叠">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check sn-mixed" data-tr-chk="script">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="book-open"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">剧本与分镜</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="s1" data-depth="2" aria-level={3}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="s1" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check sn-on" data-tr-chk="s1">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="file-text"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">第一场 · 站前广场.md</span>
                    <span className="sn-tr-meta">12 KB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="s2" data-depth="2" aria-level={3}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="s2" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check" data-tr-chk="s2">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="file-text"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">第二场 · 候车厅对话.md</span>
                    <span className="sn-tr-meta">18 KB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="s3" data-depth="2" aria-level={3}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="s3" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check" data-tr-chk="s3">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="file-text"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">第三场 · 末班车进站.md</span>
                    <span className="sn-tr-meta">9.4 KB</span>
                  </div>
                  <div className="sn-tr sn-open" role="treeitem" data-id="visual" data-depth="1" aria-level={2} aria-expanded="true">
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw" data-tr-tw="visual" aria-label="折叠">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check sn-mixed" data-tr-chk="visual">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="image"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">视觉与镜头</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="v1" data-depth="2" aria-level={3}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="v1" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check sn-on" data-tr-chk="v1">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="image"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">5200K 冷雨定调帧.png</span>
                    <span className="sn-tr-meta">3.4 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="v2" data-depth="2" aria-level={3}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="v2" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check" data-tr-chk="v2">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="image"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">3400K 候车厅暖光.png</span>
                    <span className="sn-tr-meta">2.8 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="v3" data-depth="2" aria-level={3}>
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw sn-tr-leaf" data-tr-tw="v3" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check" data-tr-chk="v3">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="film"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">站台九盏灯运镜.mov</span>
                    <span className="sn-tr-meta">84 MB</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="audio" data-depth="1" aria-level={2} aria-expanded="false">
                    <span className="sn-tr-guides">
                      <span className="sn-tr-g sn-tr-g-line"></span>
                    </span>
                    <button type="button" className="sn-tr-tw" data-tr-tw="audio" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check" data-tr-chk="audio">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="audio-lines"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">声音设计</span>
                  </div>
                  <div className="sn-tr" role="treeitem" data-id="export" data-depth="0" aria-level={1} aria-expanded="false">
                    <button type="button" className="sn-tr-tw" data-tr-tw="export" aria-label="展开">
                      <span data-i="chevron-right"></span>
                    </button>
                    <span className="sn-tr-chk">
                      <span className="sn-check" data-tr-chk="export">
                        <span className="sn-box">
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                          </svg>
                          <span className="sn-bar"></span>
                        </span>
                      </span>
                    </span>
                    <span className="sn-tr-ico">
                      <span data-i="archive"></span>
                    </span>
                    <span className="sn-tr-lbl" data-tip-full="">成片交付</span>
                    <span className="sn-tr-meta">2 项</span>
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
