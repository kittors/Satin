<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  defineElements();

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      const box = root.querySelector('[data-ex="ratio2"]'), select = box.querySelector("sn-select");
      box.addEventListener("sn-change", (e) => {
        select.setAttribute("value", e.detail); // 自己保管值：改属性，组件跟着更新
        box.querySelector("[data-out]").textContent = "当前：" + e.detail;
      });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sn-stack sn-gap-8" data-ex="ratio2">
    <sn-select items="[&quot;16:9 · 横屏&quot;,&quot;9:16 · 竖屏&quot;,&quot;1:1 · 方形&quot;]" value="9:16 · 竖屏" label="画面比例"></sn-select>
    <span class="sn-help" data-out="">当前：9:16 · 竖屏</span>
  </div>
</div>
