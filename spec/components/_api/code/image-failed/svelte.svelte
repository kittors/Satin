<script>
  import { openLightbox } from "satin-ui/lightbox";
  import Icon from "satin-ui/svelte/Icon.svelte";

  const ITEMS = [
    { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
    { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
    { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
  ];
  const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张
  let state = $state({});
  const thumbs = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), fail = () => (state[i] = "sn-failed");
    img.onload = () => (state[i] = "sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  };
  $effect(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i) => state[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  const onkey = (e, i) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i); } };
  const retry = (e, i) => { e.stopPropagation(); delete state[i]; load(i); };
</script>

<div class="sn-row">
  {#each ITEMS as it, i (it.src)}
    <div bind:this={thumbs[i]} class={["sn-im", state[i]]} role="button" tabindex="0" aria-label={"看大图：" + it.alt} style:height="120px" style:aspect-ratio="4 / 3" style:--sn-g={`url(${it.thumb}) center`} onclick={() => open(i)} onkeydown={(e) => onkey(e, i)}>
      <span class="sn-ph sn-sk"></span>
      <span class="sn-pic"></span>
      <div class="sn-err"><Icon name="image-off" />图片加载失败<button type="button" class="sn-textbtn" onclick={(e) => retry(e, i)}>重试</button></div>
    </div>
  {/each}
</div>
