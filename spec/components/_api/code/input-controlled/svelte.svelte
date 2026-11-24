<script lang="ts">
  let name = $state("雨夜车站");
</script>

<div class="sn-stack sn-gap-8">
  <input class="sn-input" bind:value={name} aria-invalid={name.length > 12 ? "true" : undefined} aria-label="项目名称" />
  <span class="sn-help">{name.length} / 12 个字</span>
</div>
