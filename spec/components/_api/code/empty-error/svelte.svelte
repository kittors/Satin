<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-empty-state">
  <span class="sn-art"><Icon name="wifi-off" /></span>
  <h4>暂时无法加载</h4>
  <p>连接已中断，网络恢复后自动重试。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">重试</button>
  </div>
</div>
