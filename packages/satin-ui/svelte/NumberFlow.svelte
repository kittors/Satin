<!--
  数字滚动：<NumberFlow value={count} style="roll" />（value 变了数字滚过去）
  · bind:instance 拿到 Satin 实例
-->
<script>
  import Satin from "./Satin.svelte";
  import { createNumberFlow } from "../src/components.js";

  let { value, style, format, instance = $bindable(null), ...rest } = $props();
</script>

<Satin create={createNumberFlow} options={{ value, style, format }} bind:instance {...rest} />
