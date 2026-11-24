import { createSignal, For } from "solid-js";
import { removeChip } from "satin-ui";

export default function SceneTags() {
  const [tags, setTags] = createSignal(["雨夜", "车站", "列车"]);
  // 先播收起动画（keep：节点交给 Solid 删），放完再从列表里删
  const remove = (e: MouseEvent, t: string) => removeChip((e.currentTarget as HTMLElement).parentElement!, { keep: true, onRemoved: () => setTags((x) => x.filter((y) => y !== t)) });
  return (
    <sn-enhance>
      <div class="sn-row">
        <For each={tags()}>
          {(t) => <span class="sn-chip sn-tag sn-on">{t}<button type="button" class="sn-x" aria-label={`移除 ${t}`} data-i="x" onClick={(e) => remove(e, t)}></button></span>}
        </For>
      </div>
    </sn-enhance>
  );
}
