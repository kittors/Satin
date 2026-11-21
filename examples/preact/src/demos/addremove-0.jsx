import { useEffect, useRef } from "preact/hooks";
import { setup, enhance, injectIcons } from "satin-ui";
import { insertWithFlip, removeWithFlip, toast } from "satin-ui/components";

export default function AddremoveDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      // 新增：从下面淡入，别的标签让位；删除：先脱离布局淡出，剩下的用弹簧补位，给撤销
      const box = root.querySelector("#chipsBox"), input = root.querySelector("#addTag");
      const chipOf = (text) => {
        const chip = document.createElement("span"); chip.className = "sn-chip sn-tag sn-on";
        chip.innerHTML = `${text}<button class="sn-x" aria-label="移除 ${text}" data-i="x"></button>`;
        injectIcons(chip); return chip;
      };
      const add = (text, index) => insertWithFlip(box, chipOf(text), box.querySelectorAll(".sn-chip")[index ?? 1e9] || null);
      const submit = () => { const v = input.value.trim(); if (!v) return; add(v); input.value = ""; };
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      root.querySelector("[data-add-tag]").addEventListener("click", submit);

      box.addEventListener("click", (e) => {
        const x = e.target.closest(".sn-x"); if (!x) return;
        const chip = x.closest(".sn-chip"), text = chip.firstChild.textContent.trim(), index = [...box.querySelectorAll(".sn-chip")].indexOf(chip);
        removeWithFlip(chip);
        toast({ kind: "action", text: `已移除标签"${text}"`, action: { label: "撤销", run: (t) => { add(text, index); t.update({ kind: "status", text: `已恢复"${text}"`, done: true, duration: 2000 }); } } });
      });
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-add-row">
        <input class="sn-input" id="addTag" placeholder="添加一个标签，回车确认" />
        <button class="sn-btn sn-secondary" data-add-tag="">添加</button>
      </div>
      <div class="sn-chips-box" id="chipsBox">
        <span class="sn-chip sn-tag sn-on">雨夜<button class="sn-x" aria-label="移除 雨夜">
  <span data-i="x"></span>
</button></span>
        <span class="sn-chip sn-tag sn-on">车站<button class="sn-x" aria-label="移除 车站">
  <span data-i="x"></span>
</button></span>
        <span class="sn-chip sn-tag sn-on">第三集<button class="sn-x" aria-label="移除 第三集">
  <span data-i="x"></span>
</button></span>
        <span class="sn-chip sn-tag sn-on">悬疑<button class="sn-x" aria-label="移除 悬疑">
  <span data-i="x"></span>
</button></span>
        <span class="sn-chip sn-tag sn-on">长镜头<button class="sn-x" aria-label="移除 长镜头">
  <span data-i="x"></span>
</button></span>
        <span class="sn-chip sn-tag sn-on">暖色调<button class="sn-x" aria-label="移除 暖色调">
  <span data-i="x"></span>
</button></span>
      </div>
    </div>
  );
}
