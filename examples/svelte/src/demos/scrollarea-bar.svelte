<script>
  import { createScrollArea } from "satin-ui";

  // bar="always"：滚动条一直在；fade 四边都渐隐；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createScrollArea(host, { bar: "always", fade: "both" });
    return () => it.destroy();
  });
</script>

<div class="sn-sa-vp" bind:this={host} style="max-height:160px">
  <p>第 1 场 · 车站外</p>
  <p>第 2 场 · 候车厅</p>
  <p>第 3 场 · 站台</p>
  <p>第 4 场 · 车厢里</p>
  <p>第 5 场 · 雨夜</p>
  <p>第 6 场 · 回忆</p>
  <p>第 7 场 · 告别</p>
  <p>第 8 场 · 清晨</p>
  <p>第 9 场 · 天台</p>
  <p>第 10 场 · 便利店</p>
</div>
