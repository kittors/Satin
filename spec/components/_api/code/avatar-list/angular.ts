import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "demo-avatar-list",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-avatar>
  template: `<div class="sn-set-list">
    @for (p of people; track p.name) {
      <div class="sn-set-row">
        <sn-avatar [attr.name]="p.name" [attr.src]="p.src ?? null" [attr.status]="p.online ? 'online' : null" decorative></sn-avatar>
        <div class="sn-tx"><b>{{ p.name }}</b><span>{{ p.role }}</span></div>
      </div>
    }
  </div>`,
})
export class AvatarListComponent {
  protected people: { name: string; role: string; src?: string; online?: boolean }[] = [
    { name: "何慧", role: "前端开发", online: true },
    { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
    { name: "徐丽", role: "财务顾问" },
  ];
}
