"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createChat } from "satin-ui/chat";

export default function Chat() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      (async () => {
        // 空容器：createChat 按选项填好标记（顶栏、消息区、底部输入框都接好了）。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
        createChat(root.querySelector("#chat"), {
          title: "分镜助手", placeholder: "和分镜助手一起改这一集",
          async *respond(text) {
            const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
            const reader = res.body.getReader(), dec = new TextDecoder();
            for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
          },
        });
      })();
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-page sn-wide" style={{ height: "100dvh", paddingBlock: "var(--sn-sp-16)" }}>
        <div id="chat" style={{ height: "100%" }}></div>
      </div>
    </div>
  );
}
