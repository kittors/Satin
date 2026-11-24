<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div id="filesDemoHost">
    <div class="sn-fex" role="region" aria-label="项目素材文件管理器">
      <div class="sn-fex-bar">
        <div class="sn-fex-nav">
          <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn sn-fex-up" data-fx-up="" disabled data-tip="返回上级" aria-label="返回上级">
            <span data-i="arrow-left"></span>
          </button>
          <nav class="sn-fex-crumbs" data-fx-crumbs="" aria-label="全部文件">
            <button type="button" class="sn-fex-crumb sn-fex-crumb-root" data-crumb-id="" data-crumb-idx="0" aria-current="page">
              <span data-i="folder"></span>
              <span class="sn-fex-crumb-txt" data-tip-full="">雨夜车站</span>
            </button>
          </nav>
        </div>
        <div class="sn-fex-tools">
          <div class="sn-ib sn-has-pre sn-has-post sn-fex-search">
            <span class="sn-pre">
              <span data-i="search"></span>
            </span>
            <input class="sn-input sn-sm" type="text" data-fx-q="" placeholder="搜索文件或文件夹…" aria-label="搜索文件或文件夹…">
            <span class="sn-post">
              <button type="button" class="sn-clear" data-fx-clr="" aria-label="清空搜索">
                <span data-i="x"></span>
              </button>
            </span>
          </div>
          <button type="button" class="sn-btn sn-secondary sn-sm" data-fx-new="" aria-haspopup="menu" aria-expanded="false">
            <span data-i="plus"></span>
            <span>新建</span>
          </button>
          <div class="sn-seg sn-sm sn-fex-view-seg" data-fx-seg="" aria-label="切换展示视图">
            <span class="sn-thumb"></span>
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
      <div class="sn-fex-body sn-sa sn-sa-in" data-fx-body="" data-bar="auto" data-over="contain">
        <div class="sn-sa-vp sn-fy">
          <div class="sn-fex-stage" data-fx-stage="">
            <div class="sn-fex-grid">
              <div class="sn-fex-tile" data-fx-id="f-inbox" data-folder="1" data-kind="folder">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="f-inbox" aria-pressed="false" aria-label="选择 待整理素材">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fdr" data-count="0">
                  <div class="sn-fdr-back"></div>
                  <div class="sn-fdr-well"></div>
                  <div class="sn-fdr-sheets" data-n="0"></div>
                  <div class="sn-fdr-front"></div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">待整理素材</span>
                  <span class="sn-fex-sub">空</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="f-shots" data-folder="1" data-kind="folder">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="f-shots" aria-pressed="false" aria-label="选择 镜头分镜">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fdr sn-fdr-tinted" data-count="3">
                  <div class="sn-fdr-back"></div>
                  <div class="sn-fdr-well"></div>
                  <div class="sn-fdr-sheets" data-n="3">
                    <div class="sn-fdr-sheet" data-idx="0" data-child-kind="image">
                      <div class="sn-fdr-sh-img">
                        <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&amp;fit=crop&amp;w=320&amp;h=220&amp;q=80" alt="" draggable="false" loading="lazy" decoding="async">
                      </div>
                    </div>
                    <div class="sn-fdr-sheet" data-idx="1" data-child-kind="video">
                      <div class="sn-fdr-sh-img">
                        <img src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&amp;fit=crop&amp;w=320&amp;h=220&amp;q=80" alt="" draggable="false" loading="lazy" decoding="async">
                        <span class="sn-fdr-sh-play">
                          <span data-i="play"></span>
                        </span>
                      </div>
                    </div>
                    <div class="sn-fdr-sheet" data-idx="2" data-child-kind="pdf">
                      <span class="sn-fdr-sh-bar sn-fex-t-pdf"></span>
                      <div class="sn-fdr-sh-txt">第三集实景布光与冷暖色温控制手册。室外 5200K 冷雨与候车厅 3400K 顶灯自然衔接。</div>
                    </div>
                  </div>
                  <div class="sn-fdr-front">
                    <span class="sn-fdr-cnt">3</span>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">镜头分镜</span>
                  <span class="sn-fex-sub">3 项</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="f-code" data-folder="1" data-kind="folder">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="f-code" aria-pressed="false" aria-label="选择 前端源码">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fdr sn-fdr-tinted" data-count="2">
                  <div class="sn-fdr-back"></div>
                  <div class="sn-fdr-well"></div>
                  <div class="sn-fdr-sheets" data-n="2">
                    <div class="sn-fdr-sheet" data-idx="0" data-child-kind="vue">
                      <span class="sn-fdr-sh-bar sn-fex-t-vue"></span>
                      <div class="sn-fdr-sh-txt sn-fdr-sh-code">&lt;template&gt; &lt;FileGrid :items /&gt; &lt;/template&gt; &lt;script setup&gt; const v = ref(1) &lt;/script&gt;</div>
                    </div>
                    <div class="sn-fdr-sheet" data-idx="1" data-child-kind="tsx">
                      <span class="sn-fdr-sh-bar sn-fex-t-tsx"></span>
                      <div class="sn-fdr-sh-txt sn-fdr-sh-code">export function App() &#123; return ( &lt;Tree virtual /&gt; ); &#125;</div>
                    </div>
                  </div>
                  <div class="sn-fdr-front">
                    <span class="sn-fdr-cnt">2</span>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">前端源码</span>
                  <span class="sn-fex-sub">2 项</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="f-docs" data-folder="1" data-kind="folder">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="f-docs" aria-pressed="false" aria-label="选择 项目文档">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fdr sn-fdr-tinted" data-count="3">
                  <div class="sn-fdr-back"></div>
                  <div class="sn-fdr-well"></div>
                  <div class="sn-fdr-sheets" data-n="3">
                    <div class="sn-fdr-sheet" data-idx="0" data-child-kind="word">
                      <span class="sn-fdr-sh-bar sn-fex-t-word"></span>
                      <div class="sn-fdr-sh-txt">一、拍摄日程与机位排期 站前广场夜戏需在 21:00 前完成灯光预置，保证雨幕反光层次。</div>
                    </div>
                    <div class="sn-fdr-sheet" data-idx="1" data-child-kind="ppt">
                      <span class="sn-fdr-sh-bar sn-fex-t-ppt"></span>
                      <div class="sn-fcard-ppt-body">
                        <div class="sn-fcard-ppt-chart">
                          <i></i>
                          <i></i>
                          <i></i>
                        </div>
                        <div class="sn-fcard-ppt-lines">
                          <i></i>
                          <i></i>
                        </div>
                      </div>
                    </div>
                    <div class="sn-fdr-sheet" data-idx="2" data-child-kind="audio">
                      <div class="sn-fdr-sh-wave">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                    </div>
                  </div>
                  <div class="sn-fdr-front">
                    <span class="sn-fdr-cnt">3</span>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">项目文档</span>
                  <span class="sn-fex-sub">3 项</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="d-txt" data-folder="0" data-kind="txt">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="d-txt" aria-pressed="false" aria-label="选择 场记备忘.txt">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fcard-stage">
                  <div class="sn-fcard" data-kind="txt">
                    <div class="sn-fcard-excerpt">镜 04 慢摇过七盏站台灯，车灯切入画面后停 12 帧叠化雨声进入候车厅。</div>
                    <div class="sn-fcard-ft">
                      <span class="sn-fcard-ext">TXT</span>
                    </div>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">场记备忘.txt</span>
                  <span class="sn-fex-sub">3.8 KB</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="d-cut" data-folder="0" data-kind="video">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="d-cut" aria-pressed="false" aria-label="选择 第三集粗剪-v3.mov">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fcard-stage">
                  <div class="sn-fcard sn-fcard-frame" data-kind="video">
                    <img src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&amp;fit=crop&amp;w=320&amp;h=220&amp;q=80" alt="" draggable="false" loading="lazy" decoding="async">
                    <span class="sn-fcard-play">
                      <span data-i="play"></span>
                    </span>
                    <span class="sn-fcard-dur">02:48</span>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">第三集粗剪-v3.mov</span>
                  <span class="sn-fex-sub">186 MB</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="d-word" data-folder="0" data-kind="word">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="d-word" aria-pressed="false" aria-label="选择 第三集拍摄计划.docx">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fcard-stage">
                  <div class="sn-fcard" data-kind="word">
                    <span class="sn-fcard-headbar sn-fex-t-word"></span>
                    <div class="sn-fcard-excerpt">一、夜戏机位排期 21:00 前完成候车厅长椅反光布设与雨幕测试。</div>
                    <div class="sn-fcard-ft">
                      <span class="sn-fcard-ext sn-fex-t-word">DOCX</span>
                    </div>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">第三集拍摄计划.docx</span>
                  <span class="sn-fex-sub">186 KB</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="d-still" data-folder="0" data-kind="image">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="d-still" aria-pressed="false" aria-label="选择 候车厅暖光.png">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fcard-stage">
                  <div class="sn-fcard sn-fcard-frame" data-kind="image">
                    <img src="https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&amp;fit=crop&amp;w=320&amp;h=220&amp;q=80" alt="" draggable="false" loading="lazy" decoding="async">
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">候车厅暖光.png</span>
                  <span class="sn-fex-sub">4.6 MB</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="d-ppt" data-folder="0" data-kind="ppt">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="d-ppt" aria-pressed="false" aria-label="选择 视觉定调汇报.pptx">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fcard-stage">
                  <div class="sn-fcard sn-fcard-slide" data-kind="ppt">
                    <div class="sn-fcard-ppt-top">
                      <span class="sn-fcard-ppt-title">视觉定调汇报</span>
                    </div>
                    <div class="sn-fcard-ppt-body">
                      <div class="sn-fcard-ppt-chart">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                      <div class="sn-fcard-ppt-lines">
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                    </div>
                    <div class="sn-fcard-ft">
                      <span class="sn-fcard-ext sn-fex-t-ppt">PPTX</span>
                      <span class="sn-fcard-pg">14P</span>
                    </div>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">视觉定调汇报.pptx</span>
                  <span class="sn-fex-sub">12.6 MB</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="d-pdf" data-folder="0" data-kind="pdf">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="d-pdf" aria-pressed="false" aria-label="选择 雨夜布光手册.pdf">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fcard-stage">
                  <div class="sn-fcard" data-kind="pdf">
                    <span class="sn-fcard-headbar sn-fex-t-pdf"></span>
                    <div class="sn-fcard-excerpt">5200K 冷雨积水反射控制与 3400K 暖色顶灯过渡比例规范。</div>
                    <div class="sn-fcard-ft">
                      <span class="sn-fcard-ext sn-fex-t-pdf">PDF</span>
                      <span class="sn-fcard-pg">16P</span>
                    </div>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">雨夜布光手册.pdf</span>
                  <span class="sn-fex-sub">4.2 MB</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="d-vue" data-folder="0" data-kind="vue">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="d-vue" aria-pressed="false" aria-label="选择 FileCard.vue">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fcard-stage">
                  <div class="sn-fcard" data-kind="vue">
                    <span class="sn-fcard-headbar sn-fex-t-vue"></span>
                    <div class="sn-fcard-excerpt sn-fcard-code">&lt;template&gt; &lt;div class="card"&gt; &lt;slot /&gt; &lt;/div&gt; &lt;/template&gt;</div>
                    <div class="sn-fcard-ft">
                      <span class="sn-fcard-ext sn-fex-t-vue">VUE</span>
                    </div>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">FileCard.vue</span>
                  <span class="sn-fex-sub">4.4 KB</span>
                </div>
              </div>
              <div class="sn-fex-tile" data-fx-id="d-tsx" data-folder="0" data-kind="tsx">
                <button type="button" class="sn-check sn-fex-chk" data-fx-chk="d-tsx" aria-pressed="false" aria-label="选择 VirtualTree.tsx">
                  <span class="sn-box">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                    </svg>
                    <span class="sn-bar"></span>
                  </span>
                </button>
                <div class="sn-fcard-stage">
                  <div class="sn-fcard" data-kind="tsx">
                    <span class="sn-fcard-headbar sn-fex-t-tsx"></span>
                    <div class="sn-fcard-excerpt sn-fcard-code">export function Tree() &#123; return &lt;List virtual /&gt;; &#125;</div>
                    <div class="sn-fcard-ft">
                      <span class="sn-fcard-ext sn-fex-t-tsx">TSX</span>
                    </div>
                  </div>
                </div>
                <div class="sn-fex-meta-box">
                  <span class="sn-fex-name" data-tip-full="">VirtualTree.tsx</span>
                  <span class="sn-fex-sub">6.1 KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
          <i class="sn-sa-thumb"></i>
        </div>
        <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
          <i class="sn-sa-thumb"></i>
        </div>
      </div>
      <div class="sn-fex-batch" data-fx-batch="" role="toolbar" aria-label="文件管理">
        <span class="sn-fex-batch-cnt">
          <span class="sn-fex-batch-num" data-fx-bnum="">0</span>
          <span data-fx-btxt="">项已选</span>
        </span>
        <button type="button" class="sn-fex-batch-btn" data-fx-bact="all">
          <span data-i="check"></span>
          <span data-fx-ball-lbl="">全选</span>
        </button>
        <button type="button" class="sn-fex-batch-btn" data-fx-bact="move" aria-haspopup="menu" aria-expanded="false">
          <span data-i="folder"></span>
          <span>移动</span>
        </button>
        <button type="button" class="sn-fex-batch-btn" data-fx-bact="dup">
          <span data-i="copy"></span>
          <span>复制</span>
        </button>
        <button type="button" class="sn-fex-batch-btn sn-danger" data-fx-bact="del">
          <span data-i="trash-2"></span>
          <span>删除</span>
        </button>
        <button type="button" class="sn-fex-batch-btn sn-fex-batch-x" data-fx-bact="clear" aria-label="取消选择">
          <span data-i="x"></span>
        </button>
      </div>
      <div class="sn-fex-foot">
        <span data-fx-stat="">共 12 项</span>
        <span class="sn-fex-foot-hint" data-fx-hint="">拖入文件夹移动 · 框选或勾选多选 · 右键更多操作</span>
      </div>
    </div>
  </div>
</div>
