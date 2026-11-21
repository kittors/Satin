import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";
import "satin-ui/css/grid.css";
import "satin-ui/css/data.css";

export default function GridDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      (async () => {
        const STATUS = ["待开始", "生成中", "审核中", "已完成", "已暂停"];
        const OWNERS = ["林夏", "周屿", "沈一", "许棠", "陈默", "顾北"];
        const TAGS = ["电影感", "动画", "纪录", "广告", "MV", "短剧"];
        const SCENES = ["雨夜车站", "候车厅", "站台", "列车上", "终点站", "海边", "旧城区", "天台"];

        // 列：key 取行里的哪个字段；type 选内置的显示；pinned 固定在左 / 右；sortable 点表头排序；filter 列头筛选；editable 双击编辑
        const columns = [
          { key: "sel", type: "sel", width: 64, pinned: "left" },
          { key: "name", title: "名称", width: 200, pinned: "left", primary: true, sortable: true, editable: true },
          { key: "status", title: "状态", type: "status", width: 116, options: STATUS, sortable: true, filter: "enum", editable: true },
          { key: "owner", title: "负责人", type: "owner", width: 124, options: OWNERS, sortable: true, filter: "enum" },
          { key: "tag", title: "类型", type: "tag", width: 100, options: TAGS, filter: "enum" },
          { key: "shots", title: "镜头", type: "int", width: 88, sortable: true, editable: true, min: 1, max: 999 },
          { key: "dur", title: "时长", type: "dur", width: 96, sortable: true, filter: "range" },
          { key: "prog", title: "进度", type: "prog", width: 148, sortable: true },
          { key: "act", type: "act", width: 80, pinned: "right" },
        ];

        // 假的服务端：十万行，按搜索词、列头筛选、排序算好，切出 [start, end) 这一段（真的项目里换成 fetch）
        const all = Array.from({ length: 100000 }, (_, i) => {
          const h = Math.imul(i + 1, 2654435761) >>> 0, s = h % 5; // 按行号算出看起来随机的值
          return { id: i + 1, name: `${SCENES[i % 8]} ${i + 1}`, status: STATUS[s], owner: OWNERS[(h >>> 4) % 6], tag: TAGS[(h >>> 8) % 6],
            shots: 4 + ((h >>> 12) % 120), dur: 15 + ((h >>> 16) % 1800), prog: s === 3 ? 100 : s === 0 ? 0 : 1 + ((h >>> 20) % 98) };
        });
        let last = "", found = all;
        function query({ sort, filter }) {
          const key = JSON.stringify([sort, filter]);
          if (key === last) return found;
          last = key;
          const q = filter.q?.trim();
          found = all.filter((r) => (!q || r.name.includes(q)) && Object.entries(filter).every(([k, v]) =>
            k === "q" || v == null || (Array.isArray(v) ? !v.length || v.includes(r[k]) : (v.min == null || r[k] >= v.min) && (v.max == null || r[k] <= v.max))));
          if (sort) found.sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) * sort.dir);
          return found;
        }

        // 空容器：工具条、表头、表体都由 createDataGrid 填好。表格按块要（一块 100 行），滚到哪要到哪，还没到的行显示占位条
        const grid = createDataGrid(root.querySelector("#grid"), {
          columns, rowKey: "id", label: "项目列表，十万行",
          dataSource: {
            total: all.length,
            async load({ start, end, sort, filter }) {
              await new Promise((r) => setTimeout(r, 200)); // 模拟网络
              const rows = query({ sort, filter });
              return { rows: rows.slice(start, end), total: rows.length };
            },
          },
          onCellEdit: ({ rowKey, key, value }) => { all[rowKey - 1][key] = value; }, // 存到服务端
          onRowAction: ({ action, row }) => console.log(action, row.name), // 行末的"更多"
        });
        // 卸载时调 grid.destroy()
      })();
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="grid"></div>
    </div>
  );
}
