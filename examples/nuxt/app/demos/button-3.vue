<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { busy, succeed } from "satin-ui/components";
import "satin-ui/css/buttons.css";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value, (root) => {
    const save = root.querySelector("#save");
    save.addEventListener("click", async () => {
      // 300ms 内回来不转圈；转圈出现后至少留 500ms；等待期间点不了
      await busy(save, fetch("/api/projects/42", { method: "PUT" }));
      succeed(save); // 原地换成对勾，一会儿换回文字
    });
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <button class="sn-btn sn-primary" id="save">保存修改</button>
  </div>
</template>
