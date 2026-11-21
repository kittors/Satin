<script setup>
import { Flow } from "satin-ui/vue/flow";

const nodes = [
  { id: "src", x: 0, y: 243, title: "导入原文", icon: "book-open", detail: "雨夜车站.docx · 3.2 万字", kind: "text" },
  { id: "split", x: 270, y: 243, title: "拆分章节", icon: "list", detail: "12 集 · 每集约 2700 字", kind: "text" },
  { id: "board", x: 540, y: 243, title: "生成分镜", icon: "clapperboard", detail: "第三集 · 48 个镜头", kind: "board" },
  { id: "img", x: 890, y: 0, title: "生成画面", icon: "image", detail: "电影感 · 16:9", kind: "image", bg: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&q=72) center / cover" },
  { id: "voice", x: 890, y: 187, title: "配音", icon: "headphones", detail: "林夏 · 温柔女声", kind: "audio" },
  { id: "bgm", x: 890, y: 287, title: "配乐", icon: "music", detail: "钢琴 · 雨夜氛围", kind: "audio" },
  { id: "sfx", x: 890, y: 387, title: "音效", icon: "audio-lines", detail: "雨声、列车进站", kind: "audio" },
  { id: "sub", x: 890, y: 487, title: "字幕", icon: "file-text", detail: "中英双语 · 自动对齐", kind: "text" },
  { id: "mix", x: 1240, y: 243, title: "合成视频", icon: "film", detail: "1080p · 24 帧", kind: "video" },
  { id: "out", x: 1510, y: 193, title: "导出横屏", icon: "download", detail: "第三集.mp4 · 16:9", kind: "out" },
  { id: "outV", x: 1510, y: 293, title: "导出竖屏", icon: "download", detail: "第三集-竖屏.mp4 · 9:16", kind: "out" },
];
const edges = [["src", "split"], ["split", "board"], ...["img", "voice", "bgm", "sfx", "sub"].flatMap((k) => [["board", k], [k, "mix"]]), ["mix", "out"], ["mix", "outV"]];
</script>

<template>
  <!-- 一个节点分出五条线并行，再汇到合成；kind 决定颜色，bg 给缩略图；点"运行"按依赖一层层点亮（演示用的进度）；节点、连线只在创建时用（之后用户在画布上拖、连、删） -->
  <Flow :nodes="nodes" :edges="edges" />
</template>
