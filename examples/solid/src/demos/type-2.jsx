import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./type-2.css";

export default function TypeDemo2() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="grid-m lc" style="--lc:120px">
        <span class="sn-cap">比例数字</span>
        <span class="sn-t-title2">1,111 · 8,888 · 2,017</span>
        <span class="sn-cap">等宽数字</span>
        <span class="sn-t-title2 sn-num">1,111 · 8,888 · 2,017</span>
        <span class="sn-cap">截断 · 悬停看全文</span>
        <span class="sn-t-callout sn-truncate" style="max-width:280px" data-tip-full="">第三集 · 雨夜的车站：主角在末班车开走之后，才发现手里的信封是空的</span>
      </div>
    </div>
  );
}
