import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createFlow, type FlowNode } from "satin-ui/flow";

const nodes: FlowNode[] = [
  { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
  { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
  { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
  { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
  { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
  { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
  { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
  { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
  { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
];
const edges: [string, string][] = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k): [string, string][] => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];

@Component({
  selector: "demo-flow-branch",
  template: `<div #host></div>`,
})
export class FlowBranchComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createFlow(this.host().nativeElement, { nodes, edges });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
