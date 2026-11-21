<!--
  数据表格（十万行，satin-ui/grid 的 createDataGrid）：<DataGrid rows={100000} seed={11} label="镜头清单" />
  import DataGrid from "satin-ui/svelte/DataGrid.svelte"（重组件：只有引了它才会载进 satin-ui/grid）
  · 服务端输出和第一帧一样的标记（工具条、表头、空表体），挂上以后在后台线程里生成数据、只渲染看得见的行；卸载时撤掉后台线程和放进 <head> 的样式
  · rows、seed、label 只在创建时用：变了就换一张新表（{#key}），不用自己处理；bind:instance 拿到 Satin 实例
-->
<script>
  import Satin from "./Satin.svelte";
  import { createDataGrid } from "../src/grid.js";

  let { rows, seed, label, instance = $bindable(null), ...rest } = $props();
</script>

{#key `${rows ?? ""}|${seed ?? ""}|${label ?? ""}`}
  <Satin create={createDataGrid} options={{ rows, seed, label }} bind:instance {...rest} />
{/key}
