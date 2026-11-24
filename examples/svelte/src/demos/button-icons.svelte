<script lang="ts">
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-primary"><Icon name="plus" />新建项目</button>
  <button type="button" class="sn-btn sn-secondary">下一步<Icon name="arrow-right" class="sn-after" /></button>
  <!-- 只有图标：data-tip 和 aria-label 都要写 -->
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="设置" aria-label="设置"><Icon name="settings" /></button>
  <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-tip="网格视图" aria-label="网格视图"><Icon name="layout-grid" /></button>
</div>
