import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-card-variants",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sn-enhance>
      <div class="sn-pcards" style="--sn-card-min:196px">
        <div class="sn-card"><div class="sn-card-hd"><div class="sn-card-titles"><b>默认实面</b><span class="sn-card-sub">--sn-raised + 轻托影</span></div></div><div class="sn-card-bd">最通用，落于画布底层次分明。</div></div>
        <div class="sn-card sn-bordered"><div class="sn-card-hd"><div class="sn-card-titles"><b>清晰描边</b><span class="sn-card-sub">.sn-bordered</span></div></div><div class="sn-card-bd">明确 1px 实体边框，放纯白底也清晰。</div></div>
        <div class="sn-card sn-subtle"><div class="sn-card-hd"><div class="sn-card-titles"><b>柔灰填充</b><span class="sn-card-sub">.sn-subtle</span></div></div><div class="sn-card-bd">低对比柔和灰底，适合次要辅助信息。</div></div>
        <div class="sn-card sn-dashed sn-interactive" tabindex="0"><div class="sn-card-hd"><div class="sn-card-titles"><b>虚线槽位</b><span class="sn-card-sub">.sn-dashed</span></div><span data-i="plus"></span></div><div class="sn-card-bd">适合新建项目或拖放上传入口。</div></div>
        <div class="sn-card sn-ghost sn-interactive" tabindex="0"><div class="sn-card-hd"><div class="sn-card-titles"><b>极简无框</b><span class="sn-card-sub">.sn-ghost</span></div></div><div class="sn-card-bd">平时无底无框，悬停时浮出轻柔底面。</div></div>
        <div class="sn-card sn-interactive" tabindex="0" style="--sn-card-bw:1.5px;--sn-card-bd:var(--sn-accent);--sn-card-r:16px"><div class="sn-card-hd"><div class="sn-card-titles"><b>自定义变量</b><span class="sn-card-sub">1.5px 边框 · 16px 圆角</span></div></div><div class="sn-card-bd">用 --sn-card-bw / bd / r / bg 随心定制。</div></div>
      </div>
    </sn-enhance>
  `,
})
export class CardVariantsComponent {}
