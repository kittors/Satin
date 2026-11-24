// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
// 每个演示套一层错误边界：一个演示出错只影响它自己，框里写清楚出了什么错（报错照样进控制台，验收脚本照样记下）
import { defineComponent, h, onErrorCaptured, ref } from "vue";

export default defineComponent({
  name: "DemoGuard",
  props: { slug: String },
  setup(props, { slots }) {
    const err = ref<unknown>(null);
    onErrorCaptured((e) => { console.error("演示 " + props.slug + " 出错：", e); err.value = e; return false; });
    return () => (err.value ? h("p", { class: "demo-err" }, "演示出错：" + String((err.value as Error)?.message ?? err.value)) : slots.default?.());
  },
});
