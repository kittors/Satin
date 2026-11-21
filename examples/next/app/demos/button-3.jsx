"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { busy, succeed } from "satin-ui/components";
import "satin-ui/css/buttons.css";

export default function ButtonDemo3() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const save = root.querySelector("#save");
      const request = () => new Promise((done) => setTimeout(done, 1200)); // 换成你的请求，比如 fetch("/api/projects/42", { method: "PUT" })
      save.addEventListener("click", async () => {
        // 300ms 内回来不转圈；转圈出现后至少留 500ms；等待期间点不了
        await busy(save, request());
        succeed(save); // 原地换成对勾，一会儿换回文字
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <button className="sn-btn sn-primary" id="save">保存修改</button>
    </div>
  );
}
