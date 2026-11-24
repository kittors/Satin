<script lang="ts">
  import { openLightbox } from "satin-ui/lightbox";

  const ITEMS = [
    { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
    { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
    { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
    { type: "video", src: "https://assets.mixkit.co/videos/4451/4451-720.mp4", poster: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", thumb: "https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg", ratio: 16 / 9, alt: "雨夜样片" },
  ];
  // 视频也放进看图层：type 写 "video"、src 是视频地址、poster 是封面，在里面直接播；受控：自己的按钮直接打开到视频那一张
  let state = $state<Record<number, string | undefined>>({});
  const thumbs: (HTMLDivElement | null)[] = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i: number) => {
    const img = new Image(), fail = () => (state[i] = "sn-failed");
    img.onload = () => (state[i] = "sn-loaded");
    img.onerror = fail;
    img.src = ITEMS[i].thumb;
  };
  $effect(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i: number) => state[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i: number) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k: number) => thumbs[k], enabled: ok }); };
  const onkey = (e: KeyboardEvent, i: number) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } };
</script>

<div class="sn-stack">
  <div class="sn-row">
    {#each ITEMS as it, i (it.src)}
      <div bind:this={thumbs[i]} class={["sn-im", state[i]]} role="button" tabindex="0" aria-label={"看大图：" + it.alt} style:height="120px" style:aspect-ratio="4 / 3" style:--sn-g={`url(${it.thumb}) center`} onclick={() => open(i)} onkeydown={(e) => onkey(e, i)}>
        <span class="sn-ph sn-sk"></span>
        <span class="sn-pic"></span>
      </div>
    {/each}
  </div>
  <div class="sn-row"><button type="button" class="sn-btn sn-secondary" onclick={() => open(3)}>直接看样片</button></div>
</div>
