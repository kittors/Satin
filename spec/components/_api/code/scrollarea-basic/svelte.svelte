<script>
  import { createScrollArea } from "satin-ui";

  // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createScrollArea(host, {});
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
  <p>第 11 场 · 隧道</p>
  <p>第 12 场 · 海边</p>
  <p>第 13 场 · 旧书店</p>
  <p>第 14 场 · 医院走廊</p>
  <p>第 15 场 · 末班地铁</p>
  <p>第 16 场 · 屋檐下</p>
  <p>第 17 场 · 桥上</p>
  <p>第 18 场 · 片尾</p>
</div>
