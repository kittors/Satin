<script lang="ts">
  import Select from "satin-ui/svelte/Select.svelte";

  const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
  let current = $state("16:9 · 横屏");
</script>

<div class="sn-stack sn-gap-8">
  <!-- 只给 value：组件自己管选中；onchange 拿到选中的值 -->
  <Select items={ratios} value="16:9 · 横屏" label="画面比例" onchange={(v) => (current = v)} />
  <span class="sn-help">当前：{current}</span>
</div>
