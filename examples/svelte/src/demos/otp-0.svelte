<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { createOtp, toast } from "satin-ui/components";
  import "./otp-0.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root, (root: any) => {
      // 自动跳格、退格回上一格、粘贴自动分配；填进去的数字从下面淡入
      const otp = createOtp(root.querySelector("[data-otp]"), {
        onComplete: (code?: any) => { // 6 位都填满时调：换成你的校验请求
          toast({ text: `已提交验证码 ${code}` });
          window.setTimeout(() => otp.clear(), 1200); // 清空、焦点回第一格
        },
      });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="grid-m lc">
    <span class="sn-cap">标准验证码</span>
    <div class="sn-otp" data-otp="">
      <input inputmode="numeric" maxlength="1" aria-label="第 1 位">
      <input inputmode="numeric" maxlength="1" aria-label="第 2 位">
      <input inputmode="numeric" maxlength="1" aria-label="第 3 位">
      <span class="sn-gap"></span>
      <input inputmode="numeric" maxlength="1" aria-label="第 4 位">
      <input inputmode="numeric" maxlength="1" aria-label="第 5 位">
      <input inputmode="numeric" maxlength="1" aria-label="第 6 位">
    </div>
    <span class="sn-cap">密码隐藏（掩码）</span>
    <div class="sn-otp" data-otp="" data-mask="">
      <input inputmode="numeric" maxlength="1" aria-label="第 1 位">
      <input inputmode="numeric" maxlength="1" aria-label="第 2 位">
      <input inputmode="numeric" maxlength="1" aria-label="第 3 位">
      <span class="sn-gap"></span>
      <input inputmode="numeric" maxlength="1" aria-label="第 4 位">
      <input inputmode="numeric" maxlength="1" aria-label="第 5 位">
      <input inputmode="numeric" maxlength="1" aria-label="第 6 位">
    </div>
  </div>
</div>
