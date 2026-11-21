"use client"; // 用到了 useState
import { useState } from "react";
import { Button, Field, Input, Segmented, toast } from "satin-ui/react";

const VIEWS = ["网格", "列表", "时间线"];

// 起步页：页头 + 一张面板（名称、默认视图、创建按钮）。satin-ui/react 的组件服务端输出完整标记，水合以后接上交互
export default function NewProject() {
  const [name, setName] = useState("");
  const [view, setView] = useState(VIEWS[0]);
  const create = () => toast({ text: `已创建「${name.trim() || "未命名项目"}」，默认视图：${view}` });
  return (
    <main className="sn-page sn-narrow">
      <header className="sn-page-hd">
        <div>
          <h1>新建项目</h1>
          <p>起个名字、选一种默认视图，就能开始。</p>
        </div>
      </header>
      <section className="sn-panel sn-stack sn-gap-20">
        <Field label="项目名称" htmlFor="p-name" help="之后在项目设置里还能改。">
          <Input id="p-name" placeholder="比如：春季新品发布" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="sn-field">
          <span className="sn-lbl">默认视图</span>
          <Segmented items={VIEWS} value={view} onChange={setView} label="默认视图" />
        </div>
        <div className="sn-row">
          <Button variant="primary" onClick={create}>创建项目</Button>
        </div>
      </section>
    </main>
  );
}
