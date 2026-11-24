import { AudioPlayer } from "satin-ui/react";

export default function VoiceOver() {
  // 波形从音频本身算出来；点波形跳到那里
  return <AudioPlayer src="https://assets.mixkit.co/music/127/127.mp3" title="Valley Sunset" sub="Alejandro Magaña (A. M.) · Mixkit" />;
}
