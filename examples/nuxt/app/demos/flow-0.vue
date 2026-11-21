<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createFlow } from "satin-ui/flow";
import "satin-ui/css/content.css";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value, (root) => {
    // 设计稿里的 .sn-flow 标记直接传（空容器也行：画布、工具条、小地图都由 createFlow 填好）；卸载时调 flow.destroy()
    const flow = createFlow(root.querySelector(".sn-flow"), {
      // 节点：位置、标题、图标、说明、类型（类型决定线和端口的色相：text | board | image | audio | video | out）
      nodes: [
        { id: "src",   x: 0,   y: 0, t: "导入原文", ic: "book-open",    d: "雨夜车站.docx", k: "text" },
        { id: "board", x: 270, y: 0, t: "生成分镜", ic: "clapperboard", d: "48 个镜头",     k: "board" },
        { id: "out",   x: 540, y: 0, t: "导出",     ic: "download",     d: "第三集.mp4",    k: "out" },
      ],
      edges: [["src", "board"], ["board", "out"]],
    });
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="sn-flow" id="flowBox" tabindex="0" aria-label="流程图画布">
      <div class="sn-flow-world">
        <svg class="sn-flow-edges"></svg>
        <div class="sn-flow-nodes"></div>
      </div>
      <div class="sn-flow-tools glass-lite">
        <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-fz="-1" data-tip="缩小" data-kbd="⌘−" data-i="minus"></button>
        <button class="sn-fz-val sn-num" data-fz="reset" data-tip="恢复到 100%">100%</button>
        <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-fz="1" data-tip="放大" data-kbd="⌘+" data-i="plus"></button>
        <span class="sn-vr"></span>
        <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-fz="fit" data-tip="适配视图：全部节点放进画布" data-kbd="⇧1" data-i="maximize-2"></button>
        <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-fz="center" data-tip="居中：选中的节点或整张图移到画布中间" data-kbd="⇧2" data-i="locate-fixed"></button>
        <span class="sn-vr"></span>
        <button class="sn-btn sn-ghost sn-sm" data-flow-tidy="" data-tip="自动排版：按上下游分层、减少交叉、对齐" data-kbd="⇧L" data-i="workflow:before">整理</button>
      </div>
      <div class="sn-flow-run">
        <button class="sn-btn sn-primary sn-sm" data-flow-run="" data-i="play:before">运行</button>
      </div>
      <div class="sn-flow-mini">
        <svg></svg>
        <i class="sn-mini-view"></i>
      </div>
    </div>
  </div>
</template>
