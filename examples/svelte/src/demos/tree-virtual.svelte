<script lang="ts">
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

  let host!: HTMLDivElement;
  $effect(() => {
    const it = createTree(host, {
      items,
      defaultExpanded: items.map((g) => g.id),
      searchable: true,
      virtual: true,
      height: 360,
    });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
