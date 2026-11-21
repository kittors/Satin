// satin-ui/vue/chat：对话（satin-ui/chat 的 createChat）包成的 Vue 组件。重组件单独一个子路径，不拉进 satin-ui/vue 主入口。
//   <script setup> import { Chat } from "satin-ui/vue/chat"; async function* respond(text) { yield "好的，"; yield "马上改。"; } </script>
//   <Chat title="写作助手" status="在线" placeholder="说点什么…" :respond="respond" />
// respond 接模型：异步生成器一段段 yield（或返回一整段文字）；每次都用最新的 respond。
// status 变了更新顶栏；history、title、placeholder、max、max-lines、attach 只在创建时用（要换一段对话就换 :key）。模板 ref 的 instance：send(text)、receive(item)……
import { defineComponent, h, ref, computed } from "vue";
import { createChat } from "../src/chat.js";
import { wrap } from "./wrap.js";

const KEYS = ["title", "status", "placeholder", "max", "maxLines", "attach", "history", "composer", "respond", "hiRes"];
const Base = /* @__PURE__ */ wrap(createChat, { name: "SnChatInstance", props: KEYS, events: [], modelEvent: null });
export const Chat = /* @__PURE__ */ defineComponent({
  name: "SnChat", inheritAttrs: false,
  props: Object.fromEntries(KEYS.map((k) => [k, { type: null, default: undefined }])),
  setup(p, { attrs, expose }) {
    const inner = ref(null);
    // 交给库的是固定的转发函数：父组件换了 respond 也用最新的
    const respond = (text, ctx) => p.respond?.(text, ctx), hiRes = (bg) => p.hiRes?.(bg) ?? bg;
    expose({ instance: computed(() => inner.value?.instance ?? null) });
    return () => h(Base, { ...attrs, ...p, respond, hiRes: p.hiRes ? hiRes : undefined, ref: inner });
  },
});
