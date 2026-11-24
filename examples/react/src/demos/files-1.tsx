import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function FilesDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="filesLazyHost">
        <div className="sn-fex" role="region" aria-label="文件管理">
          <div className="sn-fex-bar">
            <div className="sn-fex-nav">
              <button type="button" className="sn-btn sn-ghost sn-sm sn-ibtn sn-fex-up" data-fx-up="" disabled data-tip="返回上级" aria-label="返回上级">
                <span data-i="arrow-left"></span>
              </button>
              <nav className="sn-fex-crumbs" data-fx-crumbs="" aria-label="全部文件">
                <button type="button" className="sn-fex-crumb sn-fex-crumb-root" data-crumb-id="" data-crumb-idx="0" aria-current="page">
                  <span data-i="folder"></span>
                  <span className="sn-fex-crumb-txt" data-tip-full="">云端资产库</span>
                </button>
              </nav>
            </div>
            <div className="sn-fex-tools">
              <div className="sn-ib sn-has-pre sn-has-post sn-fex-search">
                <span className="sn-pre">
                  <span data-i="search"></span>
                </span>
                <input className="sn-input sn-sm" type="text" data-fx-q="" placeholder="搜索文件或文件夹…" aria-label="搜索文件或文件夹…" />
                <span className="sn-post">
                  <button type="button" className="sn-clear" data-fx-clr="" aria-label="清空搜索">
                    <span data-i="x"></span>
                  </button>
                </span>
              </div>
              <button type="button" className="sn-btn sn-secondary sn-sm" data-fx-new="" aria-haspopup="menu" aria-expanded="false">
                <span data-i="plus"></span>
                <span>新建</span>
              </button>
              <div className="sn-seg sn-sm sn-fex-view-seg" data-fx-seg="" aria-label="切换展示视图">
                <span className="sn-thumb"></span>
                <button type="button" data-v="card">
                  <span data-i="layout-grid"></span>
                  <span>卡片</span>
                </button>
                <button type="button" data-v="list">
                  <span data-i="list"></span>
                  <span>列表</span>
                </button>
                <button type="button" data-v="tree">
                  <span data-i="git-branch"></span>
                  <span>树形</span>
                </button>
              </div>
            </div>
          </div>
          <div className="sn-fex-body sn-sa sn-sa-in" data-fx-body="" data-bar="auto" data-over="contain">
            <div className="sn-sa-vp sn-fy">
              <div className="sn-fex-stage" data-fx-stage="">
                <div className="sn-fex-tbl-hd">
                  <div className="sn-fex-hd-main">
                    <button type="button" className="sn-check sn-fex-all-chk" data-fx-chk-all="" aria-pressed="false" aria-label="全选">
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </button>
                    <button type="button" className="sn-fex-th sn-on" data-fx-sort="name">名称<span data-i="arrow-up"></span></button>
                  </div>
                  <button type="button" className="sn-fex-th" data-fx-sort="kind">类型</button>
                  <button type="button" className="sn-fex-th sn-fex-num" data-fx-sort="size">大小</button>
                  <button type="button" className="sn-fex-th" data-fx-sort="updated">修改时间</button>
                </div>
                <div className="sn-fex-tree" role="tree">
                  <div className="sn-fex-tree-space">
                    <div className="sn-fex-tree-rows">
                      <div className="sn-fex-row" role="treeitem" data-fx-id="rm-farm" data-folder="1" data-depth="0" aria-expanded="false">
                        <div className="sn-fex-row-main">
                          <button type="button" className="sn-check sn-fex-row-chk" data-fx-chk="rm-farm" aria-pressed="false" aria-label="选择 云端渲染农场（点击展开懒加载 240 帧）">
                            <span className="sn-box">
                              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                              </svg>
                              <span className="sn-bar"></span>
                            </span>
                          </button>
                          <button type="button" className="sn-tr-tw" data-fx-tw="rm-farm" aria-label="展开">
                            <span data-i="chevron-right"></span>
                          </button>
                          <span className="sn-fex-row-ico">
                            <span data-i="folder"></span>
                          </span>
                          <span className="sn-fex-row-name" data-tip-full="">云端渲染农场（点击展开懒加载 240 帧）</span>
                          <span className="sn-fex-row-cnt">…</span>
                        </div>
                        <span className="sn-fex-cell">文件夹</span>
                        <span className="sn-fex-cell sn-fex-num">空</span>
                        <span className="sn-fex-cell">同步中</span>
                      </div>
                      <div className="sn-fex-row sn-open" role="treeitem" data-fx-id="rm-local" data-folder="1" data-depth="0" aria-expanded="true">
                        <div className="sn-fex-row-main">
                          <button type="button" className="sn-check sn-fex-row-chk" data-fx-chk="rm-local" aria-pressed="false" aria-label="选择 本地工作目录">
                            <span className="sn-box">
                              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                              </svg>
                              <span className="sn-bar"></span>
                            </span>
                          </button>
                          <button type="button" className="sn-tr-tw" data-fx-tw="rm-local" aria-label="折叠">
                            <span data-i="chevron-right"></span>
                          </button>
                          <span className="sn-fex-row-ico">
                            <span data-i="folder-open"></span>
                          </span>
                          <span className="sn-fex-row-name" data-tip-full="">本地工作目录</span>
                          <span className="sn-fex-row-cnt">2 项</span>
                        </div>
                        <span className="sn-fex-cell">文件夹</span>
                        <span className="sn-fex-cell sn-fex-num">2 项</span>
                        <span className="sn-fex-cell">今天</span>
                      </div>
                      <div className="sn-fex-row" role="treeitem" data-fx-id="rm-l1" data-folder="0" data-depth="1">
                        <div className="sn-fex-row-main">
                          <button type="button" className="sn-check sn-fex-row-chk" data-fx-chk="rm-l1" aria-pressed="false" aria-label="选择 定调参考.png">
                            <span className="sn-box">
                              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                              </svg>
                              <span className="sn-bar"></span>
                            </span>
                          </button>
                          <span className="sn-tr-guides">
                            <span className="sn-tr-g"></span>
                          </span>
                          <button type="button" className="sn-tr-tw sn-tr-leaf" data-fx-tw="rm-l1" aria-label="展开">
                            <span data-i="chevron-right"></span>
                          </button>
                          <span className="sn-fex-row-ico">
                            <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80" alt="" draggable="false" loading="lazy" decoding="async" />
                          </span>
                          <span className="sn-fex-row-name" data-tip-full="">定调参考.png</span>
                        </div>
                        <span className="sn-fex-cell">图片</span>
                        <span className="sn-fex-cell sn-fex-num">3.2 MB</span>
                        <span className="sn-fex-cell">今天</span>
                      </div>
                      <div className="sn-fex-row" role="treeitem" data-fx-id="rm-l2" data-folder="0" data-depth="1">
                        <div className="sn-fex-row-main">
                          <button type="button" className="sn-check sn-fex-row-chk" data-fx-chk="rm-l2" aria-pressed="false" aria-label="选择 镜头清单.pdf">
                            <span className="sn-box">
                              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                              </svg>
                              <span className="sn-bar"></span>
                            </span>
                          </button>
                          <span className="sn-tr-guides">
                            <span className="sn-tr-g"></span>
                          </span>
                          <button type="button" className="sn-tr-tw sn-tr-leaf" data-fx-tw="rm-l2" aria-label="展开">
                            <span data-i="chevron-right"></span>
                          </button>
                          <span className="sn-fex-row-ico sn-fex-t-pdf">PDF</span>
                          <span className="sn-fex-row-name" data-tip-full="">镜头清单.pdf</span>
                        </div>
                        <span className="sn-fex-cell">PDF 文档</span>
                        <span className="sn-fex-cell sn-fex-num">1.4 MB</span>
                        <span className="sn-fex-cell">今天</span>
                      </div>
                    </div>
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
          <div className="sn-fex-batch" data-fx-batch="" role="toolbar" aria-label="文件管理">
            <span className="sn-fex-batch-cnt">
              <span className="sn-fex-batch-num" data-fx-bnum="">0</span>
              <span data-fx-btxt="">项已选</span>
            </span>
            <button type="button" className="sn-fex-batch-btn" data-fx-bact="all">
              <span data-i="check"></span>
              <span data-fx-ball-lbl="">全选</span>
            </button>
            <button type="button" className="sn-fex-batch-btn" data-fx-bact="move" aria-haspopup="menu" aria-expanded="false">
              <span data-i="folder"></span>
              <span>移动</span>
            </button>
            <button type="button" className="sn-fex-batch-btn" data-fx-bact="dup">
              <span data-i="copy"></span>
              <span>复制</span>
            </button>
            <button type="button" className="sn-fex-batch-btn sn-danger" data-fx-bact="del">
              <span data-i="trash-2"></span>
              <span>删除</span>
            </button>
            <button type="button" className="sn-fex-batch-btn sn-fex-batch-x" data-fx-bact="clear" aria-label="取消选择">
              <span data-i="x"></span>
            </button>
          </div>
          <div className="sn-fex-foot">
            <span data-fx-stat="">共 4 项</span>
            <span className="sn-fex-foot-hint" data-fx-hint="">拖入文件夹移动 · 框选或勾选多选 · 右键更多操作</span>
          </div>
        </div>
      </div>
    </div>
  );
}
