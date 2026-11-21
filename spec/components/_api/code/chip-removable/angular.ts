import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { removeChip } from "satin-ui";

@Component({
  selector: "demo-chip-removable",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-enhance>
  template: `
    <sn-enhance>
      <div class="sn-row">
        @for (t of tags(); track t) {
          <span class="sn-chip sn-tag sn-on">{{ t }}<button type="button" class="sn-x" [attr.aria-label]="'移除 ' + t" data-i="x" (click)="remove($event, t)"></button></span>
        }
      </div>
    </sn-enhance>
  `,
})
export class ChipRemovableComponent {
  tags = signal(["雨夜", "车站", "列车"]);
  // 先播收起动画（keep：节点交给 Angular 删），放完再从列表里删
  remove(e: Event, t: string) {
    const chip = (e.currentTarget as HTMLElement).parentElement!;
    removeChip(chip, { keep: true, onRemoved: () => this.tags.update((x) => x.filter((y) => y !== t)) });
  }
}
