import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-list-basic",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-set-list">
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="user"></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="layout-grid"></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="key-round"></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico" data-i="log-out"></span><div class="sn-tx"><b>退出登录</b></div></div>
      </div>
    </sn-enhance>
  `,
})
export class ListBasicComponent {}
