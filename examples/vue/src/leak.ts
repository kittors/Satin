// 泄漏测试页（scripts/test/framework-leaks.mjs 用）：反复切"路由"（示例页 ↔ 表格 + 弹窗页）、v-if 整页挂上卸下，
// 卸下以后活着的监听、观察器、定时器、脱离文档的节点要回到起点
import { createApp, h, ref, nextTick } from "vue";
import Satin from "satin-ui/vue";
import "satin-ui/css/page.css";
import "../../shared/sink.css";
import Sink from "./App.vue";
import Other from "./Other.vue";

declare global {
  interface Window {
    __set?: (v?: string, s?: boolean) => Promise<void>;
    __ready?: boolean;
  }
}

const view = ref("sink"), show = ref(true);
window.__set = async (v, s) => { if (v) view.value = v; if (s !== undefined) show.value = s; await nextTick(); };
createApp({ render: () => (show.value ? h(view.value === "sink" ? Sink : Other) : null) }).use(Satin).mount("#app");
window.__ready = true;
