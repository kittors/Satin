import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance } from "satin-ui";

@Component({
  selector: "demo-table-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  template: `
    <div #root>
      <div class="sn-tbl-wrap">
        <div class="sn-tbl-sc">
          <table class="sn-tbl" aria-label="项目列表">
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
              <tr>
                <td>
                  <b>雨夜车站</b>
                </td>
                <td>
                  <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span>
                </td>
                <td>
                  <span class="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td class="sn-r sn-num">48</td>
                <td class="sn-r sn-num">12:36</td>
              </tr>
              <tr>
                <td>
                  <b>海边的第七天</b>
                </td>
                <td>
                  <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span>
                </td>
                <td>
                  <span class="sn-tag sn-run"><i></i>生成中</span>
                </td>
                <td class="sn-r sn-num">32</td>
                <td class="sn-r sn-num">8:32</td>
              </tr>
              <tr>
                <td>
                  <b>城南旧事（第二版）</b>
                </td>
                <td>
                  <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:150">陈</span>陈默</span>
                </td>
                <td>
                  <span class="sn-tag "><i></i>草稿</span>
                </td>
                <td class="sn-r sn-num">12</td>
                <td class="sn-r sn-num">3:00</td>
              </tr>
              <tr>
                <td>
                  <b>长夜</b>
                </td>
                <td>
                  <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:280">许</span>许诺</span>
                </td>
                <td>
                  <span class="sn-tag sn-bad"><i></i>失败</span>
                </td>
                <td class="sn-r sn-num">20</td>
                <td class="sn-r sn-num">5:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`,
})
export class TableDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement);
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
