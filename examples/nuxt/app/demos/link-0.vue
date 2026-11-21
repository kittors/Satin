<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import "./link-0.css";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value);
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <p class="sn-t-body">登录即表示你同意<a class="sn-link" href="#link">用户协议</a>和<a class="sn-link" href="#link">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
    <div class="row" style="gap:28px">
      <button class="sn-textbtn">查看全部项目<span data-i="arrow-right:after"></span></button>
      <button class="sn-textbtn">编辑</button>
      <button class="sn-textbtn sn-quiet">忘记密码？</button>
      <button class="sn-textbtn sn-quiet">取消</button>
      <button class="sn-textbtn sn-danger-text">去处理<span data-i="arrow-right:after"></span></button>
    </div>
  </div>
</template>
