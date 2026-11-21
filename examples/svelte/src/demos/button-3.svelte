<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { busy, succeed } from "satin-ui/components";
  import "satin-ui/css/buttons.css";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      const save = root.querySelector("#save");
      save.addEventListener("click", async () => {
        // 300ms 内回来不转圈；转圈出现后至少留 500ms；等待期间点不了
        await busy(save, fetch("/api/projects/42", { method: "PUT" }));
        succeed(save); // 原地换成对勾，一会儿换回文字
      });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <button class="sn-btn sn-primary" id="save">保存修改</button>
</div>
