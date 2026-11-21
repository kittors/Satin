<script>
  import { createUpload } from "satin-ui";

  // 格式不对、太大的当场标红，不等用户传完才说；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createUpload(host, { accept: /\.(txt|docx)$/i, maxSize: 5e6 });
    return () => it.destroy();
  });
</script>

<sn-enhance>
  <div class="sn-drop" bind:this={host} tabindex="0" role="button" aria-label="把文件拖到这里，或者选择文件"><span class="sn-art" data-i="cloud-upload"></span><b>把文件拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx，单个不超过 5 MB</span><input type="file" multiple accept=".txt,.docx" hidden></div>
  <div class="sn-files"></div>
</sn-enhance>
