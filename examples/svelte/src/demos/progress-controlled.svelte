<script lang="ts">
  let p = $state(0), running = $state(false), t = 0;
  const stop = () => { clearInterval(t); running = false; };
  const toggle = () => {
    p = 0;
    if (running) return stop();
    running = true;
    t = setInterval(() => { p = Math.min(1, p + 0.1); if (p >= 1) stop(); }, 300);
  };
  $effect(() => stop);
</script>

<div class="sn-stack sn-gap-8" style="max-width: 420px">
  <div class="sn-pbar" style:--sn-p={p} role="progressbar" aria-label="导出进度" aria-valuenow={Math.round(p * 100)} aria-valuemin="0" aria-valuemax="100"><i></i></div>
  <div class="sn-row">
    <span class="sn-help sn-num">{p >= 1 ? "已导出" : running ? `已导出 ${Math.round(p * 100)}%` : "还没开始"}</span>
    <button type="button" class="sn-btn sn-secondary sn-sm" onclick={toggle}>{running ? "取消" : p >= 1 ? "再导一次" : "开始导出"}</button>
  </div>
</div>
