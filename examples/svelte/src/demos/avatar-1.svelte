<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  import "./avatar-1.css";
  defineElements();

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="row" style="gap:12px">
    <sn-avatar name="张伟" size="40"></sn-avatar>
    <sn-avatar name="何慧" size="40"></sn-avatar>
    <sn-avatar name="徐丽" size="40"></sn-avatar>
    <sn-avatar name="梁静" size="40"></sn-avatar>
    <sn-avatar name="冯磊" size="40"></sn-avatar>
    <sn-avatar name="赵敏" size="40"></sn-avatar>
    <sn-avatar name="陈静" size="40"></sn-avatar>
    <sn-avatar name="罗军" size="40"></sn-avatar>
    <sn-avatar name="潘涛" size="40"></sn-avatar>
    <sn-avatar name="赵启航" size="40"></sn-avatar>
    <sn-avatar name="沈念" size="40"></sn-avatar>
    <sn-avatar name="黄磊" size="40"></sn-avatar>
  </div>
</div>
