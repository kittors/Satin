"use client";
import { useRef } from "react";
import { Player, type PlayerHandle } from "satin-ui/react";

export default function ClipControls() {
  // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；ref 拿到实例
  const player = useRef<PlayerHandle>(null);
  const restart = () => { if (!player.current) return; player.current.video.currentTime = 0; player.current.play(); };
  return (
    <div>
      <Player ref={player} src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />
      <div className="sn-row" style={{ marginTop: 12 }}>
        <button type="button" className="sn-btn sn-secondary sn-sm" onClick={restart}>从头播放</button>
        <button type="button" className="sn-btn sn-secondary sn-sm" onClick={() => player.current?.pause()}>暂停</button>
      </div>
    </div>
  );
}
