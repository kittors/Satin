import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

export default function SelectControlled() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      const box = root.querySelector('[data-ex="ratio2"]'), select = box.querySelector("sn-select");
      box.addEventListener("sn-change", (e) => {
        select.setAttribute("value", e.detail); // 自己保管值：改属性，组件跟着更新
        box.querySelector("[data-out]").textContent = "当前：" + e.detail;
      });
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-stack sn-gap-8" data-ex="ratio2">
        <sn-select items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' value="9:16 · 竖屏" label="画面比例"></sn-select>
        <span class="sn-help" data-out="">当前：9:16 · 竖屏</span>
      </div>
    </div>
  );
}
