<script lang="ts">
  import { createTable, type TableColumn } from "satin-ui";
  const COLUMNS: TableColumn[] = [
    { key: "name", title: "镜头", sortable: true },
    { key: "type", title: "景别" },
    { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
    { key: "owner", title: "负责人" },
  ];
  const ROWS = [
    { id: 1, name: "站台远景", type: "远景", dur: 6, owner: "林夏" },
    { id: 2, name: "雨里的车灯", type: "近景", dur: 3, owner: "周屿" },
    { id: 3, name: "推门进候车厅", type: "中景", dur: 5, owner: "林夏" },
    { id: 4, name: "末班列车", type: "全景", dur: 8, owner: "陈默" },
  ];

  // selectable：最左边一列勾选框；勾选后底部浮出批量操作条；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createTable(host, { columns: COLUMNS, data: ROWS, selectable: true, selected: [1], label: "镜头清单", onSelect: (keys) => console.log("勾上了：", keys) });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
