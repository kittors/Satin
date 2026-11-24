<script lang="ts">
  import { createAudio } from "satin-ui";

  // 波形从音频本身算出来；点波形跳到那里；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createAudio(host, { src: "https://assets.mixkit.co/music/127/127.mp3", title: "Valley Sunset", sub: "Alejandro Magaña (A. M.) · Mixkit" });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
