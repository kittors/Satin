"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createChat } from "satin-ui/chat";

export default function ChatDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      (async () => {
        // 已有设计稿里的 .sn-chat 标记直接传（空容器也行：顶栏、消息区、底部输入框都由 createChat 填好、接好）
        // 接模型：异步生成器，一段一段地给——{ think } 是思考，字符串是正文；先进缓冲、匀速放出来。这里用写好的一段话模拟
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        createChat(root.querySelector("#chatBox"), {
          respond: async function* (question, state) {
            for (const piece of ["先看这一场的节奏：", "雨夜、车站、", "等最后一班车的人。"]) { if (state.stopped) return; yield { think: piece }; await wait(120); }
            const text = `好的。"${question}"可以拆成三个镜头：远景站台、林夏的中景、车灯穿过雨幕的特写。`;
            for (const ch of text) { if (state.stopped) return; yield ch; await wait(16); } // 换成你的模型流式输出
          },
        });
      })();
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-chat" id="chatBox">
        <div className="sn-chat-hd">
          <div className="sn-tx">
            <b>分镜助手</b>
            <span className="sn-sub"><span data-chat-status="">在线</span>·<span data-chat-count="" className="sn-num"></span></span>
          </div>
        </div>
        <div className="sn-chat-body">
          <div className="sn-chat-vp" id="chatVp">
            <div className="sn-chat-canvas">
              <div className="sn-chat-ph sn-top"></div>
              <div className="sn-chat-ph sn-bot"></div>
            </div>
          </div>
          <button className="sn-chat-jump" data-chat-jump="" aria-label="跳到最新">
            <span data-i="arrow-down"></span>
            <span className="sn-badge" hidden>0</span>
          </button>
        </div>
        <div className="sn-chat-foot">
          <div className="sn-box-in sn-composer" data-composer="" data-external="" data-max="500" data-max-lines="5">
            <div className="sn-cm-files"></div>
            <textarea rows="1" placeholder="和分镜助手一起改这一集" />
            <div className="sn-cm-bar">
              <div className="sn-select sn-inline-menu sn-up">
                <button className="sn-btn sn-ghost sn-sm sn-ibtn sn-cm-add" data-menubtn="" data-cm-attach="" data-tip="添加图片、视频、音频或文档" aria-label="添加附件" data-i="plus"></button>
                <div className="sn-menu" role="menu" style={{ minWidth: "208px" }}>
                  <div className="sn-item" data-add="img" data-i="image:before">图片<span className="sn-key">JPG · PNG</span></div>
                  <div className="sn-item" data-add="vid" data-i="film:before">视频<span className="sn-key">MP4 · MOV</span></div>
                  <div className="sn-item" data-add="aud" data-i="audio-lines:before">音频<span className="sn-key">MP3 · WAV</span></div>
                  <div className="sn-item" data-add="doc" data-i="file-text:before">文档<span className="sn-key">PDF · DOCX</span></div>
                  <div className="sn-sep"></div>
                  <div className="sn-item" data-add="fail" data-i="refresh-cw:before">演示：上传失败</div>
                  <div className="sn-item" data-add="big" data-i="circle-alert:before">演示：文件太大</div>
                </div>
              </div>
              <button className="sn-btn sn-ghost sn-sm sn-cm-chip" data-cm-style="">风格：电影感</button>
              <span className="sn-grow"></span>
              <button className="sn-btn sn-ghost sn-sm sn-cm-model" data-cm-model="" data-tip="换模型" data-i="chevron-down:after">分镜模型 · 精细</button>
              <span className="sn-ta-count">
                <svg className="sn-uring" viewBox="0 0 16 16">
                  <circle className="sn-bg" cx="8" cy="8" r="6"></circle>
                  <circle className="sn-fg" cx="8" cy="8" r="6"></circle>
                </svg>
              </span>
              <button className="sn-cm-send" aria-label="发送" data-tip="发送" data-kbd="⌘↵">
                <svg className="sn-orbit" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="19"></circle>
                </svg>
                <span className="sn-swap">
                  <span className="sn-a" data-i="arrow-up"></span>
                  <span className="sn-b">
                    <span className="sn-stop"></span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
