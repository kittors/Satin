import { onSettled } from "solid-js";
import { createPlayer } from "satin-ui";

export default function ClipPlayer() {
  let host!: HTMLDivElement;
  // 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createPlayer(host, { src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", label: "雨夜样片" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
