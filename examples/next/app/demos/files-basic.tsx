"use client";
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
