"use client";
import { Composer, toast } from "satin-ui/react";

// 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
const generate = ({ text }) => new Promise((done) => setTimeout(() => { toast({ text: "已生成：" + text.slice(0, 12) }); done(); }, 2000));

export default function ScenePrompt() {
  return <Composer placeholder="描述你想要的画面，比如：雨夜，林夏站在空荡的站台上" max={300} send="生成" onSend={generate} />;
}
