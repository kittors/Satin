<script lang="ts">
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCount } from "satin-ui";

  // 写到 90% 变成提醒色，写满再敲时计数抖一下
  const options = { max: 20, placeholder: "一句话说清这个镜头", id: "shot-title", size: "lg" };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createCount，选项写在 options 里 -->
<Satin create={createCount} {options} />
