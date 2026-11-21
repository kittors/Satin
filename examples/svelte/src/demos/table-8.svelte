<script>
  import { onMount } from "svelte";
  import { setup, enhance, createTable, toast } from "satin-ui";
  import "satin-ui/css/data.css";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      // 真数据的表格：createTable（React <Table>、Vue <SnTable>）——点表头排序（行移到新位置，相邻行错开 15ms）、勾选（全选、半选）、
      // 空状态、加载中（骨架行）、数字列右对齐等宽；斑马纹 / 紧凑 / 无外框 / 网格线 / 限高时表头固定都是选项。
      // 上面那张完整示例里的多级展开（行带 children）、合并、拖行拖列、改列宽行高也是选项，见下面的参数表。
      const data = [
        { id: 1, name: "雨夜车站", owner: "林夏", status: ["sn-ok", "已完成"], shots: 48 },
        { id: 2, name: "海边的第七天", owner: "周屿", status: ["sn-run", "生成中"], shots: 32 },
        { id: 3, name: "长夜", owner: "许诺", status: ["sn-bad", "失败"], shots: 20 },
      ];
      const table = createTable(root.querySelector("#projects"), {
        columns: [
          { key: "name", title: "项目", sortable: true },
          { key: "owner", title: "负责人" },
          { key: "status", title: "状态", html: ([tone, text]) => `<span class="sn-tag ${tone}"><i></i>${text}</span>` },
          { key: "shots", title: "镜头", align: "right", sortable: true },
        ],
        data, rowKey: "id", selectable: true, label: "项目列表", empty: "还没有项目",
        onSelect: (keys) => console.log("选中", keys),
        onRowClick: (row) => toast({ text: "打开「" + row.name + "」" }),
      });
      // 换数据：update({ data })；加载中显示骨架行：update({ loading: true })
      table.update({ data: [...data, { id: 4, name: "城南旧事", owner: "陈默", status: ["", "草稿"], shots: 12 }] });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div id="projects"></div>
</div>
