import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";
import { createChat } from "satin-ui/chat";

@Component({
  selector: "demo-chat",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-page sn-wide" style="height: 100dvh; padding-block: var(--sn-sp-16)">
        <div id="chat" style="height: 100%"></div>
      </div>
    </div>`,
})
export class ChatComponent {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
      (async () => {
        // 空容器：createChat 按选项填好标记（顶栏、消息区、底部输入框都接好了）。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
        createChat(root.querySelector("#chat"), {
          title: "分镜助手", placeholder: "和分镜助手一起改这一集",
          async *respond(text) {
            const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
            const reader = res.body.getReader(), dec = new TextDecoder();
            for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
          },
        });
      })();
    });
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
