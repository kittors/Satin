<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createCanvasGrid } from "satin-ui/canvas-grid";

  const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
  // 第 i 行（假的服务端按行号算出来；真的项目里换成 fetch，按 start、end 返回这一段）
  const rowAt = (i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 });
  // 一百万行在服务端：表格按块要（一块 200 行），滚到哪要到哪；还没到的行画占位条
  const dataSource = {
    total: 1000000,
    async load({ start, end }) {
      await new Promise((r) => setTimeout(r, 200));
      return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
    },
  };
  const columns = [
    { key: "name", title: "名称", width: 200 },
    { key: "shots", title: "镜头", type: "int", width: 96 },
    { key: "dur", title: "时长", type: "dur", width: 96 },
  ];
</script>

<!-- 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable -->
<Satin create={createCanvasGrid} options={{ columns, dataSource, toolbar: false, label: "一百万个镜头" }} />
