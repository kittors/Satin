<!--
  验证码：<Otp length={6} oncomplete={(code) => …} />
  · bind:instance 拿到 Satin 实例
-->
<script>
  import Satin from "./Satin.svelte";
  import { createOtp } from "../src/components.js";

  let { length, oncomplete, instance = $bindable(null), ...rest } = $props();
</script>

<Satin create={createOtp} options={{ length, onComplete: (v) => oncomplete?.(v) }} bind:instance {...rest} />
