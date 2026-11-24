<script lang="ts">
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createEmail } from "satin-ui";

  // 格式对了右边的对勾一笔画出来
  const options = { label: "通知邮箱", placeholder: "name@example.com", id: "notify-email" };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createEmail，选项写在 options 里 -->
<Satin create={createEmail} {options} />
