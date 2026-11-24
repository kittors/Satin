<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance, injectIcons } from "satin-ui";
import { removeChip } from "satin-ui/components";
import "satin-ui/css/buttons.css";
import "./chip-0.css";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value, (root: any) => {
    // 筛选芯片：点了切换 .sn-on，aria-pressed 跟着变
    for (const c of root.querySelectorAll(".sn-chip[data-toggle]")) {
      c.setAttribute("aria-pressed", String(c.classList.contains("sn-on")));
      c.addEventListener("click", () => c.setAttribute("aria-pressed", String(c.classList.toggle("sn-on"))));
    }

    // 可移除标签：点 × 先脱离布局淡出，剩下的用弹簧补位；移除后容器上冒泡 chipremove
    const row = root.querySelector('[data-chips="removable"]');
    row.addEventListener("click", (e?: any) => {
      const x = e.target.closest(".sn-chip .sn-x");
      if (x) removeChip(x.closest(".sn-chip"));
    });
    row.addEventListener("chipremove", (e?: any) => console.log("移除了", e.detail.chip.textContent));
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="row">
      <button class="sn-chip sn-on" data-toggle=""><span data-i="check"></span>进行中</button>
      <button class="sn-chip" data-toggle=""><span data-i="check"></span>已完成</button>
    </div>
    <div class="row" data-chips="removable">
      <span class="sn-chip sn-tag sn-on">雨夜<button class="sn-x" aria-label="移除 雨夜" data-i="x"></button></span>
      <span class="sn-chip sn-tag sn-on">车站<button class="sn-x" aria-label="移除 车站" data-i="x"></button></span>
    </div>
  </div>
</template>
