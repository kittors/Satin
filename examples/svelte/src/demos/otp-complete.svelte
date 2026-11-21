<script>
  import Otp from "satin-ui/svelte/Otp.svelte";

  let note = $state("输入 6 位验证码");
</script>

<div class="sn-stack sn-gap-8">
  <!-- 填满就拿整串数字去校验（换成真实的请求） -->
  <Otp length={6} oncomplete={(code) => (note = `正在校验 ${code}…`)} />
  <span class="sn-help">{note}</span>
</div>
