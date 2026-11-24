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
