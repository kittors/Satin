<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createLongText } from "satin-ui";

  // 随内容长高、用量环；⌘↵ 调 onSubmit
  const options = {
    max: 120,
    maxLines: 7,
    placeholder: "写清楚人物、动作和光线，生成会更准。可以一直往下写，框会跟着长高。",
    label: "画面描述",
    onSubmit: (text) => console.log("保存：", text),
  };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createLongText，选项写在 options 里 -->
<Satin create={createLongText} {options} />
