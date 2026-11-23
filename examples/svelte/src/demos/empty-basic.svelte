<script>
  import EmptyArt from "satin-ui/svelte/EmptyArt.svelte";
  import Icon from "satin-ui/svelte/Icon.svelte";
</script>

<div class="sn-empty-state">
  <EmptyArt name="projects" />
  <h4>还没有项目</h4>
  <p>新建或导入原文即可开始。</p>
  <div class="sn-acts">
    <button type="button" class="sn-btn sn-primary"><Icon name="plus" />新建项目</button>
    <button type="button" class="sn-btn sn-secondary">导入原文</button>
  </div>
</div>
