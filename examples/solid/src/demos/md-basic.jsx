import { onSettled } from "solid-js";
import { createMarkdown } from "satin-ui/markdown";

const MD = [
  "## 第三集 · 雨夜车站",
  "",
  "林夏在**最后一班车**开走前赶到站台，雨刚停。",
  "",
  "- [x] 原文拆成 12 个镜头",
  "- [ ] 配音、配乐",
  "",
  "> [!NOTE]",
  "> 第 9 个镜头换成近景，补一句旁白。",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 4 秒 |",
  "| 08 | 全景 | 6 秒 |",
  "",
  "```js title=shots.js",
  "export const shots = [{ id: 7, size: \"远景\", sec: 4 }];",
  "```",
].join("\n");

export default function Doc() {
  let host;
  // 标题、任务列表、提示块、表格、代码（高亮、行号、复制）都按设计稿排好；原文里的 HTML 只放行白名单；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createMarkdown(host, { source: MD });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
