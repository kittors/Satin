import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-chat-1",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-chat sn-chat-new" id="chatNew">
        <div class="sn-chat-hd">
          <div class="sn-tx">
            <b>新对话</b>
            <span class="sn-sub">
              <span data-chat-status=""></span>
            </span>
          </div>
        </div>
        <div class="sn-chat-body">
          <div class="sn-sa" data-bar="auto" data-over="auto">
            <div class="sn-chat-vp sn-sa-vp sn-fy sn-no-b">
              <div class="sn-chat-canvas">
                <div class="sn-chat-ph sn-top"></div>
                <div class="sn-chat-ph sn-bot"></div>
                <div class="sn-ci sn-ci-more"></div>
              </div>
            </div>
            <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
              <i class="sn-sa-thumb"></i>
            </div>
            <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
              <i class="sn-sa-thumb"></i>
            </div>
          </div>
          <button class="sn-chat-jump" data-chat-jump="" aria-label="跳到最新">
            <span data-i="arrow-down"></span>
            <span class="sn-badge" hidden>0</span>
          </button>
          <div class="sn-chat-empty sn-enter-wait" data-chat-empty="">
            <span class="sn-chat-empty-ic" aria-hidden="true">
              <span data-i="clapperboard"></span>
            </span>
            <div class="sn-chat-empty-t" role="heading" aria-level="2">今天拍哪一段？</div>
            <div class="sn-chat-empty-sub">上次停在候车厅</div>
            <div class="sn-chat-sugs">
              <button type="button" class="sn-chat-sug">把第三集拆成镜头</button>
              <button type="button" class="sn-chat-sug">开头的雨夜再冷一点</button>
              <button type="button" class="sn-chat-sug">给结尾配一段钢琴</button>
            </div>
          </div>
          <nav class="sn-rail" data-side="left" aria-label="对话进度定位">
            <div class="sn-rail-ticks"></div>
            <div class="sn-rail-tip" aria-hidden="true">
              <span class="sn-rail-tip-txt"></span>
              <span class="sn-rail-tip-meta sn-num"></span>
            </div>
          </nav>
        </div>
        <div class="sn-chat-foot">
          <div class="sn-box-in sn-composer sn-cm-new sn-has-ctx" data-composer="" data-external="" data-max="500" data-max-lines="5">
            <div class="sn-cm-ctx" role="group" aria-label="上下文">
              <button type="button" class="sn-cm-ctx-i" data-ctx="0">
                <span data-i="folder"></span>
                <span class="sn-cm-lbl">雨夜车站</span>
              </button>
              <div class="sn-select sn-inline-menu sn-up sn-cm-pick" data-pick="ctx" data-ctx="1">
                <button type="button" class="sn-cm-ctx-i" data-menubtn="" aria-haspopup="menu">
                  <span data-i="monitor"></span>
                  <span class="sn-cm-lbl">本地</span>
                  <span class="sn-cm-caret" aria-hidden="true">
                    <span data-i="chevron-down"></span>
                  </span>
                </button>
                <div class="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                  <div class="sn-sa-vp sn-fy">
                    <div class="sn-item sn-sel" role="menuitemradio" aria-checked="true" data-v="local">
                      <span class="sn-tx">本地</span>
                      <span class="sn-chk">
                        <span data-i="check"></span>
                      </span>
                    </div>
                    <div class="sn-item" role="menuitemradio" aria-checked="false" data-v="cloud">
                      <span class="sn-tx">云端</span>
                      <span class="sn-chk">
                        <span data-i="check"></span>
                      </span>
                    </div>
                  </div>
                  <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
                    <i class="sn-sa-thumb"></i>
                  </div>
                  <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
                    <i class="sn-sa-thumb"></i>
                  </div>
                </div>
              </div>
              <div class="sn-select sn-inline-menu sn-up sn-cm-pick" data-pick="ctx" data-ctx="2">
                <button type="button" class="sn-cm-ctx-i" data-menubtn="" aria-haspopup="menu">
                  <span data-i="git-branch"></span>
                  <span class="sn-cm-lbl">第三集</span>
                  <span class="sn-cm-caret" aria-hidden="true">
                    <span data-i="chevron-down"></span>
                  </span>
                </button>
                <div class="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                  <div class="sn-sa-vp sn-fy">
                    <div class="sn-item sn-sel" role="menuitemradio" aria-checked="true" data-v="ep3">
                      <span class="sn-tx">第三集</span>
                      <span class="sn-chk">
                        <span data-i="check"></span>
                      </span>
                    </div>
                    <div class="sn-item" role="menuitemradio" aria-checked="false" data-v="ep4">
                      <span class="sn-tx">第四集</span>
                      <span class="sn-chk">
                        <span data-i="check"></span>
                      </span>
                    </div>
                    <div class="sn-item" role="menuitemradio" aria-checked="false" data-v="final">
                      <span class="sn-tx">定稿</span>
                      <span class="sn-chk">
                        <span data-i="check"></span>
                      </span>
                    </div>
                  </div>
                  <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
                    <i class="sn-sa-thumb"></i>
                  </div>
                  <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
                    <i class="sn-sa-thumb"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="sn-cm-card">
              <div class="sn-cm-resize" role="separator" aria-orientation="horizontal" aria-label="拖动调整高度，双击恢复自动" data-tip="拖动调整高度，双击恢复自动">
                <i></i>
              </div>
              <div class="sn-sa" data-bar="none" data-over="bounce">
                <div class="sn-cm-files sn-sa-vp sn-fx"></div>
                <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
                  <i class="sn-sa-thumb"></i>
                </div>
                <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
                  <i class="sn-sa-thumb"></i>
                </div>
              </div>
              <div class="sn-cm-note" role="status">
                <div>
                  <p>
                    <span data-i="circle-alert"></span>
                    <span class="sn-tx"></span>
                  </p>
                </div>
              </div>
              <div class="sn-sa" data-bar="auto" data-over="contain">
                <textarea rows="1" placeholder="随心输入" class="sn-sa-vp"></textarea>
                <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
                  <i class="sn-sa-thumb"></i>
                </div>
                <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
                  <i class="sn-sa-thumb"></i>
                </div>
              </div>
              <div class="sn-cm-bar">
                <div class="sn-select sn-inline-menu sn-up">
                  <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn sn-cm-add" data-menubtn="" data-cm-attach="" data-tip="添加图片、视频、音频或文档" aria-label="添加附件">
                    <span data-i="plus"></span>
                  </button>
                  <div class="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                    <div class="sn-sa-vp sn-fy">
                      <div class="sn-item" data-add="img"><span data-i="image"></span>图片<span class="sn-key">JPG · PNG</span></div>
                      <div class="sn-item" data-add="vid"><span data-i="film"></span>视频<span class="sn-key">MP4 · MOV</span></div>
                      <div class="sn-item" data-add="aud"><span data-i="audio-lines"></span>音频<span class="sn-key">MP3 · WAV</span></div>
                      <div class="sn-item" data-add="doc"><span data-i="file-text"></span>文档<span class="sn-key">PDF · DOCX</span></div>
                    </div>
                    <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
                      <i class="sn-sa-thumb"></i>
                    </div>
                    <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
                      <i class="sn-sa-thumb"></i>
                    </div>
                  </div>
                </div>
                <div class="sn-select sn-inline-menu sn-up sn-cm-pick" data-pick="mode">
                  <button type="button" class="sn-tag sn-cm-mode sn-warn" data-menubtn="" aria-haspopup="menu">
                    <i></i>
                    <span class="sn-cm-lbl">完全访问</span>
                    <span class="sn-cm-caret" aria-hidden="true">
                      <span data-i="chevron-down"></span>
                    </span>
                  </button>
                  <div class="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                    <div class="sn-sa-vp sn-fy">
                      <div class="sn-item" role="menuitemradio" aria-checked="false" data-v="read">
                        <i class="sn-cm-dot sn-ok"></i>
                        <span class="sn-tx">只读</span>
                        <span class="sn-chk">
                          <span data-i="check"></span>
                        </span>
                      </div>
                      <div class="sn-item" role="menuitemradio" aria-checked="false" data-v="auto">
                        <i class="sn-cm-dot sn-need"></i>
                        <span class="sn-tx">自动</span>
                        <span class="sn-chk">
                          <span data-i="check"></span>
                        </span>
                      </div>
                      <div class="sn-item sn-sel" role="menuitemradio" aria-checked="true" data-v="full">
                        <i class="sn-cm-dot sn-warn"></i>
                        <span class="sn-tx">完全访问</span>
                        <span class="sn-chk">
                          <span data-i="check"></span>
                        </span>
                      </div>
                    </div>
                    <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
                      <i class="sn-sa-thumb"></i>
                    </div>
                    <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
                      <i class="sn-sa-thumb"></i>
                    </div>
                  </div>
                </div>
                <span class="sn-grow"></span>
                <div class="sn-select sn-inline-menu sn-up sn-cm-pick sn-cm-models" data-pick="model">
                  <button type="button" class="sn-btn sn-ghost sn-sm sn-cm-model" data-menubtn="" data-cm-models="" aria-haspopup="menu" aria-label="分镜模型 · 精细" data-tip="换模型">
                    <span class="sn-cm-lbl">
                      <span class="sn-cm-m1">分镜模型</span>
                      <span class="sn-cm-m2">· 精细</span>
                    </span>
                    <span class="sn-cm-lbl sn-cm-lbl-s" aria-hidden="true">精细</span>
                    <span class="sn-cm-caret" aria-hidden="true">
                      <span data-i="chevron-down"></span>
                    </span>
                  </button>
                  <div class="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                    <div class="sn-sa-vp sn-fy">
                      <div class="sn-item sn-sel" role="menuitemradio" aria-checked="true" data-v="fine" data-short="精细">
                        <span class="sn-tx">分镜模型 · 精细</span>
                        <span class="sn-chk">
                          <span data-i="check"></span>
                        </span>
                      </div>
                      <div class="sn-item" role="menuitemradio" aria-checked="false" data-v="fast" data-short="快速">
                        <span class="sn-tx">分镜模型 · 快速</span>
                        <span class="sn-chk">
                          <span data-i="check"></span>
                        </span>
                      </div>
                    </div>
                    <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
                      <i class="sn-sa-thumb"></i>
                    </div>
                    <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
                      <i class="sn-sa-thumb"></i>
                    </div>
                  </div>
                </div>
                <span class="sn-ta-count">
                  <svg class="sn-uring" viewBox="0 0 16 16">
                    <circle class="sn-bg" cx="8" cy="8" r="6"></circle>
                    <circle class="sn-fg" cx="8" cy="8" r="6"></circle>
                  </svg>
                </span>
                <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn sn-cm-mic" data-cm-voice="" data-tip="语音输入" aria-label="语音输入" aria-pressed="false">
                  <span class="sn-swap">
                    <span class="sn-a">
                      <span data-i="mic"></span>
                    </span>
                    <span class="sn-b">
                      <span class="sn-cm-vw" aria-hidden="true">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                      </span>
                    </span>
                  </span>
                </button>
                <button type="button" class="sn-cm-send" aria-label="发送" data-tip="发送" data-kbd="↵" aria-disabled="true">
                  <span class="sn-swap">
                    <span class="sn-a">
                      <span data-i="arrow-up"></span>
                    </span>
                    <span class="sn-b">
                      <span class="sn-stop"></span>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="sn-chat-fx"></div>
      </div>
    </div>`,
})
export class ChatDemo1Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
