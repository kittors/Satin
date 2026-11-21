<script>
  import Select from "satin-ui/svelte/Select.svelte";

  const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
  let ratio = $state("16:9 · 横屏");
</script>

<div class="sn-field">
  <span class="sn-lbl">画面比例</span>
  <Select items={ratios} bind:value={ratio} label="画面比例" />
  <div class="sn-help">导出成片时用这个比例。</div>
</div>
