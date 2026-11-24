import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { toast, createPlayer, createAudio } from "satin-ui/components";

export default function MediaDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 视频：缓冲转圈、拖动进度、音量、画中画、全屏、键盘；不动时控件自己藏起来。在写好的播放器标记上接交互（也可以给空容器按选项渲染）
      createPlayer(root.querySelector("#player"), { onError: () => toast({ icon: "circle-x", tone: "danger", text: "视频没能加载，检查网络后再试", alert: true }) });

      // 音频：波形从音频本身算出来（拿不到就画平线，不编造）；同一时间只放一个
      createAudio(root.querySelector("#audio"), { onError: () => toast({ icon: "circle-x", tone: "danger", text: "音频没能加载，检查网络后再试", alert: true }) });
      // 列表里加一行：先插标记（createAudio.html({ src, title, sub }) 生成），再在这行标记上 createAudio(那一行)
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-player" id="player" tabIndex={0} aria-label="视频播放器：夜里安静的街道">
        <video className="sn-frame" playsInline preload="metadata" disableRemotePlayback data-src="https://assets.mixkit.co/videos/4451/4451-720.mp4"></video>
        <div className="sn-pip-note">
          <span data-i="picture-in-picture-2"></span>
          <b>正在画中画里播放</b>
          <button className="sn-btn sn-secondary sn-sm" data-pip-back="">回到这里播放</button>
        </div>
        <div className="sn-hud" aria-live="polite"></div>
        <span className="sn-spinner sn-pl-spin" aria-hidden="true"></span>
        <button className="sn-big-play sn-glass" aria-label="播放">
          <span data-i="play"></span>
        </button>
        <div className="sn-ctrl sn-glass">
          <button className="sn-pb" data-play="" aria-label="播放" data-tip="播放" data-kbd="空格">
            <span className="sn-swap">
              <span className="sn-a" data-i="play"></span>
              <span className="sn-b" data-i="pause"></span>
            </span>
          </button>
          <span className="sn-time"><span data-cur="">0:00</span> / <span data-dur="">0:00</span></span>
          <div className="sn-scrub" data-scrub="" role="slider" aria-label="进度" aria-valuemin={0} aria-valuemax={0} aria-valuenow={0}>
            <span className="sn-buf"></span>
            <span className="sn-fill"></span>
            <span className="sn-knob"></span>
            <span className="sn-hover-t">0:00</span>
          </div>
          <div className="sn-vol" data-lv="2">
            <button className="sn-pb" data-mute="" aria-label="静音" data-tip="静音" data-kbd="M">
              <svg className="sn-ic sn-vol-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
                <path className="sn-w1" d="M16 9a5 5 0 0 1 0 6"></path>
                <path className="sn-w2" d="M19.364 18.364a9 9 0 0 0 0-12.728"></path>
                <path className="sn-x" d="m16 9 6 6m0-6-6 6"></path>
              </svg>
            </button>
            <div className="sn-vs" role="slider" tabIndex={0} aria-label="音量" aria-valuemin={0} aria-valuemax={100} aria-valuenow={80}>
              <span className="sn-fill"></span>
              <span className="sn-knob"></span>
            </div>
          </div>
          <button className="sn-pb" data-pip="" aria-label="画中画" data-tip="画中画" data-kbd="P" data-i="picture-in-picture-2"></button>
          <button className="sn-pb" data-fs="" aria-label="全屏" data-tip="全屏" data-kbd="F">
            <span className="sn-swap">
              <span className="sn-a" data-i="maximize-2"></span>
              <span className="sn-b" data-i="minimize-2"></span>
            </span>
          </button>
        </div>
      </div>
      <div className="sn-audio-row" id="audio" data-src="https://assets.mixkit.co/music/127/127.mp3">
        <button className="sn-play" aria-label="播放">
          <span className="sn-swap">
            <span className="sn-a" data-i="play"></span>
            <span className="sn-b" data-i="pause"></span>
          </span>
        </button>
        <div className="sn-who">
          <b>Valley Sunset</b>
          <span>Alejandro Magaña (A. M.) · Mixkit</span>
        </div>
        <div className="sn-wave" role="slider" tabIndex={0} aria-label="播放进度" aria-valuemin={0} aria-valuemax={0} aria-valuenow={0}></div>
        <span className="sn-time">0:00</span>
      </div>
    </div>
  );
}
