<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-empty-state">
  <span class="sn-art"><Icon name="wifi-off" /></span>
  <h4>加载失败</h4>
  <p>网络好像断了，恢复后会自动重试。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-secondary">重试</button>
  </div>
</div>
