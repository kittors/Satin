<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import "./space-0.css";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="row" id="radii" style="gap:20px">
    <div class="radius-box">
      <i style="border-radius:4px"></i>
      <span class="sn-cap">xs · 4</span>
      <span class="sn-note">徽章、复选框</span>
    </div>
    <div class="radius-box">
      <i style="border-radius:6px"></i>
      <span class="sn-cap">sm · 6</span>
      <span class="sn-note">小按钮、小输入框</span>
    </div>
    <div class="radius-box">
      <i style="border-radius:8px"></i>
      <span class="sn-cap">md · 8</span>
      <span class="sn-note">按钮、输入框、菜单项</span>
    </div>
    <div class="radius-box">
      <i style="border-radius:12px"></i>
      <span class="sn-cap">lg · 12</span>
      <span class="sn-note">卡片、菜单面板</span>
    </div>
    <div class="radius-box">
      <i style="border-radius:16px"></i>
      <span class="sn-cap">xl · 16</span>
      <span class="sn-note">对话框</span>
    </div>
    <div class="radius-box">
      <i style="border-radius:9999px"></i>
      <span class="sn-cap">full · 胶囊</span>
      <span class="sn-note">头像、开关、胶囊</span>
    </div>
  </div>
</div>
