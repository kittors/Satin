<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import "./type-1.css";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="row" id="tones">
    <span class="sn-t-body sn-c-primary">主文字</span>
    <span class="sn-t-body sn-c-secondary">副信息</span>
    <span class="sn-t-body sn-c-tertiary">时间、占位</span>
    <span class="sn-t-body sn-c-off">禁用</span>
    <span class="sn-t-body sn-c-danger">失败、删除</span>
    <span class="sn-t-body sn-c-success">成功（瞬时反馈）</span>
    <span class="sn-t-body sn-c-warning">系统警告</span>
  </div>
</div>
