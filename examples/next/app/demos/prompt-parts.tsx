"use client";
import { useState } from "react";
import { Composer, toast, type ComposerMode } from "satin-ui/react";

// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险；模型：名称 · 档位
const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
// 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
const generate = ({ text: _text }: { text: string }) => new Promise<void>((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

export default function PromptParts() {
  const [model, setModel] = useState("fine");
  // 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件
  return <Composer placeholder="随心输入" send="生成" context={CONTEXT} mode={MODE} models={MODELS} model={model} onModelChange={setModel} onSend={generate} />;
}
