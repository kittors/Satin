import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createComposer, toast } from "satin-ui";
import type { ComposerContextItem, ComposerMode, ComposerOption } from "satin-ui/components";

// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT: ComposerContextItem[] = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险；模型：名称 · 档位
const MODE: ComposerMode = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "full", label: "完全访问", tone: "warn" }], value: "read" };
const MODELS: ComposerOption[] = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
// 发送以后返回 Promise：按钮变成"停止"，结束回到可发送
const generate = ({ text }: { text: string }) => new Promise<void>((done) => setTimeout(() => { toast({ text: "已生成：" + text.slice(0, 12) }); done(); }, 2000));

@Component({
  selector: "demo-prompt-parts",
  template: `<div #host></div>`,
})
export class PromptPartsComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    // 模型用受控写法：选了别的发 modelChange；权限、上下文的菜单选了也有事件；渲染完再建（只在浏览器里跑），组件销毁时 destroy()
    afterNextRender(() => {
      const it = createComposer(this.host().nativeElement, { placeholder: "随心输入", send: "生成", context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
        onSend: generate, onModelChange: (v: string) => console.log("换了模型", v) });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
