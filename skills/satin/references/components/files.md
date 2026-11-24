# 文件管理 · FileExplorer

> 组件 id：`files`　分组：数据展示

面向创作与工程资产管理的文件工作台：支持文件卡片、列表、树形列表三视图丝滑切换，全面复用 Satin `ScrollArea` 悬浮细滚动条、`openMenu` 右键菜单与二级子菜单、`initSeg` 流体分段控件与 `toast` 撤销提示，严守极少间隔线去 AI 味原则。精巧高密度卡片完整覆盖 PDF、Word、PPT、Vue、TSX、TXT 微缩正文小字、高清图片小图与视频首帧画面；拟物折叠文件夹按真实子项动态探出 0～3 张微缩内容纸片，拖拽悬停前盖弹性掀开、松手吸入回弹并立即增多对应内容，支持双击进入、面包屑拖回上级、右键新建/行内重命名/复制/移动/删除与撤销。

**全功能文件管理与高度拟物折叠文件夹工作台：支持卡片、列表、树形列表三视图丝滑切换；文件夹按真实子文件内容实时呈现 0～3 张微缩内容纸叠，拖拽文件悬停时前盖弹性掀开、松手吸入回弹并立即多出对应纸片与计数；完整涵盖双击进入、面包屑拖拽移回上级、右键菜单（新建、行内重命名、复制、二级「移动到 ›」子菜单、删除与撤销）、搜索、排序、多选与虚拟化树形大目录。**

## 什么时候用

- 素材库、云盘目录、项目资产与分镜文件管理，需要直观拖拽归类与多视图切换的场景。

## 什么时候别用

- 只需要轻量层级大纲或勾选目录：用树形控件。（换成 `tree`）
- 只需要把本地文件拖进页面上传：用上传组件。（换成 `upload`）

## 相近的组件

- `tree`：树形控件专注纯层级展示、三态勾选与万级虚拟树；文件管理提供卡片/列表/树形三视图与完整文件操作。
- `ctxmenu`：文件管理内置右键菜单与二级移动子菜单，直接复用 Satin 浮层与安全三角区引擎。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createFileExplorer } from "satin-ui/tree";` |
| React | `import { FileExplorer } from "satin-ui/react/tree";` |
| Vue | `import { FileExplorer } from "satin-ui/vue/tree";` |
| Svelte | `import { createFileExplorer } from "satin-ui/tree";` |
| Angular | `import { createFileExplorer } from "satin-ui/tree";` |
| Solid | `import { createFileExplorer } from "satin-ui/tree";` |
| Preact | `import { FileExplorer } from "satin-ui/react/tree"; // 经 preact/compat` |

- React：`<FileExplorer items view="card" rootName="雨夜车站" />`，从 `satin-ui/react/tree` 引入；ref 拿到 setView、openFolder、moveItems、undo 等方法。
- Preact：经 preact/compat 引入 `satin-ui/react/tree` 的 `FileExplorer`。
- Vue：`<FileExplorer :items view="card" rootName="雨夜车站" />`，从 `satin-ui/vue/tree` 引入。
- Svelte：在 `$effect` 中调用 `createFileExplorer(el, opts)`（来自 `satin-ui/tree`），清理函数中调用 `destroy()`。
- Angular：在 `afterNextRender` 中调用 `createFileExplorer(el, opts)`，`DestroyRef.onDestroy` 里调用 `destroy()`。
- Solid：在 `onSettled` 中调用 `createFileExplorer(el, opts)`，返回清理函数调用 `destroy()`。
- 纯 HTML：传入空容器 `createFileExplorer(el, { items, view: "card", rootName })` 即可渲染完整文件工作台。

## 示例（由浅入深）

### 拟物文件夹与全交互工作台

体验通透实体拖拽移入拟物文件夹（悬停掀盖、吸入合盖并插进最前排新纸片）、轻点文件夹直接进入、空白处或卡片旁长按拖拉框选多选、右键菜单（新建/重命名/换色/移动/删除与撤销），以及卡片/列表/树形三视图切换。

```html
<div id="files-basic"></div>
```

纯 HTML 的写法：

```html
<div id="files-basic"></div>

<script type="module">
  import { createFileExplorer } from "satin-ui/tree";
  const IMG_PLAZA = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80";
  const IMG_HALL = "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=320&h=220&q=80";
  const IMG_TRACK = "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=220&q=80";
  const items = [
    {
      id: "f-shots", name: "镜头分镜", kind: "folder", color: "blue", updated: "10 分钟前",
      children: [
        { id: "fs-1", name: "镜01-站前广场.png", kind: "image", size: "3.8 MB", preview: IMG_PLAZA, updated: "今天 14:20" },
        { id: "fs-2", name: "镜04-站台长镜.mov", kind: "video", size: "64.2 MB", preview: IMG_TRACK, duration: "01:36", updated: "今天 13:50" },
        { id: "fs-3", name: "布光参数表.pdf", kind: "pdf", size: "2.1 MB", pages: 8, updated: "今天 11:08" },
      ],
    },
    {
      id: "f-docs", name: "项目文档", kind: "folder", color: "amber", updated: "2 小时前",
      children: [
        { id: "fd-1", name: "需求规格书.docx", kind: "word", size: "148 KB", updated: "昨天" },
        { id: "fd-2", name: "视觉定调提案.pptx", kind: "ppt", size: "9.4 MB", pages: 18, updated: "昨天" },
        { id: "d-bgm", name: "钢琴雨夜变奏.wav", kind: "audio", size: "19.2 MB", duration: "03:12", updated: "昨天" },
      ],
    },
    {
      id: "f-code", name: "前端源码", kind: "folder", color: "sage", updated: "昨天",
      children: [
        { id: "fc-1", name: "FolderCard.vue", kind: "vue", size: "4.8 KB", updated: "昨天" },
        { id: "fc-2", name: "TreeEngine.tsx", kind: "tsx", size: "7.2 KB", updated: "昨天" },
      ],
    },
    { id: "f-inbox", name: "待整理素材", kind: "folder", updated: "刚刚", children: [] },
    { id: "d-pdf", name: "雨夜布光手册.pdf", kind: "pdf", size: "4.2 MB", pages: 16, excerpt: "5200K 冷雨积水反射控制与 3400K 暖色顶灯过渡比例规范。", updated: "刚刚" },
    { id: "d-word", name: "第三集拍摄计划.docx", kind: "word", size: "186 KB", excerpt: "一、夜戏机位排期\n21:00 前完成候车厅长椅反光布设与雨幕测试。", updated: "12 分钟前" },
    { id: "d-ppt", name: "视觉定调汇报.pptx", kind: "ppt", size: "12.6 MB", pages: 14, updated: "38 分钟前" },
    { id: "d-txt", name: "场记备忘.txt", kind: "txt", size: "3.8 KB", excerpt: "镜 04 慢摇过七盏站台灯，车灯切入画面后停 12 帧叠化雨声进入候车厅。", updated: "刚刚" },
    { id: "d-vue", name: "FileCard.vue", kind: "vue", size: "4.4 KB", excerpt: "<template>\n  <div class=\"card\">\n    <slot />\n  </div>\n</template>", updated: "1 小时前" },
    { id: "d-tsx", name: "VirtualTree.tsx", kind: "tsx", size: "6.1 KB", excerpt: "export function Tree() {\n  return <List virtual />;\n}", updated: "2 小时前" },
    { id: "d-still", name: "候车厅暖光.png", kind: "image", size: "4.6 MB", preview: IMG_HALL, updated: "18 分钟前" },
    { id: "d-cut", name: "第三集粗剪-v3.mov", kind: "video", size: "186 MB", preview: IMG_TRACK, duration: "02:48", updated: "1 小时前" },
  ];
  createFileExplorer(document.getElementById("files-basic"), {
    items,
    view: "card",
    rootName: "雨夜车站",
    height: 440,
  });
</script>
```

React 的写法：

```tsx
import { FileExplorer, type FileNode } from "satin-ui/react/tree";

const IMG_PLAZA = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_HALL = "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_TRACK = "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=220&q=80";

const items: FileNode[] = [
  {
    id: "f-shots", name: "镜头分镜", kind: "folder", color: "blue", updated: "10 分钟前",
    children: [
      { id: "fs-1", name: "镜01-站前广场.png", kind: "image", size: "3.8 MB", preview: IMG_PLAZA, updated: "今天 14:20" },
      { id: "fs-2", name: "镜04-站台长镜.mov", kind: "video", size: "64.2 MB", preview: IMG_TRACK, duration: "01:36", updated: "今天 13:50" },
      { id: "fs-3", name: "布光参数表.pdf", kind: "pdf", size: "2.1 MB", pages: 8, updated: "今天 11:08" },
    ],
  },
  {
    id: "f-docs", name: "项目文档", kind: "folder", color: "amber", updated: "2 小时前",
    children: [
      { id: "fd-1", name: "需求规格书.docx", kind: "word", size: "148 KB", updated: "昨天" },
      { id: "fd-2", name: "视觉定调提案.pptx", kind: "ppt", size: "9.4 MB", pages: 18, updated: "昨天" },
      { id: "d-bgm", name: "钢琴雨夜变奏.wav", kind: "audio", size: "19.2 MB", duration: "03:12", updated: "昨天" },
    ],
  },
  {
    id: "f-code", name: "前端源码", kind: "folder", color: "sage", updated: "昨天",
    children: [
      { id: "fc-1", name: "FolderCard.vue", kind: "vue", size: "4.8 KB", updated: "昨天" },
      { id: "fc-2", name: "TreeEngine.tsx", kind: "tsx", size: "7.2 KB", updated: "昨天" },
    ],
  },
  { id: "f-inbox", name: "待整理素材", kind: "folder", updated: "刚刚", children: [] },
  { id: "d-pdf", name: "雨夜布光手册.pdf", kind: "pdf", size: "4.2 MB", pages: 16, excerpt: "5200K 冷雨积水反射控制与 3400K 暖色顶灯过渡比例规范。", updated: "刚刚" },
  { id: "d-word", name: "第三集拍摄计划.docx", kind: "word", size: "186 KB", excerpt: "一、夜戏机位排期\n21:00 前完成候车厅长椅反光布设与雨幕测试。", updated: "12 分钟前" },
  { id: "d-ppt", name: "视觉定调汇报.pptx", kind: "ppt", size: "12.6 MB", pages: 14, updated: "38 分钟前" },
  { id: "d-txt", name: "场记备忘.txt", kind: "txt", size: "3.8 KB", excerpt: "镜 04 慢摇过七盏站台灯，车灯切入画面后停 12 帧叠化雨声进入候车厅。", updated: "刚刚" },
  { id: "d-vue", name: "FileCard.vue", kind: "vue", size: "4.4 KB", excerpt: '<template>\n  <div class="card">\n    <slot />\n  </div>\n</template>', updated: "1 小时前" },
  { id: "d-tsx", name: "VirtualTree.tsx", kind: "tsx", size: "6.1 KB", excerpt: "export function Tree() {\n  return <List virtual />;\n}", updated: "2 小时前" },
  { id: "d-still", name: "候车厅暖光.png", kind: "image", size: "4.6 MB", preview: IMG_HALL, updated: "18 分钟前" },
  { id: "d-cut", name: "第三集粗剪-v3.mov", kind: "video", size: "186 MB", preview: IMG_TRACK, duration: "02:48", updated: "1 小时前" },
];

export default function ProjectFiles() {
  return <FileExplorer items={items} view="card" rootName="雨夜车站" height={440} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { FileExplorer, type FileNode } from "satin-ui/vue/tree";

const IMG_PLAZA = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_HALL = "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_TRACK = "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=220&q=80";

const items: FileNode[] = [
  {
    id: "f-shots", name: "镜头分镜", kind: "folder", color: "blue", updated: "10 分钟前",
    children: [
      { id: "fs-1", name: "镜01-站前广场.png", kind: "image", size: "3.8 MB", preview: IMG_PLAZA, updated: "今天 14:20" },
      { id: "fs-2", name: "镜04-站台长镜.mov", kind: "video", size: "64.2 MB", preview: IMG_TRACK, duration: "01:36", updated: "今天 13:50" },
      { id: "fs-3", name: "布光参数表.pdf", kind: "pdf", size: "2.1 MB", pages: 8, updated: "今天 11:08" },
    ],
  },
  {
    id: "f-docs", name: "项目文档", kind: "folder", color: "amber", updated: "2 小时前",
    children: [
      { id: "fd-1", name: "需求规格书.docx", kind: "word", size: "148 KB", updated: "昨天" },
      { id: "fd-2", name: "视觉定调提案.pptx", kind: "ppt", size: "9.4 MB", pages: 18, updated: "昨天" },
      { id: "d-bgm", name: "钢琴雨夜变奏.wav", kind: "audio", size: "19.2 MB", duration: "03:12", updated: "昨天" },
    ],
  },
  {
    id: "f-code", name: "前端源码", kind: "folder", color: "sage", updated: "昨天",
    children: [
      { id: "fc-1", name: "FolderCard.vue", kind: "vue", size: "4.8 KB", updated: "昨天" },
      { id: "fc-2", name: "TreeEngine.tsx", kind: "tsx", size: "7.2 KB", updated: "昨天" },
    ],
  },
  { id: "f-inbox", name: "待整理素材", kind: "folder", updated: "刚刚", children: [] },
  { id: "d-pdf", name: "雨夜布光手册.pdf", kind: "pdf", size: "4.2 MB", pages: 16, excerpt: "5200K 冷雨积水反射控制与 3400K 暖色顶灯过渡比例规范。", updated: "刚刚" },
  { id: "d-word", name: "第三集拍摄计划.docx", kind: "word", size: "186 KB", excerpt: "一、夜戏机位排期\n21:00 前完成候车厅长椅反光布设与雨幕测试。", updated: "12 分钟前" },
  { id: "d-ppt", name: "视觉定调汇报.pptx", kind: "ppt", size: "12.6 MB", pages: 14, updated: "38 分钟前" },
  { id: "d-txt", name: "场记备忘.txt", kind: "txt", size: "3.8 KB", excerpt: "镜 04 慢摇过七盏站台灯，车灯切入画面后停 12 帧叠化雨声进入候车厅。", updated: "刚刚" },
  { id: "d-vue", name: "FileCard.vue", kind: "vue", size: "4.4 KB", excerpt: '<template>\n  <div class="card">\n    <slot />\n  </div>\n</template>', updated: "1 小时前" },
  { id: "d-tsx", name: "VirtualTree.tsx", kind: "tsx", size: "6.1 KB", excerpt: "export function Tree() {\n  return <List virtual />;\n}", updated: "2 小时前" },
  { id: "d-still", name: "候车厅暖光.png", kind: "image", size: "4.6 MB", preview: IMG_HALL, updated: "18 分钟前" },
  { id: "d-cut", name: "第三集粗剪-v3.mov", kind: "video", size: "186 MB", preview: IMG_TRACK, duration: "02:48", updated: "1 小时前" },
];
</script>

<template>
  <FileExplorer :items="items" view="card" root-name="雨夜车站" :height="440" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createFileExplorer, type FileNode } from "satin-ui/tree";

  const IMG_PLAZA = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80";
  const IMG_HALL = "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=320&h=220&q=80";
  const IMG_TRACK = "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=220&q=80";

  const items: FileNode[] = [
    {
      id: "f-shots", name: "镜头分镜", kind: "folder", color: "blue", updated: "10 分钟前",
      children: [
        { id: "fs-1", name: "镜01-站前广场.png", kind: "image", size: "3.8 MB", preview: IMG_PLAZA, updated: "今天 14:20" },
        { id: "fs-2", name: "镜04-站台长镜.mov", kind: "video", size: "64.2 MB", preview: IMG_TRACK, duration: "01:36", updated: "今天 13:50" },
        { id: "fs-3", name: "布光参数表.pdf", kind: "pdf", size: "2.1 MB", pages: 8, updated: "今天 11:08" },
      ],
    },
    {
      id: "f-docs", name: "项目文档", kind: "folder", color: "amber", updated: "2 小时前",
      children: [
        { id: "fd-1", name: "需求规格书.docx", kind: "word", size: "148 KB", updated: "昨天" },
        { id: "fd-2", name: "视觉定调提案.pptx", kind: "ppt", size: "9.4 MB", pages: 18, updated: "昨天" },
        { id: "d-bgm", name: "钢琴雨夜变奏.wav", kind: "audio", size: "19.2 MB", duration: "03:12", updated: "昨天" },
      ],
    },
    {
      id: "f-code", name: "前端源码", kind: "folder", color: "sage", updated: "昨天",
      children: [
        { id: "fc-1", name: "FolderCard.vue", kind: "vue", size: "4.8 KB", updated: "昨天" },
        { id: "fc-2", name: "TreeEngine.tsx", kind: "tsx", size: "7.2 KB", updated: "昨天" },
      ],
    },
    { id: "f-inbox", name: "待整理素材", kind: "folder", updated: "刚刚", children: [] },
    { id: "d-pdf", name: "雨夜布光手册.pdf", kind: "pdf", size: "4.2 MB", pages: 16, excerpt: "5200K 冷雨积水反射控制与 3400K 暖色顶灯过渡比例规范。", updated: "刚刚" },
    { id: "d-word", name: "第三集拍摄计划.docx", kind: "word", size: "186 KB", excerpt: "一、夜戏机位排期\n21:00 前完成候车厅长椅反光布设与雨幕测试。", updated: "12 分钟前" },
    { id: "d-ppt", name: "视觉定调汇报.pptx", kind: "ppt", size: "12.6 MB", pages: 14, updated: "38 分钟前" },
    { id: "d-txt", name: "场记备忘.txt", kind: "txt", size: "3.8 KB", excerpt: "镜 04 慢摇过七盏站台灯，车灯切入画面后停 12 帧叠化雨声进入候车厅。", updated: "刚刚" },
    { id: "d-vue", name: "FileCard.vue", kind: "vue", size: "4.4 KB", excerpt: '<template>\n  <div class="card">\n    <slot />\n  </div>\n</template>', updated: "1 小时前" },
    { id: "d-tsx", name: "VirtualTree.tsx", kind: "tsx", size: "6.1 KB", excerpt: "export function Tree() {\n  return <List virtual />;\n}", updated: "2 小时前" },
    { id: "d-still", name: "候车厅暖光.png", kind: "image", size: "4.6 MB", preview: IMG_HALL, updated: "18 分钟前" },
    { id: "d-cut", name: "第三集粗剪-v3.mov", kind: "video", size: "186 MB", preview: IMG_TRACK, duration: "02:48", updated: "1 小时前" },
  ];

  let host!: HTMLDivElement;
  $effect(() => {
    const it = createFileExplorer(host, { items, view: "card", rootName: "雨夜车站", height: 440 });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createFileExplorer, type FileNode } from "satin-ui/tree";

const IMG_PLAZA = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_HALL = "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_TRACK = "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=220&q=80";

const items: FileNode[] = [
  {
    id: "f-shots", name: "镜头分镜", kind: "folder", color: "blue", updated: "10 分钟前",
    children: [
      { id: "fs-1", name: "镜01-站前广场.png", kind: "image", size: "3.8 MB", preview: IMG_PLAZA, updated: "今天 14:20" },
      { id: "fs-2", name: "镜04-站台长镜.mov", kind: "video", size: "64.2 MB", preview: IMG_TRACK, duration: "01:36", updated: "今天 13:50" },
      { id: "fs-3", name: "布光参数表.pdf", kind: "pdf", size: "2.1 MB", pages: 8, updated: "今天 11:08" },
    ],
  },
  {
    id: "f-docs", name: "项目文档", kind: "folder", color: "amber", updated: "2 小时前",
    children: [
      { id: "fd-1", name: "需求规格书.docx", kind: "word", size: "148 KB", updated: "昨天" },
      { id: "fd-2", name: "视觉定调提案.pptx", kind: "ppt", size: "9.4 MB", pages: 18, updated: "昨天" },
      { id: "d-bgm", name: "钢琴雨夜变奏.wav", kind: "audio", size: "19.2 MB", duration: "03:12", updated: "昨天" },
    ],
  },
  {
    id: "f-code", name: "前端源码", kind: "folder", color: "sage", updated: "昨天",
    children: [
      { id: "fc-1", name: "FolderCard.vue", kind: "vue", size: "4.8 KB", updated: "昨天" },
      { id: "fc-2", name: "TreeEngine.tsx", kind: "tsx", size: "7.2 KB", updated: "昨天" },
    ],
  },
  { id: "f-inbox", name: "待整理素材", kind: "folder", updated: "刚刚", children: [] },
  { id: "d-pdf", name: "雨夜布光手册.pdf", kind: "pdf", size: "4.2 MB", pages: 16, excerpt: "5200K 冷雨积水反射控制与 3400K 暖色顶灯过渡比例规范。", updated: "刚刚" },
  { id: "d-word", name: "第三集拍摄计划.docx", kind: "word", size: "186 KB", excerpt: "一、夜戏机位排期\n21:00 前完成候车厅长椅反光布设与雨幕测试。", updated: "12 分钟前" },
  { id: "d-ppt", name: "视觉定调汇报.pptx", kind: "ppt", size: "12.6 MB", pages: 14, updated: "38 分钟前" },
  { id: "d-txt", name: "场记备忘.txt", kind: "txt", size: "3.8 KB", excerpt: "镜 04 慢摇过七盏站台灯，车灯切入画面后停 12 帧叠化雨声进入候车厅。", updated: "刚刚" },
  { id: "d-vue", name: "FileCard.vue", kind: "vue", size: "4.4 KB", excerpt: '<template>\n  <div class="card">\n    <slot />\n  </div>\n</template>', updated: "1 小时前" },
  { id: "d-tsx", name: "VirtualTree.tsx", kind: "tsx", size: "6.1 KB", excerpt: "export function Tree() {\n  return <List virtual />;\n}", updated: "2 小时前" },
  { id: "d-still", name: "候车厅暖光.png", kind: "image", size: "4.6 MB", preview: IMG_HALL, updated: "18 分钟前" },
  { id: "d-cut", name: "第三集粗剪-v3.mov", kind: "video", size: "186 MB", preview: IMG_TRACK, duration: "02:48", updated: "1 小时前" },
];

@Component({
  selector: "demo-files-basic",
  template: `<div #host></div>`,
})
export class FilesBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const it = createFileExplorer(this.host().nativeElement, { items, view: "card", rootName: "雨夜车站", height: 440 });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createFileExplorer, type FileNode } from "satin-ui/tree";

const IMG_PLAZA = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_HALL = "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_TRACK = "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=220&q=80";

const items: FileNode[] = [
  {
    id: "f-shots", name: "镜头分镜", kind: "folder", color: "blue", updated: "10 分钟前",
    children: [
      { id: "fs-1", name: "镜01-站前广场.png", kind: "image", size: "3.8 MB", preview: IMG_PLAZA, updated: "今天 14:20" },
      { id: "fs-2", name: "镜04-站台长镜.mov", kind: "video", size: "64.2 MB", preview: IMG_TRACK, duration: "01:36", updated: "今天 13:50" },
      { id: "fs-3", name: "布光参数表.pdf", kind: "pdf", size: "2.1 MB", pages: 8, updated: "今天 11:08" },
    ],
  },
  {
    id: "f-docs", name: "项目文档", kind: "folder", color: "amber", updated: "2 小时前",
    children: [
      { id: "fd-1", name: "需求规格书.docx", kind: "word", size: "148 KB", updated: "昨天" },
      { id: "fd-2", name: "视觉定调提案.pptx", kind: "ppt", size: "9.4 MB", pages: 18, updated: "昨天" },
      { id: "d-bgm", name: "钢琴雨夜变奏.wav", kind: "audio", size: "19.2 MB", duration: "03:12", updated: "昨天" },
    ],
  },
  {
    id: "f-code", name: "前端源码", kind: "folder", color: "sage", updated: "昨天",
    children: [
      { id: "fc-1", name: "FolderCard.vue", kind: "vue", size: "4.8 KB", updated: "昨天" },
      { id: "fc-2", name: "TreeEngine.tsx", kind: "tsx", size: "7.2 KB", updated: "昨天" },
    ],
  },
  { id: "f-inbox", name: "待整理素材", kind: "folder", updated: "刚刚", children: [] },
  { id: "d-pdf", name: "雨夜布光手册.pdf", kind: "pdf", size: "4.2 MB", pages: 16, excerpt: "5200K 冷雨积水反射控制与 3400K 暖色顶灯过渡比例规范。", updated: "刚刚" },
  { id: "d-word", name: "第三集拍摄计划.docx", kind: "word", size: "186 KB", excerpt: "一、夜戏机位排期\n21:00 前完成候车厅长椅反光布设与雨幕测试。", updated: "12 分钟前" },
  { id: "d-ppt", name: "视觉定调汇报.pptx", kind: "ppt", size: "12.6 MB", pages: 14, updated: "38 分钟前" },
  { id: "d-txt", name: "场记备忘.txt", kind: "txt", size: "3.8 KB", excerpt: "镜 04 慢摇过七盏站台灯，车灯切入画面后停 12 帧叠化雨声进入候车厅。", updated: "刚刚" },
  { id: "d-vue", name: "FileCard.vue", kind: "vue", size: "4.4 KB", excerpt: '<template>\n  <div class="card">\n    <slot />\n  </div>\n</template>', updated: "1 小时前" },
  { id: "d-tsx", name: "VirtualTree.tsx", kind: "tsx", size: "6.1 KB", excerpt: "export function Tree() {\n  return <List virtual />;\n}", updated: "2 小时前" },
  { id: "d-still", name: "候车厅暖光.png", kind: "image", size: "4.6 MB", preview: IMG_HALL, updated: "18 分钟前" },
  { id: "d-cut", name: "第三集粗剪-v3.mov", kind: "video", size: "186 MB", preview: IMG_TRACK, duration: "02:48", updated: "1 小时前" },
];

export default function ProjectFiles() {
  let host!: HTMLDivElement;
  onSettled(() => {
    const it = createFileExplorer(host, { items, view: "card", rootName: "雨夜车站", height: 440 });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { FileExplorer, type FileNode } from "satin-ui/react/tree";

const IMG_PLAZA = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_HALL = "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_TRACK = "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=220&q=80";

const items: FileNode[] = [
  {
    id: "f-shots", name: "镜头分镜", kind: "folder", color: "blue", updated: "10 分钟前",
    children: [
      { id: "fs-1", name: "镜01-站前广场.png", kind: "image", size: "3.8 MB", preview: IMG_PLAZA, updated: "今天 14:20" },
      { id: "fs-2", name: "镜04-站台长镜.mov", kind: "video", size: "64.2 MB", preview: IMG_TRACK, duration: "01:36", updated: "今天 13:50" },
      { id: "fs-3", name: "布光参数表.pdf", kind: "pdf", size: "2.1 MB", pages: 8, updated: "今天 11:08" },
    ],
  },
  {
    id: "f-docs", name: "项目文档", kind: "folder", color: "amber", updated: "2 小时前",
    children: [
      { id: "fd-1", name: "需求规格书.docx", kind: "word", size: "148 KB", updated: "昨天" },
      { id: "fd-2", name: "视觉定调提案.pptx", kind: "ppt", size: "9.4 MB", pages: 18, updated: "昨天" },
      { id: "d-bgm", name: "钢琴雨夜变奏.wav", kind: "audio", size: "19.2 MB", duration: "03:12", updated: "昨天" },
    ],
  },
  {
    id: "f-code", name: "前端源码", kind: "folder", color: "sage", updated: "昨天",
    children: [
      { id: "fc-1", name: "FolderCard.vue", kind: "vue", size: "4.8 KB", updated: "昨天" },
      { id: "fc-2", name: "TreeEngine.tsx", kind: "tsx", size: "7.2 KB", updated: "昨天" },
    ],
  },
  { id: "f-inbox", name: "待整理素材", kind: "folder", updated: "刚刚", children: [] },
  { id: "d-pdf", name: "雨夜布光手册.pdf", kind: "pdf", size: "4.2 MB", pages: 16, excerpt: "5200K 冷雨积水反射控制与 3400K 暖色顶灯过渡比例规范。", updated: "刚刚" },
  { id: "d-word", name: "第三集拍摄计划.docx", kind: "word", size: "186 KB", excerpt: "一、夜戏机位排期\n21:00 前完成候车厅长椅反光布设与雨幕测试。", updated: "12 分钟前" },
  { id: "d-ppt", name: "视觉定调汇报.pptx", kind: "ppt", size: "12.6 MB", pages: 14, updated: "38 分钟前" },
  { id: "d-txt", name: "场记备忘.txt", kind: "txt", size: "3.8 KB", excerpt: "镜 04 慢摇过七盏站台灯，车灯切入画面后停 12 帧叠化雨声进入候车厅。", updated: "刚刚" },
  { id: "d-vue", name: "FileCard.vue", kind: "vue", size: "4.4 KB", excerpt: '<template>\n  <div class="card">\n    <slot />\n  </div>\n</template>', updated: "1 小时前" },
  { id: "d-tsx", name: "VirtualTree.tsx", kind: "tsx", size: "6.1 KB", excerpt: "export function Tree() {\n  return <List virtual />;\n}", updated: "2 小时前" },
  { id: "d-still", name: "候车厅暖光.png", kind: "image", size: "4.6 MB", preview: IMG_HALL, updated: "18 分钟前" },
  { id: "d-cut", name: "第三集粗剪-v3.mov", kind: "video", size: "186 MB", preview: IMG_TRACK, duration: "02:48", updated: "1 小时前" },
];

export default function ProjectFiles() {
  return <FileExplorer items={items} view="card" rootName="雨夜车站" height={440} />;
}
```

### 树形列表与远程目录懒加载

默认树形列表视图：展开远程渲染农场目录异步加载 240 个镜头文件并自动启用虚拟滚动，同时支持切回卡片视图或右键整理。

```html
<div id="files-lazy"></div>
```

纯 HTML 的写法：

```html
<div id="files-lazy"></div>

<script type="module">
  import { createFileExplorer } from "satin-ui/tree";
  const items = [
    { id: "rm-farm", name: "云端渲染农场（点击展开懒加载 240 帧）", kind: "folder", hasChildren: true, updated: "同步中" },
    {
      id: "rm-local", name: "本地工作目录", kind: "folder", updated: "今天",
      children: [
        { id: "rm-l1", name: "定调参考.png", kind: "image", size: "3.2 MB", updated: "今天" },
        { id: "rm-l2", name: "镜头清单.md", kind: "doc", size: "16 KB", updated: "今天" },
      ],
    },
  ];
  createFileExplorer(document.getElementById("files-lazy"), {
    items,
    view: "tree",
    rootName: "云端资产库",
    height: 340,
    loadChildren: (node) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({ length: 240 }, (_, i) => ({
          id: `${node.id}-f-${i}`,
          name: `shot_${String(i + 1).padStart(4, "0")}.${i % 2 === 0 ? "exr" : "mov"}`,
          kind: i % 2 === 0 ? "image" : "video",
          size: `${(i % 19) + 4}.2 MB`,
          updated: "刚刚",
        })));
      }, 260);
    }),
  });
</script>
```

React 的写法：

```tsx
import { FileExplorer, type FileNode } from "satin-ui/react/tree";

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

export default function LazyFiles() {
  return <FileExplorer items={items} view="tree" rootName="云端资产库" height={340} loadChildren={loadChildren} />;
}
```

Vue 的写法：

```vue
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
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createFileExplorer, type FileNode } from "satin-ui/tree";

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

  let host!: HTMLDivElement;
  $effect(() => {
    const it = createFileExplorer(host, {
      items,
      view: "tree",
      rootName: "云端资产库",
      height: 340,
      loadChildren: (node) => new Promise((resolve) => {
        setTimeout(() => {
          resolve(Array.from({ length: 240 }, (_, i) => ({
            id: `${node.id}-f-${i}`,
            name: `shot_${String(i + 1).padStart(4, "0")}.${i % 2 === 0 ? "exr" : "mov"}`,
            kind: i % 2 === 0 ? "image" : "video",
            size: `${(i % 19) + 4}.2 MB`,
            updated: "刚刚",
          })));
        }, 260);
      }),
    });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createFileExplorer, type FileNode } from "satin-ui/tree";

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

@Component({
  selector: "demo-files-lazy",
  template: `<div #host></div>`,
})
export class FilesLazyComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const it = createFileExplorer(this.host().nativeElement, {
        items,
        view: "tree",
        rootName: "云端资产库",
        height: 340,
        loadChildren: (node) => new Promise((resolve) => {
          setTimeout(() => {
            resolve(Array.from({ length: 240 }, (_, i) => ({
              id: `${node.id}-f-${i}`,
              name: `shot_${String(i + 1).padStart(4, "0")}.${i % 2 === 0 ? "exr" : "mov"}`,
              kind: i % 2 === 0 ? "image" : "video",
              size: `${(i % 19) + 4}.2 MB`,
              updated: "刚刚",
            })));
          }, 260);
        }),
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createFileExplorer, type FileNode } from "satin-ui/tree";

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

export default function LazyFiles() {
  let host!: HTMLDivElement;
  onSettled(() => {
    const it = createFileExplorer(host, {
      items,
      view: "tree",
      rootName: "云端资产库",
      height: 340,
      loadChildren: (node) => new Promise((resolve) => {
        setTimeout(() => {
          resolve(Array.from({ length: 240 }, (_, i) => ({
            id: `${node.id}-f-${i}`,
            name: `shot_${String(i + 1).padStart(4, "0")}.${i % 2 === 0 ? "exr" : "mov"}`,
            kind: i % 2 === 0 ? "image" : "video",
            size: `${(i % 19) + 4}.2 MB`,
            updated: "刚刚",
          })));
        }, 260);
      }),
    });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { FileExplorer, type FileNode } from "satin-ui/react/tree";

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

export default function LazyFiles() {
  return <FileExplorer items={items} view="tree" rootName="云端资产库" height={340} loadChildren={loadChildren} />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `items` | `FileNode[]` | [] | 否 | 树形文件与文件夹数据：`id`、`name`、`kind`（folder / pdf / word / ppt / vue / tsx / txt / doc / image / video / audio / code / file，缺省自动按扩展名识别）、`color`（文件夹自定义颜色：预设名或任意 CSS 色值）、`size`、`updated`、`preview`（图片小图/视频首帧）、`duration`（视频/音频时长）、`excerpt`（文稿/代码微缩预览正文）、`pages`、`hasChildren`、`children`。 | createXxx 选项：`items`；React：`items`；Preact：`items`；Vue：`items` |
| `view` | `FileView` | "card" | 否 | 当前展示形式："card"（拟物文件夹与卡片）\| "list"（可排序列表）\| "tree"（虚拟化文件树形列表）。 | createXxx 选项：`view`；React：`view`；Preact：`view`；Vue：`view` |
| `path` | `string[]` | [] | 否 | 当前进入的目录 id 路径链（空数组代表根目录）。 | createXxx 选项：`path`；React：`path`；Preact：`path`；Vue：`path` |
| `height` | `number \| string` | 460 | 否 | 工作台容器高度（px 数值或 CSS 长度字符串）。 | createXxx 选项：`height`；React：`height`；Preact：`height`；Vue：`height` |
| `searchable` | `boolean` | true | 否 | 是否在工具栏展示实时搜索输入框。 | createXxx 选项：`searchable`；React：`searchable`；Preact：`searchable`；Vue：`searchable` |
| `rootName` | `string` | "全部文件" | 否 | 面包屑根目录显示名称。 | createXxx 选项：`rootName`；React：`rootName`；Preact：`rootName`；Vue：`rootName` |
| `activeStyle` | `TreeActiveStyle` | "subtle" | 否 | 激活/选中态外观：默认 "subtle" 极轻柔底色；可传 `{ bg, ring, hoverBg }` 或覆写 `--sn-fex-active-bg` 自由自定义。 | createXxx 选项：`activeStyle`；React：`activeStyle`；Preact：`activeStyle`；Vue：`activeStyle` |
| `menuSurface` | `"solid" \| "blur"` | "blur" | 否 | 右键菜单与新建菜单面板材质：默认 "blur" 高斯模糊毛玻璃，设为 "solid" 切换纯实底不透明。 | createXxx 选项：`menuSurface`；React：`menuSurface`；Preact：`menuSurface`；Vue：`menuSurface` |
| `loadChildren` | `(node: FileNode) => Promise<FileNode[]> \| FileNode[]` | — | 否 | 异步懒加载目录内容：树形展开或双击进入未加载的远程目录时调用。 | createXxx 选项：`loadChildren`；React：`loadChildren`；Preact：`loadChildren`；Vue：`loadChildren` |
| `label` | `string` | "文件管理" | 否 | 读屏无障碍标签。 | createXxx 选项：`label`；React：`label`；Preact：`label`；Vue：`label` |
| `className / style / id` | `string / CSSProperties / string` | — | 否 | 附加到宿主容器上。 | React：`className / style / id`；Preact：`class / style / id` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `change` | `{ items: FileNode[]; action: string }` | 目录数据因移动、新建、重命名、复制、删除或撤销而变化时触发。 | createXxx 选项：`onChange`；React：`onChange`；Preact：`onChange`；Vue：`@change` |
| `open` | `{ id: string; node: FileNode }` | 双击或右键打开具体文件时触发。 | createXxx 选项：`onOpen`；React：`onOpen`；Preact：`onOpen`；Vue：`@open` |
| `select` | `{ ids: string[] }` | 选中项变更时触发（支持单选、多选与 Shift 连选）。 | createXxx 选项：`onSelect`；React：`onSelect`；Preact：`onSelect`；Vue：`@select` |
| `viewChange` | `{ view: FileView }` | 在卡片、列表与树形列表之间切换视图时触发。 | createXxx 选项：`onViewChange`；React：`onViewChange`；Preact：`onViewChange`；Vue：`@viewChange` |
| `navigate` | `{ path: string[]; folder: FileNode \| null }` | 双击进入文件夹、返回上级或点击面包屑切换目录时触发。 | createXxx 选项：`onNavigate`；React：`onNavigate`；Preact：`onNavigate`；Vue：`@navigate` |
| `move` | `{ ids: string[]; nodes: FileNode[]; targetId: string \| null }` | 通过拖拽或右键菜单将内容移入目标文件夹（或根目录）时触发。 | createXxx 选项：`onMove`；React：`onMove`；Preact：`onMove`；Vue：`@move` |
| `create` | `{ node: FileNode; parentId: string \| null }` | 新建文件夹、文稿或分镜时触发。 | createXxx 选项：`onCreate`；React：`onCreate`；Preact：`onCreate`；Vue：`@create` |
| `rename` | `{ id: string; name: string; oldName: string; node: FileNode }` | 行内重命名提交后触发。 | createXxx 选项：`onRename`；React：`onRename`；Preact：`onRename`；Vue：`@rename` |
| `delete` | `{ ids: string[]; nodes: FileNode[] }` | 删除文件或文件夹时触发（含退场与 FLIP 补位微动效，支持撤销恢复）。 | createXxx 选项：`onDelete`；React：`onDelete`；Preact：`onDelete`；Vue：`@delete` |
| `colorChange` | `{ ids: string[]; color: string }` | 通过右键色卡或实例方法修改文件夹颜色时触发。 | createXxx 选项：`onColorChange`；React：`onColorChange`；Preact：`onColorChange`；Vue：`@colorChange` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `setView` | `setView(view: FileView): void` | 切换展示视图（"card" \| "list" \| "tree"）。 |
| `openFolder` | `openFolder(id: string): Promise<void>` | 进入指定文件夹（传空字符串返回根目录）；若是远程目录会先懒加载。 |
| `goUp` | `goUp(): void` | 返回上一级目录。 |
| `createItem` | `createItem(kind?: FileKind, parentId?: string \| null): FileNode` | 在当前目录或指定父目录新建文件夹或文件。 |
| `renameItem` | `renameItem(id: string, name: string): boolean` | 重命名指定条目并压入撤销栈。 |
| `setFolderColor` | `setFolderColor(ids: string \| string[], color?: string): boolean` | 为一个或多个文件夹设置预设色名或任意 CSS 自定义颜色（空串或 default 恢复银灰默认色）。 |
| `moveItems` | `moveItems(ids: string[], targetFolderId: string): boolean` | 将指定条目移入目标文件夹（空字符串表示根目录），自动防循环引用。 |
| `deleteItems` | `deleteItems(ids: string[]): boolean` | 删除指定条目并弹出可撤销提示。 |
| `undo` | `undo(): boolean` | 撤销最近一次移动、删除、新建、重命名或复制操作。 |
| `getItems` | `getItems(): FileNode[]` | 获取当前完整树形数据的深拷贝快照。 |
| `getView` | `getView(): FileView` | 获取当前所处视图模式。 |
| `getPath` | `getPath(): string[]` | 获取当前面包屑目录 id 路径数组。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-fex-folder-front-top` | 拟物文件夹前盖高光底色 | 浅 #f2f2f5 / 深 #4b4b52 |
| `--sn-fex-folder-back-top` | 拟物文件夹背板与折耳底色 | 浅 #d6d7dc / 深 #38383d |
| `--sn-fex-sheet-bg` | 夹层微缩内容纸片底色 | 浅 #ffffff / 深 #26262a |
| `--sn-fex-active-bg` | 卡片/行激活选中底色（可自定义） | 主文字 4.5%（深色 6.5%） |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-fex / .sn-fex-bar / .sn-fex-crumbs` | 文件管理器根容器 / 顶部工具栏 / 面包屑路径 |
| `.sn-fdr / .sn-fdr-back / .sn-fdr-sheets / .sn-fdr-front` | 3D 拟物文件夹外壳 / 折耳背板 / 夹层微缩内容纸叠 / 掀合前盖 |
| `.sn-drop-target / .sn-fdr-dropped / .sn-fex-ghost` | 拖拽悬停掀盖态 / 放入吸入回弹态 / GPU 浮空拖拽叠卡 |

## 导出的类型

`FileExplorerOptions`、`FileExplorerApi`、`FileNode`、`FileKind`、`FileView`、`FolderColorPreset`、`TreeActiveStyle`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| F2 |  | 对当前单选条目开启行内重命名（Enter 提交，Esc 取消）。 |
| ⌘ / Ctrl + A |  | 全选当前目录下的全部可见文件与文件夹。 |
| Delete / Backspace |  | 以退场与 FLIP 补位微动效删除当前选中项（支持 Toast 撤销）。 |
| ⌘ / Ctrl + Z |  | 撤销最近一步移动、删除、新建、重命名或改色操作并弹性归位。 |
| ⌘ / Ctrl + 点击 / Shift + 点击 |  | 加选、反选或区间连选；也支持在空白处直接拖拉框选或点左上角勾选框批量操作。 |
| Esc |  | 取消当前拖拽、关闭菜单或清空选中项。 |

## 无障碍

- 工作台带 `role="region"`，面包屑标记 `aria-current="page"`，树形模式节点带 `role="treeitem"` 与 `aria-expanded`，右键菜单复用标准 `role="menu"` 键盘导航。
- 卡片支持键盘聚焦，行内重命名自动聚焦并预选不含扩展名的主文件名。
- 遵循 `prefers-reduced-motion` 与 `.sn-reduce-motion`，关闭 3D 掀盖与吸入弹跳动画。

## 设计规范

- 这样做：让文件夹内微缩纸片真实反映其 `children` 数量与类型，空文件夹保持内凹清爽。
- 这样做：所有破坏性操作（删除、批量移动）均通过带「撤销」按钮的 Toast 兜底，不打断操作流。
- 不要：给拟物文件夹叠加彩虹高饱和渐变或彩色霓虹外发光。（规则 `no-colored-shadow`）
- 不要：在空文件夹中放假的装饰纸片误导用户。（规则 `no-gradient`）

文案：

- 文件夹副信息只展示简洁条目数（如「3 项」或「空」），单行截断不折行。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 拖拽悬停文件夹前盖 3D 掀开（-29deg）与纸张上浮 | `ease.outStrong` | 280ms |
| 松手放入文件夹弹性吸入回弹与计数跳动 | `ease.spring` | 420ms |

## 验收要点

- **多格式真实微缩预览**：视频展示真实首帧与时长播放标、图片展示高清缩略小图、TXT/PDF/Word/Vue/TSX 呈现真实可见微缩小字与语义字标、PPT 呈现横向微缩幻灯片，拖入文件夹后夹层纸片同步呈现对应格式。
- **全面复用 Satin 原生组件与零多余横线**：滚动条复用 `scrollArea`（带 `sa-jump` 虚拟同步）、右键与新建菜单复用 `openMenu`、视图切换复用 `initSeg`、撤销复用 `toast`；工具栏/画布/底栏/表头靠明度层级与空间留白过渡，杜绝无意义间隔横线。
- **低延迟 60fps 拖拽与全操作可撤销**：基于 Pointer Events 与合成线程 `translate3d` 浮空叠卡，支持多选叠拖、拖入拟物文件夹及顶部面包屑祖先目录并防循环引用；所有移动、删除、新建、重命名、复制均支持 Toast 一键撤销或 ⌘/Ctrl+Z。

## 规则

- **多格式真实微缩预览**：视频展示真实首帧与时长播放标、图片展示高清缩略小图、TXT/PDF/Word/Vue/TSX 呈现真实可见微缩小字与语义字标、PPT 呈现横向微缩幻灯片，拖入文件夹后夹层纸片同步呈现对应格式。
- **全面复用 Satin 原生组件与零多余横线**：滚动条复用 `scrollArea`（带 `sa-jump` 虚拟同步）、右键与新建菜单复用 `openMenu`、视图切换复用 `initSeg`、撤销复用 `toast`；工具栏/画布/底栏/表头靠明度层级与空间留白过渡，杜绝无意义间隔横线。
- **低延迟 60fps 拖拽与全操作可撤销**：基于 Pointer Events 与合成线程 `translate3d` 浮空叠卡，支持多选叠拖、拖入拟物文件夹及顶部面包屑祖先目录并防循环引用；所有移动、删除、新建、重命名、复制均支持 Toast 一键撤销或 ⌘/Ctrl+Z。

