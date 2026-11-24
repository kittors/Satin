<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import "./input-1.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="grid-m auto" style="--min:150px;gap:16px">
    <div class="sn-field">
      <span class="sn-cap">sm 28</span>
      <input class="sn-input sn-sm" placeholder="表格、工具条">
    </div>
    <div class="sn-field">
      <span class="sn-cap">md 32（默认）</span>
      <input class="sn-input" placeholder="大多数地方">
    </div>
    <div class="sn-field">
      <span class="sn-cap">lg 36</span>
      <input class="sn-input sn-lg" placeholder="主要表单">
    </div>
    <div class="sn-field">
      <span class="sn-cap">xl 40</span>
      <input class="sn-input sn-xl" placeholder="登录、欢迎页">
    </div>
  </div>
</div>
