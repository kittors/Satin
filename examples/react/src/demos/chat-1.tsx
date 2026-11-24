import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function ChatDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-chat sn-chat-new" id="chatNew">
        <div className="sn-chat-hd">
          <div className="sn-tx">
            <b>新对话</b>
            <span className="sn-sub">
              <span data-chat-status=""></span>
            </span>
          </div>
        </div>
        <div className="sn-chat-body">
          <div className="sn-sa" data-bar="auto" data-over="auto">
            <div className="sn-chat-vp sn-sa-vp sn-fy sn-no-b">
              <div className="sn-chat-canvas">
                <div className="sn-chat-ph sn-top"></div>
                <div className="sn-chat-ph sn-bot"></div>
                <div className="sn-ci sn-ci-more"></div>
              </div>
            </div>
            <div className="sn-sa-bar sn-y" hidden aria-hidden="true">
              <i className="sn-sa-thumb"></i>
            </div>
            <div className="sn-sa-bar sn-x" hidden aria-hidden="true">
              <i className="sn-sa-thumb"></i>
            </div>
          </div>
          <button className="sn-chat-jump" data-chat-jump="" aria-label="跳到最新">
            <span data-i="arrow-down"></span>
            <span className="sn-badge" hidden>0</span>
          </button>
          <div className="sn-chat-empty sn-enter-wait" data-chat-empty="">
            <span className="sn-chat-empty-ic" aria-hidden="true">
              <span data-i="clapperboard"></span>
            </span>
            <div className="sn-chat-empty-t" role="heading" aria-level={2}>今天拍哪一段？</div>
            <div className="sn-chat-empty-sub">上次停在候车厅</div>
            <div className="sn-chat-sugs">
              <button type="button" className="sn-chat-sug">把第三集拆成镜头</button>
              <button type="button" className="sn-chat-sug">开头的雨夜再冷一点</button>
              <button type="button" className="sn-chat-sug">给结尾配一段钢琴</button>
            </div>
          </div>
          <nav className="sn-rail" data-side="left" aria-label="对话进度定位">
            <div className="sn-rail-ticks"></div>
            <div className="sn-rail-tip" aria-hidden="true">
              <span className="sn-rail-tip-txt"></span>
              <span className="sn-rail-tip-meta sn-num"></span>
            </div>
          </nav>
        </div>
        <div className="sn-chat-foot">
          <div className="sn-box-in sn-composer sn-cm-new sn-has-ctx" data-composer="" data-external="" data-max="500" data-max-lines="5">
            <div className="sn-cm-ctx" role="group" aria-label="上下文">
              <button type="button" className="sn-cm-ctx-i" data-ctx="0">
                <span data-i="folder"></span>
                <span className="sn-cm-lbl">雨夜车站</span>
              </button>
              <div className="sn-select sn-inline-menu sn-up sn-cm-pick" data-pick="ctx" data-ctx="1">
                <button type="button" className="sn-cm-ctx-i" data-menubtn="" aria-haspopup="menu">
                  <span data-i="monitor"></span>
                  <span className="sn-cm-lbl">本地</span>
                  <span className="sn-cm-caret" aria-hidden="true">
                    <span data-i="chevron-down"></span>
                  </span>
                </button>
                <div className="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                  <div className="sn-sa-vp sn-fy">
                    <div className="sn-item sn-sel" role="menuitemradio" aria-checked="true" data-v="local">
                      <span className="sn-tx">本地</span>
                      <span className="sn-chk">
                        <span data-i="check"></span>
                      </span>
                    </div>
                    <div className="sn-item" role="menuitemradio" aria-checked="false" data-v="cloud">
                      <span className="sn-tx">云端</span>
                      <span className="sn-chk">
                        <span data-i="check"></span>
                      </span>
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
              <div className="sn-select sn-inline-menu sn-up sn-cm-pick" data-pick="ctx" data-ctx="2">
                <button type="button" className="sn-cm-ctx-i" data-menubtn="" aria-haspopup="menu">
                  <span data-i="git-branch"></span>
                  <span className="sn-cm-lbl">第三集</span>
                  <span className="sn-cm-caret" aria-hidden="true">
                    <span data-i="chevron-down"></span>
                  </span>
                </button>
                <div className="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                  <div className="sn-sa-vp sn-fy">
                    <div className="sn-item sn-sel" role="menuitemradio" aria-checked="true" data-v="ep3">
                      <span className="sn-tx">第三集</span>
                      <span className="sn-chk">
                        <span data-i="check"></span>
                      </span>
                    </div>
                    <div className="sn-item" role="menuitemradio" aria-checked="false" data-v="ep4">
                      <span className="sn-tx">第四集</span>
                      <span className="sn-chk">
                        <span data-i="check"></span>
                      </span>
                    </div>
                    <div className="sn-item" role="menuitemradio" aria-checked="false" data-v="final">
                      <span className="sn-tx">定稿</span>
                      <span className="sn-chk">
                        <span data-i="check"></span>
                      </span>
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
            <div className="sn-cm-card">
              <div className="sn-cm-resize" role="separator" aria-orientation="horizontal" aria-label="拖动调整高度，双击恢复自动" data-tip="拖动调整高度，双击恢复自动">
                <i></i>
              </div>
              <div className="sn-sa" data-bar="none" data-over="bounce">
                <div className="sn-cm-files sn-sa-vp sn-fx"></div>
                <div className="sn-sa-bar sn-y" hidden aria-hidden="true">
                  <i className="sn-sa-thumb"></i>
                </div>
                <div className="sn-sa-bar sn-x" hidden aria-hidden="true">
                  <i className="sn-sa-thumb"></i>
                </div>
              </div>
              <div className="sn-cm-note" role="status">
                <div>
                  <p>
                    <span data-i="circle-alert"></span>
                    <span className="sn-tx"></span>
                  </p>
                </div>
              </div>
              <div className="sn-sa" data-bar="auto" data-over="contain">
                <textarea rows={1} placeholder="随心输入" className="sn-sa-vp" />
                <div className="sn-sa-bar sn-y" hidden aria-hidden="true">
                  <i className="sn-sa-thumb"></i>
                </div>
                <div className="sn-sa-bar sn-x" hidden aria-hidden="true">
                  <i className="sn-sa-thumb"></i>
                </div>
              </div>
              <div className="sn-cm-bar">
                <div className="sn-select sn-inline-menu sn-up">
                  <button type="button" className="sn-btn sn-ghost sn-sm sn-ibtn sn-cm-add" data-menubtn="" data-cm-attach="" data-tip="添加图片、视频、音频或文档" aria-label="添加附件">
                    <span data-i="plus"></span>
                  </button>
                  <div className="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                    <div className="sn-sa-vp sn-fy">
                      <div className="sn-item" data-add="img"><span data-i="image"></span>图片<span className="sn-key">JPG · PNG</span></div>
                      <div className="sn-item" data-add="vid"><span data-i="film"></span>视频<span className="sn-key">MP4 · MOV</span></div>
                      <div className="sn-item" data-add="aud"><span data-i="audio-lines"></span>音频<span className="sn-key">MP3 · WAV</span></div>
                      <div className="sn-item" data-add="doc"><span data-i="file-text"></span>文档<span className="sn-key">PDF · DOCX</span></div>
                    </div>
                    <div className="sn-sa-bar sn-y" hidden aria-hidden="true">
                      <i className="sn-sa-thumb"></i>
                    </div>
                    <div className="sn-sa-bar sn-x" hidden aria-hidden="true">
                      <i className="sn-sa-thumb"></i>
                    </div>
                  </div>
                </div>
                <div className="sn-select sn-inline-menu sn-up sn-cm-pick" data-pick="mode">
                  <button type="button" className="sn-tag sn-cm-mode sn-warn" data-menubtn="" aria-haspopup="menu">
                    <i></i>
                    <span className="sn-cm-lbl">完全访问</span>
                    <span className="sn-cm-caret" aria-hidden="true">
                      <span data-i="chevron-down"></span>
                    </span>
                  </button>
                  <div className="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                    <div className="sn-sa-vp sn-fy">
                      <div className="sn-item" role="menuitemradio" aria-checked="false" data-v="read">
                        <i className="sn-cm-dot sn-ok"></i>
                        <span className="sn-tx">只读</span>
                        <span className="sn-chk">
                          <span data-i="check"></span>
                        </span>
                      </div>
                      <div className="sn-item" role="menuitemradio" aria-checked="false" data-v="auto">
                        <i className="sn-cm-dot sn-need"></i>
                        <span className="sn-tx">自动</span>
                        <span className="sn-chk">
                          <span data-i="check"></span>
                        </span>
                      </div>
                      <div className="sn-item sn-sel" role="menuitemradio" aria-checked="true" data-v="full">
                        <i className="sn-cm-dot sn-warn"></i>
                        <span className="sn-tx">完全访问</span>
                        <span className="sn-chk">
                          <span data-i="check"></span>
                        </span>
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
                <span className="sn-grow"></span>
                <div className="sn-select sn-inline-menu sn-up sn-cm-pick sn-cm-models" data-pick="model">
                  <button type="button" className="sn-btn sn-ghost sn-sm sn-cm-model" data-menubtn="" data-cm-models="" aria-haspopup="menu" aria-label="分镜模型 · 精细" data-tip="换模型">
                    <span className="sn-cm-lbl">
                      <span className="sn-cm-m1">分镜模型</span>
                      <span className="sn-cm-m2">· 精细</span>
                    </span>
                    <span className="sn-cm-lbl sn-cm-lbl-s" aria-hidden="true">精细</span>
                    <span className="sn-cm-caret" aria-hidden="true">
                      <span data-i="chevron-down"></span>
                    </span>
                  </button>
                  <div className="sn-menu sn-sa sn-sa-in" role="menu" data-bar="auto" data-over="contain">
                    <div className="sn-sa-vp sn-fy">
                      <div className="sn-item sn-sel" role="menuitemradio" aria-checked="true" data-v="fine" data-short="精细">
                        <span className="sn-tx">分镜模型 · 精细</span>
                        <span className="sn-chk">
                          <span data-i="check"></span>
                        </span>
                      </div>
                      <div className="sn-item" role="menuitemradio" aria-checked="false" data-v="fast" data-short="快速">
                        <span className="sn-tx">分镜模型 · 快速</span>
                        <span className="sn-chk">
                          <span data-i="check"></span>
                        </span>
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
                <span className="sn-ta-count">
                  <svg className="sn-uring" viewBox="0 0 16 16">
                    <circle className="sn-bg" cx="8" cy="8" r="6"></circle>
                    <circle className="sn-fg" cx="8" cy="8" r="6"></circle>
                  </svg>
                </span>
                <button type="button" className="sn-btn sn-ghost sn-sm sn-ibtn sn-cm-mic" data-cm-voice="" data-tip="语音输入" aria-label="语音输入" aria-pressed="false">
                  <span className="sn-swap">
                    <span className="sn-a">
                      <span data-i="mic"></span>
                    </span>
                    <span className="sn-b">
                      <span className="sn-cm-vw" aria-hidden="true">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                      </span>
                    </span>
                  </span>
                </button>
                <button type="button" className="sn-cm-send" aria-label="发送" data-tip="发送" data-kbd="↵" aria-disabled="true">
                  <span className="sn-swap">
                    <span className="sn-a">
                      <span data-i="arrow-up"></span>
                    </span>
                    <span className="sn-b">
                      <span className="sn-stop"></span>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-chat-fx"></div>
      </div>
    </div>
  );
}
