import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

// 菜单按钮：标记照设计稿写，<sn-enhance> 接上交互（选了就收起，按钮文字换成 前缀 + 选中项）
@Component({
  selector: "demo-select-menu",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-select">
        <button type="button" class="sn-btn sn-secondary" data-menubtn data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
        <div class="sn-menu" role="menu">
          <div class="sn-item sn-sel" data-i="check:chk">最近更新</div>
          <div class="sn-item" data-i="check:chk">名称</div>
          <div class="sn-item" data-i="check:chk">创建时间</div>
        </div>
      </div>
    </sn-enhance>
  `,
})
export class SelectMenuComponent {}
