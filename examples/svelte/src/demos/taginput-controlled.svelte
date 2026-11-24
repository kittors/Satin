<script lang="ts">
  import TagInput from "satin-ui/svelte/TagInput.svelte";

  let tags = $state(["悬疑", "长镜头"]);
</script>

<div class="sn-stack sn-gap-8">
  <TagInput max={5} placeholder="输入关键词，回车确认" bind:tags={tags} />
  <span class="sn-help">已添加 {tags.length} / 5 个</span>
</div>
