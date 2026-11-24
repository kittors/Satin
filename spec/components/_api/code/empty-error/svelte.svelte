<script lang="ts">
  import EmptyArt from "satin-ui/svelte/EmptyArt.svelte";
</script>

<div class="sn-empty-state">
  <EmptyArt name="error" />
  <h4>暂时无法加载</h4>
  <p>连接已中断，网络恢复后自动重试。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">重试</button>
  </div>
</div>
