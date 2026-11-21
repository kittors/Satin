<script>
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="通知，3 条未读" aria-label="通知，3 条未读"><Icon name="bell" /><span class="sn-count">3</span></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="评论，有新回复" aria-label="评论，有新回复"><Icon name="message-circle" /><span class="sn-dot"></span></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn sn-is-disabled" aria-disabled="true" data-tip="还没有可以下载的成片" aria-label="还没有可以下载的成片"><Icon name="download" /></button>
</div>
