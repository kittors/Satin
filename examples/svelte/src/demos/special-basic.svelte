<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createSearch } from "satin-ui";
  const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];

  // 空着时显示快捷键 /，一输入换成清除按钮
  const options = {
    placeholder: "搜索镜头",
    label: "搜索镜头",
    // search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
    search: (q) => SHOTS.filter((s) => s.includes(q)).length,
  };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createSearch，选项写在 options 里 -->
<Satin create={createSearch} {options} />
