<!--
  折叠面板：<Collapse items={[{ title: "…", content: "…" }]} single open={[0]} ontoggle={(e) => …} />
  · bind:instance 拿到 Satin 实例
-->
<script>
  import Satin from "./Satin.svelte";
  import { createCollapse } from "../src/components.js";

  let { items, single, open, ontoggle, instance = $bindable(null), ...rest } = $props();
</script>

<Satin create={createCollapse} options={{ items, single, open, onToggle: (v) => ontoggle?.(v) }} bind:instance {...rest} />
