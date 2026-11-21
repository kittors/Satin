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
export const T1 = <Table columns={[{ key: "name", title: "项目", sortable: true }, { key: "shots", title: "镜头", align: "right", format: (v) => v + " 个" }]} rows={rows} selectable selected={[1]} onSelect={(k) => k.length} onSort={(s) => s.dir} />;
// @ts-expect-error columns 必须给
export const T2 = <Table rows={rows} />;

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
      <DataGrid rows={2000} seed={7} label="镜头清单" />
      {/* @ts-expect-error rows 是数字 */}
      <DataGrid rows="2000" />
      <Dialog open={open} onClose={() => setOpen(false)} onSubmit={(e) => e.preventDefault()} icon="trash-2" title="删除项目？" footerClassName="sn-two" footer={<Button variant="danger" type="submit">删除</Button>} />
    </div>
  );
}
