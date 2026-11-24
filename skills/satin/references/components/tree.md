# 树形控件 · Tree

> 组件 id：`tree`　分组：数据展示

多级层级数据展示：1px 纤细缩进引导线、展开/折叠弹性旋转、父子三态联动勾选、实时搜索命中高亮、节点拖拽调序与移入父节点、异步懒加载子节点（带失败重试）以及万级节点自动虚拟化无限列表。

**多级层级结构展示：1px 纤细缩进引导线、展开/折叠弹性旋转、父子三态联动勾选、毫秒级搜索过滤高亮、节点拖拽调序与移入父节点、异步懒加载子节点（带失败重试），以及超过 120 行自动开启的万级节点虚拟无限列表。**

## 什么时候用

- 文件目录、组织架构、多级分类、组件大纲或需要懒加载与万级虚拟滚动的层级数据。

## 什么时候别用

- 只有一层可展开的问答或区块：用折叠面板。（换成 `collapse`）
- 需要文件卡片、拟物文件夹与多视图文件操作：用文件管理。（换成 `files`）

## 相近的组件

- `files`：文件管理基于树形引擎，额外提供卡片/列表/树形三视图、拟物文件夹与右键拖拽移入。
- `vlist`：无限列表面向扁平单层大列表；树形控件同时维护父子层级与三态勾选。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createTree } from "satin-ui/tree";` |
| React | `import { Tree } from "satin-ui/react/tree";` |
| Vue | `import { Tree } from "satin-ui/vue/tree";` |
| Svelte | `import { createTree } from "satin-ui/tree";` |
| Angular | `import { createTree } from "satin-ui/tree";` |
| Solid | `import { createTree } from "satin-ui/tree";` |
| Preact | `import { Tree } from "satin-ui/react/tree"; // 经 preact/compat` |

- React：`<Tree items checkable searchable draggable />`，从 `satin-ui/react/tree` 引入；ref 拿到实例方法（expand、expandAll、filter、getVisibleCount 等）。
- Preact：经 preact/compat 引入 `satin-ui/react/tree` 的 `Tree`。
- Vue：`<Tree :items checkable searchable draggable />`，从 `satin-ui/vue/tree` 引入。
- Svelte：在 `$effect` 中调用 `createTree(el, opts)`（来自 `satin-ui/tree`），清理函数中调用 `destroy()`。
- Angular：在 `afterNextRender` 中调用 `createTree(el, opts)`，`DestroyRef.onDestroy` 里调用 `destroy()`。
- Solid：在 `onSettled` 中调用 `createTree(el, opts)`，返回清理函数调用 `destroy()`。
- 纯 HTML：传入空容器 `createTree(el, { items, checkable, searchable, draggable, virtual, loadChildren })` 即可渲染并挂载全部交互。

## 示例（由浅入深）

### 勾选、搜索与拖拽移入

多级层级引导线、父子三态联动勾选、实时搜索命中高亮与节点拖拽排序/移入父节点。

```html
<div id="tree-basic"></div>
```

纯 HTML 的写法：

```html
<div id="tree-basic"></div>

<script type="module">
  import { createTree } from "satin-ui/tree";
  const items = [
    {
      id: "proj", label: "雨夜车站 · 第三集", icon: "clapperboard", meta: "48 镜",
      children: [
        {
          id: "script", label: "剧本与分镜", icon: "book-open",
          children: [
            { id: "s1", label: "第一场 · 站前广场.md", icon: "file-text", meta: "12 KB" },
            { id: "s2", label: "第二场 · 候车厅对话.md", icon: "file-text", meta: "18 KB" },
          ],
        },
        {
          id: "visual", label: "视觉与镜头", icon: "image",
          children: [
            { id: "v1", label: "5200K 冷雨定调帧.png", icon: "image", meta: "3.4 MB" },
            { id: "v2", label: "站台九盏灯运镜.mov", icon: "film", meta: "84 MB" },
          ],
        },
      ],
    },
    {
      id: "export", label: "成片交付", icon: "archive", meta: "2 项",
      children: [
        { id: "e1", label: "第三集-1080p.mp4", icon: "film", meta: "210 MB" },
        { id: "e2", label: "中英双语字幕.srt", icon: "file-text", meta: "42 KB" },
      ],
    },
  ];
  createTree(document.getElementById("tree-basic"), {
    items,
    defaultExpanded: ["proj", "script", "visual"],
    defaultChecked: ["s1", "v1"],
    checkable: true,
    searchable: true,
    draggable: true,
    height: 320,
  });
</script>
```

React 的写法：

```tsx
import { Tree, type TreeNode } from "satin-ui/react/tree";

const items: TreeNode[] = [
  {
    id: "proj", label: "雨夜车站 · 第三集", icon: "clapperboard", meta: "48 镜",
    children: [
      {
        id: "script", label: "剧本与分镜", icon: "book-open",
        children: [
          { id: "s1", label: "第一场 · 站前广场.md", icon: "file-text", meta: "12 KB" },
          { id: "s2", label: "第二场 · 候车厅对话.md", icon: "file-text", meta: "18 KB" },
        ],
      },
      {
        id: "visual", label: "视觉与镜头", icon: "image",
        children: [
          { id: "v1", label: "5200K 冷雨定调帧.png", icon: "image", meta: "3.4 MB" },
          { id: "v2", label: "站台九盏灯运镜.mov", icon: "film", meta: "84 MB" },
        ],
      },
    ],
  },
  {
    id: "export", label: "成片交付", icon: "archive", meta: "2 项",
    children: [
      { id: "e1", label: "第三集-1080p.mp4", icon: "film", meta: "210 MB" },
      { id: "e2", label: "中英双语字幕.srt", icon: "file-text", meta: "42 KB" },
    ],
  },
];

export default function ProjectTree() {
  return (
    <Tree
      items={items}
      defaultExpanded={["proj", "script", "visual"]}
      defaultChecked={["s1", "v1"]}
      checkable
      searchable
      draggable
      height={320}
    />
  );
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Tree, type TreeNode } from "satin-ui/vue/tree";

const items: TreeNode[] = [
  {
    id: "proj", label: "雨夜车站 · 第三集", icon: "clapperboard", meta: "48 镜",
    children: [
      {
        id: "script", label: "剧本与分镜", icon: "book-open",
        children: [
          { id: "s1", label: "第一场 · 站前广场.md", icon: "file-text", meta: "12 KB" },
          { id: "s2", label: "第二场 · 候车厅对话.md", icon: "file-text", meta: "18 KB" },
        ],
      },
      {
        id: "visual", label: "视觉与镜头", icon: "image",
        children: [
          { id: "v1", label: "5200K 冷雨定调帧.png", icon: "image", meta: "3.4 MB" },
          { id: "v2", label: "站台九盏灯运镜.mov", icon: "film", meta: "84 MB" },
        ],
      },
    ],
  },
  {
    id: "export", label: "成片交付", icon: "archive", meta: "2 项",
    children: [
      { id: "e1", label: "第三集-1080p.mp4", icon: "film", meta: "210 MB" },
      { id: "e2", label: "中英双语字幕.srt", icon: "file-text", meta: "42 KB" },
    ],
  },
];
</script>

<template>
  <Tree
    :items="items"
    :default-expanded="['proj', 'script', 'visual']"
    :default-checked="['s1', 'v1']"
    checkable
    searchable
    draggable
    :height="320"
  />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createTree, type TreeNode } from "satin-ui/tree";

  const items: TreeNode[] = [
    {
      id: "proj", label: "雨夜车站 · 第三集", icon: "clapperboard", meta: "48 镜",
      children: [
        {
          id: "script", label: "剧本与分镜", icon: "book-open",
          children: [
            { id: "s1", label: "第一场 · 站前广场.md", icon: "file-text", meta: "12 KB" },
            { id: "s2", label: "第二场 · 候车厅对话.md", icon: "file-text", meta: "18 KB" },
          ],
        },
        {
          id: "visual", label: "视觉与镜头", icon: "image",
          children: [
            { id: "v1", label: "5200K 冷雨定调帧.png", icon: "image", meta: "3.4 MB" },
            { id: "v2", label: "站台九盏灯运镜.mov", icon: "film", meta: "84 MB" },
          ],
        },
      ],
    },
    {
      id: "export", label: "成片交付", icon: "archive", meta: "2 项",
      children: [
        { id: "e1", label: "第三集-1080p.mp4", icon: "film", meta: "210 MB" },
        { id: "e2", label: "中英双语字幕.srt", icon: "file-text", meta: "42 KB" },
      ],
    },
  ];

  let host!: HTMLDivElement;
  $effect(() => {
    const it = createTree(host, {
      items,
      defaultExpanded: ["proj", "script", "visual"],
      defaultChecked: ["s1", "v1"],
      checkable: true,
      searchable: true,
      draggable: true,
      height: 320,
    });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from "@angular/core";
import { createTree, type TreeNode } from "satin-ui/tree";

const items: TreeNode[] = [
  {
    id: "proj", label: "雨夜车站 · 第三集", icon: "clapperboard", meta: "48 镜",
    children: [
      {
        id: "script", label: "剧本与分镜", icon: "book-open",
        children: [
          { id: "s1", label: "第一场 · 站前广场.md", icon: "file-text", meta: "12 KB" },
          { id: "s2", label: "第二场 · 候车厅对话.md", icon: "file-text", meta: "18 KB" },
        ],
      },
      {
        id: "visual", label: "视觉与镜头", icon: "image",
        children: [
          { id: "v1", label: "5200K 冷雨定调帧.png", icon: "image", meta: "3.4 MB" },
          { id: "v2", label: "站台九盏灯运镜.mov", icon: "film", meta: "84 MB" },
        ],
      },
    ],
  },
  {
    id: "export", label: "成片交付", icon: "archive", meta: "2 项",
    children: [
      { id: "e1", label: "第三集-1080p.mp4", icon: "film", meta: "210 MB" },
      { id: "e2", label: "中英双语字幕.srt", icon: "file-text", meta: "42 KB" },
    ],
  },
];

@Component({
  selector: "demo-tree-basic",
  template: `<div #host></div>`,
})
export class TreeBasicComponent {
  private host = viewChild.required<ElementRef<HTMLElement>>("host");
  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const it = createTree(this.host().nativeElement, {
        items,
        defaultExpanded: ["proj", "script", "visual"],
        defaultChecked: ["s1", "v1"],
        checkable: true,
        searchable: true,
        draggable: true,
        height: 320,
      });
      destroyRef.onDestroy(() => it.destroy());
    });
  }
}
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createTree, type TreeNode } from "satin-ui/tree";

const items: TreeNode[] = [
  {
    id: "proj", label: "雨夜车站 · 第三集", icon: "clapperboard", meta: "48 镜",
    children: [
      {
        id: "script", label: "剧本与分镜", icon: "book-open",
        children: [
          { id: "s1", label: "第一场 · 站前广场.md", icon: "file-text", meta: "12 KB" },
          { id: "s2", label: "第二场 · 候车厅对话.md", icon: "file-text", meta: "18 KB" },
        ],
      },
      {
        id: "visual", label: "视觉与镜头", icon: "image",
        children: [
          { id: "v1", label: "5200K 冷雨定调帧.png", icon: "image", meta: "3.4 MB" },
          { id: "v2", label: "站台九盏灯运镜.mov", icon: "film", meta: "84 MB" },
        ],
      },
    ],
  },
  {
    id: "export", label: "成片交付", icon: "archive", meta: "2 项",
    children: [
      { id: "e1", label: "第三集-1080p.mp4", icon: "film", meta: "210 MB" },
      { id: "e2", label: "中英双语字幕.srt", icon: "file-text", meta: "42 KB" },
    ],
  },
];

export default function ProjectTree() {
  let host!: HTMLDivElement;
  onSettled(() => {
    const it = createTree(host, {
      items,
      defaultExpanded: ["proj", "script", "visual"],
      defaultChecked: ["s1", "v1"],
      checkable: true,
      searchable: true,
      draggable: true,
      height: 320,
    });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { Tree, type TreeNode } from "satin-ui/react/tree";

const items: TreeNode[] = [
  {
    id: "proj", label: "雨夜车站 · 第三集", icon: "clapperboard", meta: "48 镜",
    children: [
      {
        id: "script", label: "剧本与分镜", icon: "book-open",
        children: [
          { id: "s1", label: "第一场 · 站前广场.md", icon: "file-text", meta: "12 KB" },
          { id: "s2", label: "第二场 · 候车厅对话.md", icon: "file-text", meta: "18 KB" },
        ],
      },
      {
        id: "visual", label: "视觉与镜头", icon: "image",
        children: [
          { id: "v1", label: "5200K 冷雨定调帧.png", icon: "image", meta: "3.4 MB" },
          { id: "v2", label: "站台九盏灯运镜.mov", icon: "film", meta: "84 MB" },
        ],
      },
    ],
  },
  {
    id: "export", label: "成片交付", icon: "archive", meta: "2 项",
    children: [
      { id: "e1", label: "第三集-1080p.mp4", icon: "film", meta: "210 MB" },
      { id: "e2", label: "中英双语字幕.srt", icon: "file-text", meta: "42 KB" },
    ],
  },
];

export default function ProjectTree() {
  return (
    <Tree
      items={items}
      defaultExpanded={["proj", "script", "visual"]}
      defaultChecked={["s1", "v1"]}
      checkable
      searchable
      draggable
      height={320}
    />
  );
}
```

### 异步懒加载与失败重试

展开带 `hasChildren: true` 的远程目录时原地旋转加载并缓存子节点，加载失败支持原地重试。

```html
<div id="tree-lazy"></div>
```

纯 HTML 的写法：

```html
<div id="tree-lazy"></div>

<script type="module">
  import { createTree } from "satin-ui/tree";
  const items = [
    { id: "lz-ep1", label: "第一集 · 远程素材库", icon: "folder", badge: "远程", hasChildren: true },
    { id: "lz-ep2", label: "第二集 · 分镜渲染帧", icon: "folder", badge: "远程", hasChildren: true },
    { id: "lz-retry", label: "历史归档（首次模拟失败可重试）", icon: "archive", badge: "重试演示", hasChildren: true },
  ];
  let failedOnce = false;
  createTree(document.getElementById("tree-lazy"), {
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
</script>
```

React 的写法：

```tsx
import { Tree, type TreeNode } from "satin-ui/react/tree";

const items: TreeNode[] = [
  { id: "lz-ep1", label: "第一集 · 远程素材库", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-ep2", label: "第二集 · 分镜渲染帧", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-retry", label: "历史归档（首次模拟失败可重试）", icon: "archive", badge: "重试演示", hasChildren: true },
];

let failedOnce = false;
const loadChildren = (node: TreeNode): Promise<TreeNode[]> => new Promise((resolve, reject) => {
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
});

export default function LazyTree() {
  return <Tree items={items} height={250} loadChildren={loadChildren} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Tree, type TreeNode } from "satin-ui/vue/tree";

const items: TreeNode[] = [
  { id: "lz-ep1", label: "第一集 · 远程素材库", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-ep2", label: "第二集 · 分镜渲染帧", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-retry", label: "历史归档（首次模拟失败可重试）", icon: "archive", badge: "重试演示", hasChildren: true },
];

let failedOnce = false;
const loadChildren = (node: TreeNode): Promise<TreeNode[]> => new Promise((resolve, reject) => {
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
});
</script>

<template>
  <Tree :items="items" :height="250" :load-children="loadChildren" />
</template>
```

Svelte 的写法：

```svelte
<script lang="ts">
  import { createTree, type TreeNode } from "satin-ui/tree";

  const items: TreeNode[] = [
    { id: "lz-ep1", label: "第一集 · 远程素材库", icon: "folder", badge: "远程", hasChildren: true },
    { id: "lz-ep2", label: "第二集 · 分镜渲染帧", icon: "folder", badge: "远程", hasChildren: true },
    { id: "lz-retry", label: "历史归档（首次模拟失败可重试）", icon: "archive", badge: "重试演示", hasChildren: true },
  ];

  let host!: HTMLDivElement;
  $effect(() => {
    let failedOnce = false;
    const it = createTree(host, {
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
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
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
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
import { createTree, type TreeNode } from "satin-ui/tree";

const items: TreeNode[] = [
  { id: "lz-ep1", label: "第一集 · 远程素材库", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-ep2", label: "第二集 · 分镜渲染帧", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-retry", label: "历史归档（首次模拟失败可重试）", icon: "archive", badge: "重试演示", hasChildren: true },
];

export default function LazyTree() {
  let host!: HTMLDivElement;
  onSettled(() => {
    let failedOnce = false;
    const it = createTree(host, {
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
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { Tree, type TreeNode } from "satin-ui/react/tree";

const items: TreeNode[] = [
  { id: "lz-ep1", label: "第一集 · 远程素材库", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-ep2", label: "第二集 · 分镜渲染帧", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-retry", label: "历史归档（首次模拟失败可重试）", icon: "archive", badge: "重试演示", hasChildren: true },
];

let failedOnce = false;
const loadChildren = (node: TreeNode): Promise<TreeNode[]> => new Promise((resolve, reject) => {
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
});

export default function LazyTree() {
  return <Tree items={items} height={250} loadChildren={loadChildren} />;
}
```

### 10,000+ 节点虚拟无限列表

一次性挂载 10,100 个分层节点，仅渲染视口附近的 ~28 个真实 DOM 行，滚动与实时搜索均毫秒级响应。

```html
<div id="tree-virtual"></div>
```

纯 HTML 的写法：

```html
<div id="tree-virtual"></div>

<script type="module">
  import { createTree } from "satin-ui/tree";
  const items = Array.from({ length: 100 }, (_, g) => ({
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
  createTree(document.getElementById("tree-virtual"), {
    items,
    defaultExpanded: items.map((g) => g.id),
    searchable: true,
    virtual: true,
    height: 360,
  });
</script>
```

React 的写法：

```tsx
import { Tree, type TreeNode } from "satin-ui/react/tree";

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
const expanded = items.map((g) => g.id);

export default function VirtualTree() {
  return <Tree items={items} defaultExpanded={expanded} searchable virtual height={360} />;
}
```

Vue 的写法：

```vue
<script setup lang="ts">
import { Tree, type TreeNode } from "satin-ui/vue/tree";

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
const expanded = items.map((g) => g.id);
</script>

<template>
  <Tree :items="items" :default-expanded="expanded" searchable virtual :height="360" />
</template>
```

Svelte 的写法：

```svelte
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
```

Angular 的写法：

```ts
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
```

Solid 的写法：

```tsx
import { onSettled } from "solid-js";
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

export default function VirtualTree() {
  let host!: HTMLDivElement;
  onSettled(() => {
    const it = createTree(host, {
      items,
      defaultExpanded: items.map((g) => g.id),
      searchable: true,
      virtual: true,
      height: 360,
    });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
```

Preact 的写法：

```tsx
import { Tree, type TreeNode } from "satin-ui/react/tree";

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
const expanded = items.map((g) => g.id);

export default function VirtualTree() {
  return <Tree items={items} defaultExpanded={expanded} searchable virtual height={360} />;
}
```

## 属性

| 名称 | 类型 | 默认值 | 必填 | 说明 | 各写法里的叫法 |
|---|---|---|---|---|---|
| `items` | `TreeNode[]` | [] | 否 | 树形节点数组：`id`、`label`、可选 `icon` / `meta` / `badge` / `disabled` / `hasChildren` / `children`。 | createXxx 选项：`items`；React：`items`；Preact：`items`；Vue：`items` |
| `expanded` | `string[]` | — | 否 | 受控展开的节点 id 列表。 | createXxx 选项：`expanded`；React：`expanded`；Preact：`expanded`；Vue：`expanded` |
| `defaultExpanded` | `string[]` | [] | 否 | 初始展开的节点 id 列表。 | createXxx 选项：`defaultExpanded`；React：`defaultExpanded`；Preact：`defaultExpanded`；Vue：`defaultExpanded` |
| `selected` | `string \| null` | — | 否 | 受控选中的节点 id（传入后自动开启节点持续激活态）。 | createXxx 选项：`selected`；React：`selected`；Preact：`selected`；Vue：`selected` |
| `defaultSelected` | `string \| null` | null | 否 | 初始选中的节点 id。 | createXxx 选项：`defaultSelected`；React：`defaultSelected`；Preact：`defaultSelected`；Vue：`defaultSelected` |
| `selectable` | `boolean` | false | 否 | 是否开启单行持续激活态；默认仅保留轻柔 hover 反馈（复选树与纯目录浏览不留多余持续灰底），传入 selected / activeStyle 时自动开启。 | createXxx 选项：`selectable`；React：`selectable`；Preact：`selectable`；Vue：`selectable` |
| `checked` | `string[]` | — | 否 | 受控勾选的节点 id 列表（父子三态自动联动）。 | createXxx 选项：`checked`；React：`checked`；Preact：`checked`；Vue：`checked` |
| `defaultChecked` | `string[]` | [] | 否 | 初始勾选的节点 id 列表。 | createXxx 选项：`defaultChecked`；React：`defaultChecked`；Preact：`defaultChecked`；Vue：`defaultChecked` |
| `checkable` | `boolean` | false | 否 | 是否显示三态联动复选框。 | createXxx 选项：`checkable`；React：`checkable`；Preact：`checkable`；Vue：`checkable` |
| `searchable` | `boolean` | false | 否 | 是否在顶部显示内置搜索过滤栏与一键展开/折叠按钮。 | createXxx 选项：`searchable`；React：`searchable`；Preact：`searchable`；Vue：`searchable` |
| `draggable` | `boolean` | false | 否 | 是否开启拖拽排序与移入父节点（自动阻止循环移入子孙）。 | createXxx 选项：`draggable`；React：`draggable`；Preact：`draggable`；Vue：`draggable` |
| `virtual` | `boolean` | false | 否 | 强制开启虚拟滚动；即使为 false，展平节点超过 120 行也会自动切入虚拟窗口模式。 | createXxx 选项：`virtual`；React：`virtual`；Preact：`virtual`；Vue：`virtual` |
| `rowHeight` | `number` | 32 | 否 | 单行高度（px），用于虚拟滚动视口精确计算。 | createXxx 选项：`rowHeight`；React：`rowHeight`；Preact：`rowHeight`；Vue：`rowHeight` |
| `height` | `number \| string` | 360 | 否 | 容器高度（px 数值或 CSS 长度字符串）。 | createXxx 选项：`height`；React：`height`；Preact：`height`；Vue：`height` |
| `activeStyle` | `TreeActiveStyle` | "subtle" | 否 | 激活/选中态外观：默认 "subtle" 极轻柔底色；可选 "bar"（带左侧 2px 精致微条）、"tint"（柔和主色晕染），或传 `{ bg, color, ring, bar, hoverBg }` 自由自定义。 | createXxx 选项：`activeStyle`；React：`activeStyle`；Preact：`activeStyle`；Vue：`activeStyle` |
| `loadChildren` | `(node: TreeNode) => Promise<TreeNode[]> \| TreeNode[]` | — | 否 | 异步懒加载函数：展开带有 `hasChildren: true` 的节点时调用，失败自动提供原地重试按钮。 | createXxx 选项：`loadChildren`；React：`loadChildren`；Preact：`loadChildren`；Vue：`loadChildren` |
| `label` | `string` | "树形列表" | 否 | 读屏无障碍标签。 | createXxx 选项：`label`；React：`label`；Preact：`label`；Vue：`label` |
| `className / style / id` | `string / CSSProperties / string` | — | 否 | 附加到树容器宿主元素上。 | React：`className / style / id`；Preact：`class / style / id` |

## 事件

| 名称 | 参数 | 什么时候 | 各写法 |
|---|---|---|---|
| `select` | `{ id: string; node: TreeNode }` | 点击或按回车选中节点时触发。 | createXxx 选项：`onSelect`；React：`onSelect`；Preact：`onSelect`；Vue：`@select` |
| `check` | `{ ids: string[]; id: string; checked: boolean; node: TreeNode }` | 切换三态复选框时触发，返回联动后的全部已勾选 id。 | createXxx 选项：`onCheck`；React：`onCheck`；Preact：`onCheck`；Vue：`@check` |
| `expand` | `{ id: string; expanded: boolean; node: TreeNode; expandedIds: string[] }` | 节点展开、折叠或懒加载完成后触发。 | createXxx 选项：`onExpand`；React：`onExpand`；Preact：`onExpand`；Vue：`@expand` |
| `move` | `{ dragId: string; targetId: string; position: "before" \| "inside" \| "after"; node: TreeNode; items: TreeNode[] }` | 拖拽排序或移入目标节点落定时触发。 | createXxx 选项：`onMove`；React：`onMove`；Preact：`onMove`；Vue：`@move` |

## 实例方法（createXxx 的返回值、React / Vue 的 ref）

| 名称 | 签名 | 说明 |
|---|---|---|
| `expand` | `expand(id: string, open?: boolean): Promise<void> \| void` | 展开或折叠指定节点（若为懒加载节点会自动触发加载）。 |
| `expandAll` | `expandAll(open?: boolean): void` | 一键展开或折叠全部已加载分支。 |
| `filter` | `filter(q: string): void` | 以关键字实时过滤树节点并高亮命中文本。 |
| `select` | `select(id: string \| null): void` | 以编程方式选中或清空选中节点。 |
| `setItems` | `setItems(items: TreeNode[]): void` | 整体替换节点数据并刷新虚拟视口。 |
| `getVisibleCount` | `getVisibleCount(): number` | 返回当前展平后的全部可见节点总数。 |
| `getRenderedCount` | `getRenderedCount(): number` | 返回当前真实挂载到 DOM 的行节点数量（虚拟化时保持在视口常数级）。 |

所有组件都有：`el`、`update(选项)`、`destroy()`、`on(事件, 回调)`、`off(事件, 回调)`。

## 样式定制

| 变量 | 作用 | 默认值 |
|---|---|---|
| `--sn-tr-h` | 树节点行高 | 32px |
| `--sn-tr-indent` | 每级层级缩进宽度 | 18px |
| `--sn-tr-active-bg` | 节点激活/选中背景色（可自定义） | 主文字 4.5%（深色 6.5%） |
| `--sn-tr-active-bar` | 节点激活左侧 2px 微指示条颜色 | transparent |
| `--sn-tree-line`（全局令牌） | 1px 层级参考线颜色 | 主文字 12% 透明 |

| 类名 / 属性 | 作用 |
|---|---|
| `.sn-tree / .sn-tree-virt / .sn-tree-vp` | 树根容器 / 虚拟化态 / 滚动视口 |
| `.sn-tr / .sn-tr-tw / .sn-tr-guides / .sn-tr-spin` | 节点行 / 展开箭头 / 层级引导线 / 懒加载旋转态 |
| `.sn-tr-drop-before / .sn-tr-drop-in / .sn-tr-drop-after` | 拖拽目标上方、移入子级与下方指示态 |

## 导出的类型

`TreeOptions`、`TreeApi`、`TreeNode`、`TreeActiveStyle`

## 键盘

| 按键 | 什么时候 | 做什么 |
|---|---|---|
| ↑ / ↓ |  | 在当前可见节点间移动焦点。 |
| → |  | 折叠状态下展开节点（含懒加载）；已展开时移动至第一个子节点。 |
| ← |  | 展开状态下折叠节点；否则跳回父节点。 |
| Home / End |  | 跳至首个或末尾可见节点。 |
| Enter / Space |  | Enter 选中当前节点；开启 checkable 时 Space 切换三态勾选。 |

## 无障碍

- 滚动视口使用 `role="tree"`，节点行使用 `role="treeitem"`、`aria-level`、`aria-expanded`、`aria-selected` 与 `aria-disabled`。
- 容器可聚焦，焦点节点有清晰可见的聚焦框并在键盘移动时自动滚入可视区。
- 遵循 `prefers-reduced-motion` 与 `.sn-reduce-motion`，关闭多余过渡。

## 设计规范

- 这样做：深层级树统一开启缩进引导线，超过 120 项默认依赖自动虚拟化保持 60fps。
- 这样做：异步懒加载失败时保留节点原地「重试」，不整树报错。
- 不要：给树节点堆彩色背景块或霓虹边框。（规则 `no-colored-shadow`）

文案：

- 节点文字简洁，副信息用 `meta` 靠右轻量呈现（如文件大小、镜头数）。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 展开箭头旋转 0°→90° | `ease.outStrong` | 180ms |
| 复选框勾选弹跳 | `ease.overshoot` | 260ms |

## 验收要点

- **自动虚拟化**：显式设 `virtual: true` 或展平节点数超过 120 行时自动切入虚拟窗口模式，仅挂载可视区域及上下缓冲行（约 20～35 个 DOM 节点），万级数据滚动依然 60fps 低延迟。
- **异步懒加载**：节点带 `hasChildren: true` 且提供 `loadChildren` 时，展开自动切微旋加载态并缓存结果；请求失败原地给出「重试」按钮。
- **键盘全导航**：支持 ↑ / ↓ 移动焦点、→ 展开或进入子项、← 折叠或回到父级、Home / End 跳转首尾、Enter 选中、Space 切换三态勾选。

## 规则

- **自动虚拟化**：显式设 `virtual: true` 或展平节点数超过 120 行时自动切入虚拟窗口模式，仅挂载可视区域及上下缓冲行（约 20～35 个 DOM 节点），万级数据滚动依然 60fps 低延迟。
- **异步懒加载**：节点带 `hasChildren: true` 且提供 `loadChildren` 时，展开自动切微旋加载态并缓存结果；请求失败原地给出「重试」按钮。
- **键盘全导航**：支持 ↑ / ↓ 移动焦点、→ 展开或进入子项、← 折叠或回到父级、Home / End 跳转首尾、Enter 选中、Space 切换三态勾选。

