<script lang="ts">
  import EmptyArt from "satin-ui/svelte/EmptyArt.svelte";
  const presets = [
    { name: "projects", title: "首次使用" },
    { name: "search", title: "筛选无结果" },
    { name: "error", title: "加载失败" },
    { name: "inbox", title: "空收件箱" },
    { name: "folder", title: "空文件夹" },
    { name: "lock", title: "暂无权限" },
  ];
</script>

<div class="sn-empty-presets">
  {#each presets as p (p.name)}
    <div class="sn-empty-preset">
      <EmptyArt name={p.name} />
      <b>{p.title}</b>
      <code>{p.name}</code>
    </div>
  {/each}
</div>
