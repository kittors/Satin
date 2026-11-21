// 受控 / 非受控的运行时测试（Vue）：父组件重新渲染时，只写 value 的（非受控）组件不被打回初始值；
// v-model 的标签输入、折叠面板跟着父组件的值变。scripts/test/controlled.mjs 打包后在浏览器里跑
import { createApp, defineComponent, h, ref } from "vue";
import { Segmented, Stepper, TagInput, Collapse, CountInput, Composer } from "../../packages/satin-ui/vue/index.js";

const log = (window.__log = []);
const FAQ = [{ title: "第一项", content: "一" }, { title: "第二项", content: "二" }, { title: "第三项", content: "三" }];

const Kit = defineComponent({
  setup() {
    const n = ref(0), tags = ref(["雨夜", "车站"]), open = ref([0]), role = ref("林夏");
    return () => h("div", { id: "kit", style: { display: "grid", gap: "16px", padding: "16px", width: "480px" } }, [
      h("button", { id: "rerender", onClick: () => n.value++ }, `重新渲染 ${n.value}`),
      // 每次渲染都是新的 items 数组：换了引用、值没变，不能动选中
      h("div", { id: "seg" }, [h(Segmented, { items: ["网格", "列表"], value: "网格", label: "视图", "data-n": n.value })]),
      h("div", { id: "step" }, [h(Stepper, { value: 4, min: 1, max: 60, label: "时长", "data-n": n.value })]),
      h("div", { id: "tags" }, [h(TagInput, { modelValue: tags.value, max: 5, "onUpdate:modelValue": (t) => { tags.value = t; log.push("tags:" + t.join("|")); } })]),
      h("button", { id: "tags-clear", onClick: () => { tags.value = []; } }, "清空标签"),
      h("button", { id: "tags-set", onClick: () => { tags.value = ["悬疑", "长镜头"]; } }, "换一组标签"),
      h("div", { id: "acc" }, [h(Collapse, { items: FAQ, modelValue: open.value, "onUpdate:modelValue": (o) => { open.value = o; log.push("open:" + o.join(",")); } })]),
      h("button", { id: "acc-third", onClick: () => { open.value = [...open.value, 2]; } }, "展开第三项"),
      h("div", { id: "count" }, [h(CountInput, { modelValue: role.value, max: 8, id: "role-name", "onUpdate:modelValue": (v) => { role.value = v; log.push("role:" + v); } })]),
      h("button", { id: "count-set", onClick: () => { role.value = "林夏和周屿"; } }, "换角色名"),
      // @send 返回 Promise：发送后进入"生成中"，Promise 结束回到可发送
      h("div", { id: "cm" }, [h(Composer, { placeholder: "描述画面", onSend: ({ text }) => { log.push("send:" + text); return new Promise((r) => setTimeout(r, 600)); } })]),
      h("output", { id: "state" }, JSON.stringify({ tags: tags.value, open: open.value, role: role.value })),
    ]);
  },
});
createApp(Kit).mount("#app");
window.__ready = true;
