<script lang="ts">
  import { createUpload } from "satin-ui";

  // 一次一个：input 不写 multiple；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createUpload(host, { accept: /\.(jpe?g|png)$/i, maxSize: 2e6 });
    return () => it.destroy();
  });
</script>

<sn-enhance>
  <div class="sn-drop" bind:this={host} tabindex="0" role="button" aria-label="把封面拖到这里，或者选择图片"><span class="sn-art" data-i="cloud-upload"></span><b>把封面拖到这里，或者 <u>选择图片</u></b><span class="sn-hint">一次一张，JPG 或 PNG</span><input type="file" accept=".jpg,.png" hidden></div>
  <div class="sn-files"></div>
</sn-enhance>
