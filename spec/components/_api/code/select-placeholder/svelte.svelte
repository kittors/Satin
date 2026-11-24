<script lang="ts">
  import Select from "satin-ui/svelte/Select.svelte";

  const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
  let ratio = $state();
</script>

<Select items={ratios} bind:value={ratio} placeholder="选择画面比例" label="画面比例" />
