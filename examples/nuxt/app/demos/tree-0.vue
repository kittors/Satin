<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value);
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div id="treeBasicHost">
      <div class="sn-tree">
        <div class="sn-tree-bar">
          <div class="sn-ib sn-has-pre sn-has-post sn-tree-q">
            <span class="sn-pre">
              <span data-i="search"></span>
            </span>
            <input class="sn-input sn-sm" type="text" data-tr-q="" placeholder="搜索节点…" aria-label="搜索节点…">
            <span class="sn-post">
              <button type="button" class="sn-clear" data-tr-clr="" aria-label="清空搜索">
                <span data-i="x"></span>
              </button>
            </span>
          </div>
          <span class="sn-tree-stat" data-tr-stat="">共 15 项</span>
          <div class="sn-tree-acts">
            <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-tr-exp="1" data-tip="全部展开" aria-label="全部展开">
              <span data-i="chevrons-up-down"></span>
            </button>
          </div>
        </div>
        <div class="sn-tree-vp sn-sa sn-sa-in sn-ov-y" data-tr-host="" aria-label="项目资产目录树" data-checkable="1" data-bar="auto" data-over="contain">
          <div class="sn-sa-vp sn-fy" role="tree" aria-label="项目资产目录树" aria-multiselectable="true">
            <div class="sn-tree-space">
              <div class="sn-tree-rows">
                <div class="sn-tr sn-open" role="treeitem" data-id="proj" data-depth="0" aria-level="1" aria-expanded="true">
                  <button type="button" class="sn-tr-tw" data-tr-tw="proj" aria-label="折叠">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check sn-mixed" data-tr-chk="proj">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="clapperboard"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">雨夜车站 · 第三集</span>
                  <span class="sn-tr-meta">48 镜</span>
                </div>
                <div class="sn-tr sn-open" role="treeitem" data-id="script" data-depth="1" aria-level="2" aria-expanded="true">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw" data-tr-tw="script" aria-label="折叠">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check sn-mixed" data-tr-chk="script">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="book-open"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">剧本与分镜</span>
                </div>
                <div class="sn-tr" role="treeitem" data-id="s1" data-depth="2" aria-level="3">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw sn-tr-leaf" data-tr-tw="s1" aria-label="展开">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check sn-on" data-tr-chk="s1">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="file-text"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">第一场 · 站前广场.md</span>
                  <span class="sn-tr-meta">12 KB</span>
                </div>
                <div class="sn-tr" role="treeitem" data-id="s2" data-depth="2" aria-level="3">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw sn-tr-leaf" data-tr-tw="s2" aria-label="展开">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check" data-tr-chk="s2">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="file-text"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">第二场 · 候车厅对话.md</span>
                  <span class="sn-tr-meta">18 KB</span>
                </div>
                <div class="sn-tr" role="treeitem" data-id="s3" data-depth="2" aria-level="3">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw sn-tr-leaf" data-tr-tw="s3" aria-label="展开">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check" data-tr-chk="s3">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="file-text"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">第三场 · 末班车进站.md</span>
                  <span class="sn-tr-meta">9.4 KB</span>
                </div>
                <div class="sn-tr sn-open" role="treeitem" data-id="visual" data-depth="1" aria-level="2" aria-expanded="true">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw" data-tr-tw="visual" aria-label="折叠">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check sn-mixed" data-tr-chk="visual">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="image"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">视觉与镜头</span>
                </div>
                <div class="sn-tr" role="treeitem" data-id="v1" data-depth="2" aria-level="3">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw sn-tr-leaf" data-tr-tw="v1" aria-label="展开">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check sn-on" data-tr-chk="v1">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="image"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">5200K 冷雨定调帧.png</span>
                  <span class="sn-tr-meta">3.4 MB</span>
                </div>
                <div class="sn-tr" role="treeitem" data-id="v2" data-depth="2" aria-level="3">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw sn-tr-leaf" data-tr-tw="v2" aria-label="展开">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check" data-tr-chk="v2">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="image"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">3400K 候车厅暖光.png</span>
                  <span class="sn-tr-meta">2.8 MB</span>
                </div>
                <div class="sn-tr" role="treeitem" data-id="v3" data-depth="2" aria-level="3">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw sn-tr-leaf" data-tr-tw="v3" aria-label="展开">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check" data-tr-chk="v3">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="film"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">站台九盏灯运镜.mov</span>
                  <span class="sn-tr-meta">84 MB</span>
                </div>
                <div class="sn-tr" role="treeitem" data-id="audio" data-depth="1" aria-level="2" aria-expanded="false">
                  <span class="sn-tr-guides">
                    <span class="sn-tr-g sn-tr-g-line"></span>
                  </span>
                  <button type="button" class="sn-tr-tw" data-tr-tw="audio" aria-label="展开">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check" data-tr-chk="audio">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="audio-lines"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">声音设计</span>
                </div>
                <div class="sn-tr" role="treeitem" data-id="export" data-depth="0" aria-level="1" aria-expanded="false">
                  <button type="button" class="sn-tr-tw" data-tr-tw="export" aria-label="展开">
                    <span data-i="chevron-right"></span>
                  </button>
                  <span class="sn-tr-chk">
                    <span class="sn-check" data-tr-chk="export">
                      <span class="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span class="sn-bar"></span>
                      </span>
                    </span>
                  </span>
                  <span class="sn-tr-ico">
                    <span data-i="archive"></span>
                  </span>
                  <span class="sn-tr-lbl" data-tip-full="">成片交付</span>
                  <span class="sn-tr-meta">2 项</span>
                </div>
              </div>
            </div>
          </div>
          <div class="sn-sa-bar sn-y" aria-hidden="true">
            <i class="sn-sa-thumb"></i>
          </div>
          <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
            <i class="sn-sa-thumb"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
