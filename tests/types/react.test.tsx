import { Button, Segmented, Slider, Field, Input, Checkbox, Dialog, Tabs, Text, toast } from "satin-ui/react";
import { useState } from "react";
export function Demo() {
  const [v, setV] = useState("网格"), [open, setOpen] = useState(false), [n, setN] = useState(40);
  return (
    <div>
      <Button variant="primary" onClick={() => setOpen(true)}>新建项目</Button>
      <Button icon="settings" tip="设置" variant="ghost" />
      <Segmented items={["网格", "列表"]} value={v} onChange={setV} />
      <Segmented items={["7 天", "30 天"]} defaultValue="7 天" size="sm" />
      <Slider value={n} max={100} onChange={setN} />
      <Field label="镜头标题" help="一句话说清"><Input placeholder="雨夜车站" size="lg" /></Field>
      <Checkbox label="自动保存" defaultChecked />
      <Tabs tabs={[{ label: "概览", content: "项目概览" }]} value={0} />
      <Text level="title1" tone="secondary">全部项目</Text>
      <Dialog open={open} onClose={() => setOpen(false)} title="新建项目" footer={<Button variant="primary" onClick={() => toast({ text: "已创建" })}>创建</Button>}>内容</Dialog>
      {/* @ts-expect-error 变体名写错要报错 */}
      <Button variant="primay">x</Button>
    </div>
  );
}

// 表格
import { Table } from "satin-ui/react";
const rows = [{ id: 1, name: "雨夜车站", shots: 48 }];
export const T1 = <Table columns={[{ key: "name", title: "项目", sortable: true }, { key: "shots", title: "镜头", align: "right", format: (v) => v + " 个" }]} rows={rows} selectable selected={[1]} onSelect={(k) => k.length} onSort={(s) => s?.dir} />;
// @ts-expect-error columns 必须给
export const T2 = <Table rows={rows} />;
// 数据驱动：树形（children）、受控展开、合并、拖行拖列、改宽、出错重试；render 返回 JSX；ref 拿实例
import { useRef } from "react";
import type { TableProps, TableColumnReact } from "satin-ui/react";
import type { SatinInstance, TableApi, TableSpan } from "satin-ui";
type Shot = { id: string; name: string; owner: string; shots: number; children?: Shot[] };
const tree: Shot[] = [{ id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [{ id: "p1.e1", name: "第 1 集", owner: "林夏", shots: 20 }] }];
const tcols: TableColumnReact<Shot>[] = [
  { key: "name", title: "项目", sortable: true, resizable: true, minWidth: 200, editable: true },
  { key: "owner", title: "负责人", width: 120, merge: true, render: (v) => <b>{v}</b> },
  { key: "shots", title: "镜头", align: "right", width: 80, sortFirst: "desc", merge: (a, b) => a.shots === b.shots },
  { key: "act", type: "actions", render: () => <button type="button">更多</button> },
];
const spans = (rs: Shot[]): TableSpan[] => rs.map((r, i) => ({ row: i, key: "name", colSpan: r.children ? 1 : 2 }));
export function TreeTable() {
  const ref = useRef<(SatinInstance & TableApi) | null>(null);
  const props: TableProps<Shot> = { columns: tcols, data: tree, expandedKeys: ["p1"], lines: "grid", spans, filter: (r) => r.shots > 0 };
  return (
    <Table {...props} ref={ref} draggableRows draggableColumns resizableRows cellSelect error="网络断了" onRetry={() => ref.current?.refresh()}
      onExpandChange={(e) => e.keys.length + Number(e.expanded)} onRowReorder={(e) => e.keys.join() + e.parentKey} onColumnReorder={(e) => e.keys.length}
      onColumnResize={(e) => e.width + e.widths[e.key]} onRowResize={(e) => e.height ?? 0} onCellEdit={(e) => String(e.value)} onLayout={(e) => e.rows.length}
      empty={({ filtered }) => (filtered ? "没有匹配的" : "还没有")} rowAttrs={(r, c) => ({ "data-lv": c.level, "data-name": r.name })} />
  );
}
// @ts-expect-error sortFirst 只能是 asc / desc
export const T3 = <Table columns={[{ key: "name", sortFirst: "up" }]} data={tree} />;

// 自己包重组件
import { wrapSatin } from "satin-ui/react";
import { createChat as createChat2 } from "satin-ui/chat";
const Chat = wrapSatin(createChat2, { events: [] });
export const chatEl = <Chat title="助手" placeholder="说点什么" />;

// 按钮的等待、成功、文字后的图标；日期选择；数据表格（子路径）；弹窗的图标、提交、底栏类名
import { DatePicker } from "satin-ui/react";
import { DataGrid } from "satin-ui/react/grid";
import type { DatePickerProps } from "satin-ui/react";
import type { PickDetail } from "satin-ui";
export function Demo2() {
  const [saving, setSaving] = useState(false), [due, setDue] = useState(""), [open, setOpen] = useState(false);
  const onPick = (d: PickDetail) => setDue(d.text);
  const props: DatePickerProps = { kind: "range", placeholder: "选择开始和结束日期", today: new Date(2026, 10, 19) };
  return (
    <div>
      <Button variant="primary" size="lg" loading={saving} done={!saving && due !== ""} onClick={() => setSaving(true)}>保存修改</Button>
      <Button iconAfter="arrow-right">下一步</Button>
      <DatePicker onChange={onPick} />
      <DatePicker kind="datetime" placeholder="选择发布时间" label="选择发布时间" now={new Date()} />
      <DatePicker {...props} />
      {/* @ts-expect-error 种类写错要报错 */}
      <DatePicker kind="week" />
      <DataGrid columns={[{ key: "name", title: "名称", sortable: true, editable: true }, { key: "status", title: "状态", type: "status", options: ["待开始", "进行中"], filter: "enum" }, { key: "shots", title: "镜头", type: "int", render: (v) => <b>{v}</b> }]}
        data={[{ id: 1, name: "雨夜车站", status: "进行中", shots: 12 }]} rowKey="id" selection="multiple" selectedKeys={[1]} onSelectionChange={(e) => void e.keys} sort={{ key: "shots", dir: -1 }} onSortChange={(s) => void s?.key}
        onCellEdit={(e) => void e.value} loading={false} emptyText="还没有镜头" label="镜头清单" />
      <DataGrid columns={[{ key: "name", title: "名称" }]} dataSource={{ total: 100000, load: async ({ start, end }) => ({ rows: [], total: end - start }) }} />
      {/* @ts-expect-error 列要有 key */}
      <DataGrid columns={[{ title: "名称" }]} data={[]} />
      <Dialog open={open} onClose={() => setOpen(false)} onSubmit={(e) => e.preventDefault()} icon="trash-2" title="删除项目？" footerClassName="sn-two" footer={<Button variant="danger" type="submit">删除</Button>} />
    </div>
  );
}
