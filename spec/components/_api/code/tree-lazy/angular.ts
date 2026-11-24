import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTree, type TreeNode } from "satin-ui/tree";

const items: TreeNode[] = [
  { id: "lz-ep1", label: "第一集 · 远程素材库", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-ep2", label: "第二集 · 分镜渲染帧", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-retry", label: "历史归档（首次模拟失败可重试）", icon: "archive", badge: "重试演示", hasChildren: true },
];

@Component({
  selector: "demo-tree-lazy",
  template: `<div #host></div>`,
})
export class TreeLazyComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let failedOnce = false;
      const it = createTree(this.host().nativeElement, {
        items,
        height: 250,
        loadChildren: (node) => new Promise((resolve, reject) => {
          setTimeout(() => {
            if (node.id === "lz-retry" && !failedOnce) {
              failedOnce = true;
              reject(new Error("网络超时"));
              return;
            }
            resolve([
              { id: `${node.id}-1`, label: `${node.label.slice(0, 3)} · 远景机位.mov`, icon: "film", meta: "92 MB" },
              { id: `${node.id}-2`, label: `${node.label.slice(0, 3)} · 场记单.md`, icon: "file-text", meta: "14 KB" },
              { id: `${node.id}-3`, label: "子目录 · 精修帧", icon: "folder", hasChildren: true },
            ]);
          }, 280);
        }),
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
