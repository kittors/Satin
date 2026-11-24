<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { popoverOf, copied } from "satin-ui/components";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root, (root: any) => {
      // 写在标记上：[data-pop="面板 id"] 点了开、再点关；Esc、点外面、焦点离开面板都会关——enhance() 已经接上
      // 面板里的操作做完以后关上：popoverOf(面板) 拿到正开着的那一层，close() 关上（焦点回到按钮）
      const pop = root.querySelector("#pop-share"), copyBtn = pop.querySelector(".sn-btn");
      copyBtn.addEventListener("click", async () => {
        await navigator.clipboard?.writeText(location.href).catch(() => {});
        copied(copyBtn);
        window.setTimeout(() => popoverOf(pop)?.close(true), 700);
      });
      // 不用标记也行：openPopover(面板, 按钮, { align: "end", onClose })，返回的那一层有 close()
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <button class="sn-btn sn-secondary" data-pop="pop-share">分享</button>
  <div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享">
    <h4>分享给协作者</h4>
    <p>拿到链接的人可以查看，不能修改。</p>
    <div class="sn-acts">
      <button class="sn-btn sn-primary sn-sm">复制链接</button>
    </div>
  </div>
</div>
