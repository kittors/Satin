<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCount } from "satin-ui";

  // onChange 拿到新值；程序里改值用 update({ value })
  const options = { max: 8, value: "林夏", id: "role-name", onChange: (v) => console.log("角色名：", v) };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createCount，选项写在 options 里 -->
<Satin create={createCount} {options} />
