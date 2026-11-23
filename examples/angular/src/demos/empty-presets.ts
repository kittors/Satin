import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-empty-presets",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="sn-empty-presets">
      <div class="sn-empty-preset"><sn-empty-art name="projects"></sn-empty-art><b>首次使用</b><code>projects</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="search"></sn-empty-art><b>筛选无结果</b><code>search</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="error"></sn-empty-art><b>加载失败</b><code>error</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="inbox"></sn-empty-art><b>空收件箱</b><code>inbox</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="folder"></sn-empty-art><b>空文件夹</b><code>folder</code></div>
      <div class="sn-empty-preset"><sn-empty-art name="lock"></sn-empty-art><b>暂无权限</b><code>lock</code></div>
    </div>
  `,
})
export class EmptyPresetsComponent {}
