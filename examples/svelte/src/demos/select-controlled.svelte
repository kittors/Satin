<script>
  import Select from "satin-ui/svelte/Select.svelte";

  const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
  let ratio = $state("9:16 · 竖屏");
</script>

<div class="sn-stack sn-gap-8">
  <Select items={ratios} bind:value={ratio} label="画面比例" />
  <span class="sn-help">当前：{ratio}</span>
</div>
