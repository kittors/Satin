<script>
  import Select from "satin-ui/svelte/Select.svelte";

  const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
  let ratio = $state("16:9 · 横屏");
</script>

<Select items={ratios} bind:value={ratio} label="画面比例" />
