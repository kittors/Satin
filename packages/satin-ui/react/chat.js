"use client"; // Next.js 等 React 服务端组件环境：用到状态和副作用，是客户端组件
// satin-ui/react/chat：对话（satin-ui/chat 的 createChat）包成的 React 组件。重组件单独一个子路径，不拉进 satin-ui/react 主入口。
//   import { Chat } from "satin-ui/react/chat";
//   <Chat title="写作助手" status="在线" placeholder="说点什么…" respond={async function* (text) { yield "好的，"; yield "马上改。"; }} />
// respond 接模型：异步生成器一段段 yield（或返回一整段文字）；每次都用最新的 respond（换了不用重新挂）。
// status 变了更新顶栏；history、title、placeholder、max、maxLines、attach 只在创建时用（要换一段对话就换 key）。ref 拿到实例：send(text)、receive(item)……
import { createElement as h, forwardRef, useRef, useState } from "react";
import { createChat } from "../src/chat.js";
import { wrap } from "./wrap.js";

const Base = /* @__PURE__ */ wrap(createChat, { events: [], displayName: "ChatInstance" });
export const Chat = /* @__PURE__ */ forwardRef(function Chat(props, ref) {
  const latest = useRef(props); latest.current = props;
  const [respond] = useState(() => (text, ctx) => latest.current.respond?.(text, ctx));
  const [hiRes] = useState(() => (bg) => latest.current.hiRes?.(bg) ?? bg);
  return h(Base, { ...props, respond, hiRes: props.hiRes ? hiRes : undefined, ref });
});
