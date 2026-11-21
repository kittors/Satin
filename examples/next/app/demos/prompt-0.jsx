"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createComposer, toast } from "satin-ui/components";

export default function PromptDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 提示词输入框：自动长高、字数、附件（拖进来、粘贴截图、附件菜单）；有文字或附件、附件传完才能发
      let timer = 0;
      createComposer(root.querySelector("[data-composer]"), {
        // 发送：返回 Promise，期间是"生成中"、发送键变成停止；Promise 结束回到可发送（换成你的生成请求）
        onSend: ({ text }) => new Promise((done) => { timer = setTimeout(() => { done(); toast({ text: `已生成 3 个镜头：${text.slice(0, 12)}…` }); }, 2600); }),
        onStop: () => clearTimeout(timer),
        // 上传：报进度，结束就完成，出错就失败（点一下重试）；换成你的上传
        upload: (file, onProgress) => new Promise((ok) => { let p = 0; const iv = setInterval(() => { p = Math.min(1, p + 0.2); onProgress(p); if (p >= 1) { clearInterval(iv); ok(); } }, 220); }),
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-box-in sn-composer" data-composer="" data-max="300" data-max-lines="6">
        <div className="sn-cm-files"></div>
        <textarea rows="1" placeholder="描述你想要的画面，比如：雨夜，林夏站在空荡的站台上，最后一班车的车灯穿过雨幕" />
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
          <span className="sn-ta-count">
            <svg className="sn-uring" viewBox="0 0 16 16">
              <circle className="sn-bg" cx="8" cy="8" r="6"></circle>
              <circle className="sn-fg" cx="8" cy="8" r="6"></circle>
            </svg>
          </span>
          <button className="sn-cm-send" aria-label="生成" data-tip="生成" data-kbd="⌘↵">
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
  );
}
