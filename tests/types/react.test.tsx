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
