import { For, createSignal, onSettled } from "solid-js";
import { openLightbox } from "satin-ui/lightbox";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const failOnce = new Set([1]); // 演示用：第二张第一次当作加载失败

export default function GalleryRetry() {
  // 加载失败显示图标和"重试"，点了再加载一次；左右翻页跳过失败的那张
  const [state, setState] = createSignal({}), thumbs = [];
  // 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
  const load = (i) => {
    const img = new Image(), put = (c) => setState((s) => ({ ...s, [i]: c })), fail = () => put("sn-failed");
    img.onload = () => put("sn-loaded");
    img.onerror = fail;
    if (failOnce.delete(i)) setTimeout(fail, 600);
    else img.src = ITEMS[i].thumb;
  };
  onSettled(() => ITEMS.forEach((_, i) => load(i)));
  const ok = (i) => state()[i] === "sn-loaded";
  // 图片从缩略图的位置长到铺满窗口，关上时沿原路缩回；左右翻页跳过没加载好的
  const open = (i) => { if (ok(i)) openLightbox(ITEMS, i, { thumbOf: (k) => thumbs[k], enabled: ok }); };
  const retry = (e, i) => { e.stopPropagation(); setState((s) => ({ ...s, [i]: undefined })); load(i); };
  return (
    <sn-enhance>
      <div class="sn-row">
        <For each={ITEMS}>{(it, i) => (
          <div ref={(el) => (thumbs[i()] = el)} class={["sn-im", { "sn-loaded": state()[i()] === "sn-loaded", "sn-failed": state()[i()] === "sn-failed" }]} role="button" tabindex="0" aria-label={"看大图：" + it.alt}
            style={{ height: "120px", "aspect-ratio": "4 / 3", "--sn-g": `url(${it.thumb}) center` }}
            onClick={() => open(i())} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); open(i()); } }}>
            <span class="sn-ph sn-sk" />
            <span class="sn-pic" />
            <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button type="button" class="sn-textbtn" onClick={(e) => retry(e, i())}>重试</button></div>
          </div>
        )}</For>
      </div>
    </sn-enhance>
  );
}
