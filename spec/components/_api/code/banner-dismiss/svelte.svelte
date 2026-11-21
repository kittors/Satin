<script>
  import Icon from "satin-ui/svelte/Icon.svelte";

  let closed = $state(false);
</script>

<!-- 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来 -->
<div class="sn-banner-wrap" class:sn-closing={closed}>
  <div class="sn-banner" role="status">
    <Icon name="download" />
    <div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
    <button type="button" class="sn-btn sn-secondary sn-sm">重启</button>
    <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label="关闭" data-tip="关闭" onclick={() => (closed = true)}><Icon name="x" /></button>
  </div>
</div>
