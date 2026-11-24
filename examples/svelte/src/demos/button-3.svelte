<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { busy, succeed } from "satin-ui/components";
  import "satin-ui/css/buttons.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root, (root: any) => {
      const save = root.querySelector("#save");
      const request = () => new Promise((done?: any) => window.setTimeout(done, 1200)); // 换成你的请求，比如 fetch("/api/projects/42", { method: "PUT" })
      save.addEventListener("click", async () => {
        // 300ms 内回来不转圈；转圈出现后至少留 500ms；等待期间点不了
        await busy(save, request());
        succeed(save); // 原地换成对勾，一会儿换回文字
      });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <button class="sn-btn sn-primary" id="save">保存修改</button>
</div>
