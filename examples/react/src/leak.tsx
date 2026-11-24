// 泄漏测试页（scripts/test/framework-leaks.mjs 用）：StrictMode 下反复切"路由"（示例页 ↔ 表格 + 弹窗页）、条件渲染整页挂上卸下，
// 卸下以后活着的监听、观察器、定时器、脱离文档的节点要回到起点
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import "satin-ui/css/page.css";
import "../../shared/sink.css";
import Sink from "./App";
import { Table, Dialog, Button, Tabs, Pager } from "satin-ui/react";

declare global {
  interface Window {
    __set?: (v?: string, s?: boolean) => void;
    __ready?: boolean;
  }
}

const ROWS = [{ id: 1, name: "雨夜车站", shots: 48 }, { id: 2, name: "长夜", shots: 20 }, { id: 3, name: "海边的第七天", shots: 32 }];
function Other() {
  const [open, setOpen] = useState(true), [page, setPage] = useState(1);
  return (
    <main className="sink">
      <Table columns={[{ key: "name", title: "项目", sortable: true }, { key: "shots", title: "镜头", align: "right", sortable: true }]} rows={ROWS} selectable />
      <Tabs tabs={[{ label: "概览", content: "概览" }, { label: "镜头", content: "镜头" }]} defaultValue={0} />
      <Pager total={5} page={page} onChange={setPage} />
      <Button variant="primary" onClick={() => setOpen(true)}>打开弹窗</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="新建项目" footer={<Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>}>弹窗里的内容</Dialog>
    </main>
  );
}
function Root() {
  const [view, setView] = useState("sink"), [show, setShow] = useState(true);
  window.__set = (v, s) => flushSync(() => { if (v) setView(v); if (s !== undefined) setShow(s); });
  return show ? (view === "sink" ? <Sink /> : <Other />) : null;
}
createRoot(document.getElementById("root")!).render(<StrictMode><Root /></StrictMode>);
window.__ready = true;
