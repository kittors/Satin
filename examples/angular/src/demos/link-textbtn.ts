import { Component } from "@angular/core";

@Component({
  selector: "demo-link-textbtn",
  template: `
    <div class="sn-row">
      <button type="button" class="sn-textbtn">编辑</button>
      <button type="button" class="sn-textbtn sn-quiet">取消</button>
      <button type="button" class="sn-textbtn sn-quiet">忘记密码？</button>
      <button type="button" class="sn-textbtn sn-danger-text">删除草稿</button>
    </div>
  `,
})
export class LinkTextbtnComponent {}
