<script lang="ts">
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createPassword } from "satin-ui";

  // meter：强度条依次点亮；大写锁定打开时下面展开提示
  const options = { label: "设置密码", placeholder: "至少 8 位，字母加数字更安全", meter: true, id: "new-pw" };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createPassword，选项写在 options 里 -->
<Satin create={createPassword} {options} />
