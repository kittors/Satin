import { onSettled } from "solid-js";
import { createPlayer } from "satin-ui";

export default function ClipControls() {
  // 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement, player: ReturnType<typeof createPlayer> | undefined;
  onSettled(() => {
    player = createPlayer(host, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
    return () => player.destroy();
  });
  const restart = () => { player.video.currentTime = 0; player.play(); };
  return (
    <div>
      <div ref={(el) => (host = el)}></div>
      <div class="sn-row" style={{ "margin-top": "12px" }}>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={restart}>从头播放</button>
        <button type="button" class="sn-btn sn-secondary sn-sm" onClick={() => player.pause()}>暂停</button>
      </div>
    </div>
  );
}
