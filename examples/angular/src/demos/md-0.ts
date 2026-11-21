import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { renderMarkdown } from "satin-ui/markdown";

@Component({
  selector: "demo-md-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <article id="doc"></article>
    </div>`,
})
export class MdDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      const source = `# 分镜生成说明

把**一集剧本**拆成镜头，每个镜头写清楚景别、时长和画面。
相关接口见 [接口文档](https://example.com/api)。

> [!NOTE]
> 时长按 24 帧算：第 $n$ 帧的时间是 $t = \\frac{n}{24}$ 秒。

## 镜头清单

| 镜头 | 景别 | 时长 | 状态 |
| :-- | :-: | --: | :-- |
| 07 · 车站外，雨刚停 | 远景 | 4 秒 | 已完成 |
| 08 · 林夏走进候车厅 | 全景 | 6 秒 | 生成中 |

## 生成前检查

- [x] 角色设定图已经上传
- [x] 每个镜头都有景别和时长
- [ ] 背景音乐的节拍对齐到镜头切换

\`\`\`js
const shots = await generateShots(list, { retry: 3 });
console.log(timeline(shots, 24));
\`\`\`

![雨夜的车站](https://images.unsplash.com/photo-1541702467897-41915a07d3a7?w=1200&h=675)

<details><summary>能写 HTML</summary>按 <kbd>⌘</kbd> <kbd>K</kbd> 打开命令面板。</details>`;

      // 渲染进容器：标题、列表、任务、表格、代码（高亮、行号、复制、折叠）、图片、视频、音频、HTML 都认
      const doc = renderMarkdown(root.querySelector("#doc"), source, {
        codeMax: 240,  // 代码块超过 240px 折叠，0 = 不折叠
        imgH: 220,     // 图片统一高度，"auto" = 原比例
        tableMax: 0,   // 表格最高，超出在框里滚，0 = 不限
      });

      // 内容变了（比如 AI 流式回复）：整篇重渲染，滚动位置不跳
      doc.update(source + "\n\n## 新的一节");
      // 改选项：只改样式，不重渲染
      doc.set({ codeMax: 0 });
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
