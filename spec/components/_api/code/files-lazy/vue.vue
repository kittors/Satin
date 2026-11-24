<script setup lang="ts">
import { FileExplorer, type FileNode } from "satin-ui/vue/tree";

const items: FileNode[] = [
  { id: "rm-farm", name: "云端渲染农场（点击展开懒加载 240 帧）", kind: "folder", hasChildren: true, updated: "同步中" },
  {
    id: "rm-local", name: "本地工作目录", kind: "folder", updated: "今天",
    children: [
      { id: "rm-l1", name: "定调参考.png", kind: "image", size: "3.2 MB", updated: "今天" },
      { id: "rm-l2", name: "镜头清单.md", kind: "doc", size: "16 KB", updated: "今天" },
    ],
  },
];

const loadChildren = (node: FileNode): Promise<FileNode[]> => new Promise((resolve) => {
  setTimeout(() => {
    resolve(Array.from({ length: 240 }, (_, i) => ({
      id: `${node.id}-f-${i}`,
      name: `shot_${String(i + 1).padStart(4, "0")}.${i % 2 === 0 ? "exr" : "mov"}`,
      kind: i % 2 === 0 ? "image" : "video",
      size: `${(i % 19) + 4}.2 MB`,
      updated: "刚刚",
    })));
  }, 260);
});
</script>

<template>
  <FileExplorer :items="items" view="tree" root-name="云端资产库" :height="340" :load-children="loadChildren" />
</template>
