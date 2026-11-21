import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-table-7",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-tbl-wrap">
        <div class="sn-tbl-sc">
          <table class="sn-tbl" aria-label="正在加载" aria-busy="true">
            <thead>
              <tr>
                <th>项目</th>
                <th>负责人</th>
                <th>状态</th>
                <th class="sn-r">镜头</th>
                <th class="sn-r">时长</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sn-tbl-sk">
                <td>
                  <i class="sn-sk" style="width:60%"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:48px"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:56px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:24px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:36px"></i>
                </td>
              </tr>
              <tr class="sn-tbl-sk">
                <td>
                  <i class="sn-sk" style="width:60%"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:48px"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:56px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:24px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:36px"></i>
                </td>
              </tr>
              <tr class="sn-tbl-sk">
                <td>
                  <i class="sn-sk" style="width:60%"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:48px"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:56px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:24px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:36px"></i>
                </td>
              </tr>
              <tr class="sn-tbl-sk">
                <td>
                  <i class="sn-sk" style="width:60%"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:48px"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:56px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:24px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:36px"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`,
})
export class TableDemo7Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
