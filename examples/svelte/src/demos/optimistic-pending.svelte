<script>
  import { busy, succeed, toast } from "satin-ui";

  // 演示用的付款：1.2 秒后成功；换成真实的请求
  const pay = () => new Promise((done) => setTimeout(done, 1200));
  let button;
  async function onPay() {
    // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
    await busy(button, pay()); // 300ms 内回来不转圈；转圈出现后至少留 500ms
    succeed(button); // 原地打勾 1.5 秒
    toast({ text: "已支付 ¥68" });
  }
</script>

<!-- 先写好 .sn-label 结构，转圈、打勾时宽度不跳 -->
<button type="button" class="sn-btn sn-primary" bind:this={button} onclick={onPay}><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg><span class="sn-txt">支付 ¥68</span></span></button>
