import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function KeywordTags() {
  const [tags, setTags] = createSignal(["悬疑", "长镜头"]);
  return (
    <div class="sn-stack sn-gap-8">
      <sn-tag-input max="5" placeholder="输入关键词，回车确认" tags={JSON.stringify(tags())} ref={on("sn-change", (e) => setTags(e.detail))}></sn-tag-input>
      <span class="sn-help">已添加 {tags().length} / 5 个</span>
    </div>
  );
}
