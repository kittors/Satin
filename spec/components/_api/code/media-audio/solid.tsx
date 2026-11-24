import { onSettled } from "solid-js";
import { createAudio } from "satin-ui";

export default function VoiceOver() {
  let host!: HTMLDivElement;
  // 波形从音频本身算出来；点波形跳到那里；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createAudio(host, { src: "https://assets.mixkit.co/music/127/127.mp3", title: "Valley Sunset", sub: "Alejandro Magaña (A. M.) · Mixkit" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
