// 展示页接线：树形控件（基础/懒加载/万级虚拟树）与文件管理/拟物文件夹工作台
import { createTree, createFileExplorer } from "../../packages/satin-ui/src/tree.js";

const IMG_PLAZA = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_HALL = "https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=320&h=220&q=80";
const IMG_TRACK = "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=220&q=80";

const TREE_BASIC_DATA = [
  {
    id: "proj", label: "雨夜车站 · 第三集", icon: "clapperboard", meta: "48 镜",
    children: [
      {
        id: "script", label: "剧本与分镜", icon: "book-open",
        children: [
          { id: "s1", label: "第一场 · 站前广场.md", icon: "file-text", meta: "12 KB" },
          { id: "s2", label: "第二场 · 候车厅对话.md", icon: "file-text", meta: "18 KB" },
          { id: "s3", label: "第三场 · 末班车进站.md", icon: "file-text", meta: "9.4 KB" },
        ],
      },
      {
        id: "visual", label: "视觉与镜头", icon: "image",
        children: [
          { id: "v1", label: "5200K 冷雨定调帧.png", icon: "image", meta: "3.4 MB" },
          { id: "v2", label: "3400K 候车厅暖光.png", icon: "image", meta: "2.8 MB" },
          { id: "v3", label: "站台九盏灯运镜.mov", icon: "film", meta: "84 MB" },
        ],
      },
      {
        id: "audio", label: "声音设计", icon: "audio-lines",
        children: [
          { id: "a1", label: "雨声环境母带.wav", icon: "file-music", meta: "26 MB" },
          { id: "a2", label: "钢琴主题草稿.wav", icon: "music", meta: "14 MB" },
        ],
      },
    ],
  },
  {
    id: "export", label: "成片交付", icon: "archive", meta: "2 项",
    children: [
      { id: "e1", label: "第三集-横屏-1080p.mp4", icon: "film", meta: "210 MB" },
      { id: "e2", label: "中英双语字幕.srt", icon: "file-text", meta: "42 KB" },
    ],
  },
];

const TREE_LAZY_DATA = [
  { id: "lz-ep1", label: "第一集 · 远程素材库", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-ep2", label: "第二集 · 分镜渲染帧", icon: "folder", badge: "远程", hasChildren: true },
  { id: "lz-retry", label: "历史归档（首次模拟失败可重试）", icon: "archive", badge: "演示重试", hasChildren: true },
];

function makeVirtualTreeData(groups = 100, perGroup = 100) {
  return Array.from({ length: groups }, (_, g) => ({
    id: `vg-${g}`,
    label: `第 ${String(g + 1).padStart(3, "0")} 场 · 分镜序列`,
    icon: "folder",
    meta: `${perGroup} 镜`,
    children: Array.from({ length: perGroup }, (_, i) => ({
      id: `vn-${g}-${i}`,
      label: `镜头 ${String(g + 1).padStart(3, "0")}-${String(i + 1).padStart(2, "0")} · ${i % 3 === 0 ? "实景定调.png" : i % 3 === 1 ? "运镜预览.mov" : "台词脚本.md"}`,
      icon: i % 3 === 0 ? "image" : i % 3 === 1 ? "film" : "file-text",
      meta: `${((g * 7 + i * 3) % 48) + 2}.4 MB`,
    })),
  }));
}

const FILES_DEMO_DATA = [
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

export function initTree() {
  const basicHost = document.getElementById("treeBasicHost");
  if (basicHost) {
    createTree(basicHost, {
      items: TREE_BASIC_DATA,
      defaultExpanded: ["proj", "script", "visual"],
      defaultChecked: ["s1", "v1"],
      checkable: true,
      searchable: true,
      draggable: true,
      height: 320,
      label: "项目资产目录树",
    });
  }

  const lazyHost = document.getElementById("treeLazyHost");
  if (lazyHost) {
    let failedOnce = false;
    createTree(lazyHost, {
      items: TREE_LAZY_DATA,
      height: 240,
      label: "远程异步懒加载目录树",
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
        }, 320);
      }),
    });
  }

  const virtHost = document.getElementById("treeVirtHost");
  const virtMeta = document.getElementById("treeVirtMeta");
  if (virtHost) {
    const items = makeVirtualTreeData(100, 100);
    const expanded = items.map((g) => g.id);
    const inst = createTree(virtHost, {
      items,
      defaultExpanded: expanded,
      searchable: true,
      virtual: true,
      height: 320,
      label: "万级虚拟树形无限列表",
    });
    const syncMeta = () => {
      if (virtMeta) virtMeta.textContent = `总可见节点 ${inst.getVisibleCount().toLocaleString()} 个 · 当前挂载 DOM 仅 ${inst.getRenderedCount()} 行`;
    };
    syncMeta();
    virtHost.addEventListener("scroll", syncMeta, { capture: true, passive: true });
    virtHost.addEventListener("input", () => setTimeout(syncMeta, 0), { capture: true });
  }

  const fxHost = document.getElementById("filesDemoHost");
  if (fxHost) {
    createFileExplorer(fxHost, {
      items: FILES_DEMO_DATA,
      view: "card",
      height: 440,
      rootName: "雨夜车站",
      label: "项目素材文件管理器",
    });
  }

  const fxLazyHost = document.getElementById("filesLazyHost");
  if (fxLazyHost) {
    createFileExplorer(fxLazyHost, {
      items: [
        { id: "rm-farm", name: "云端渲染农场（点击展开懒加载 240 帧）", kind: "folder", hasChildren: true, updated: "同步中" },
        { id: "rm-local", name: "本地工作目录", kind: "folder", updated: "今天", children: [
          { id: "rm-l1", name: "定调参考.png", kind: "image", size: "3.2 MB", preview: IMG_PLAZA, updated: "今天" },
          { id: "rm-l2", name: "镜头清单.pdf", kind: "pdf", size: "1.4 MB", pages: 6, updated: "今天" },
        ] },
      ],
      view: "tree",
      height: 320,
      rootName: "云端资产库",
      loadChildren: (node) => new Promise((resolve) => {
        setTimeout(() => {
          resolve(Array.from({ length: 240 }, (_, i) => ({
            id: `${node.id}-f-${i}`,
            name: `shot_${String(i + 1).padStart(4, "0")}.${i % 2 === 0 ? "png" : "mov"}`,
            kind: i % 2 === 0 ? "image" : "video",
            size: `${(i % 19) + 4}.2 MB`,
            duration: i % 2 === 1 ? "00:18" : undefined,
            updated: "刚刚",
          })));
        }, 280);
      }),
    });
  }
}
