import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTree, type TreeNode } from "satin-ui/tree";

const items: TreeNode[] = Array.from({ length: 100 }, (_, g) => ({
  id: `vg-${g}`,
  label: `第 ${String(g + 1).padStart(3, "0")} 场 · 分镜序列`,
  icon: "folder",
  meta: "100 镜",
  children: Array.from({ length: 100 }, (_, i) => ({
    id: `vn-${g}-${i}`,
    label: `镜头 ${String(g + 1).padStart(3, "0")}-${String(i + 1).padStart(2, "0")} · ${i % 3 === 0 ? "定调帧.png" : i % 3 === 1 ? "运镜.mov" : "台词.md"}`,
    icon: i % 3 === 0 ? "image" : i % 3 === 1 ? "film" : "file-text",
    meta: `${((g * 7 + i * 3) % 48) + 2}.4 MB`,
  })),
}));

@Component({
  selector: "demo-tree-virtual",
  template: `<div #host></div>`,
})
export class TreeVirtualComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const it = createTree(this.host().nativeElement, {
        items,
        defaultExpanded: items.map((g) => g.id),
        searchable: true,
        virtual: true,
        height: 360,
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
