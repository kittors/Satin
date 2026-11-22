import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-list-kv",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `
    <dl class="sn-kv">
      <dt>项目</dt><dd>雨夜车站</dd>
      <dt>负责人</dt><dd><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar>林夏</dd>
      <dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd>
      <dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd>
      <dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd>
    </dl>
  `,
})
export class ListKvComponent {}
