<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import "./spacing-1.css";

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
    <div class="sp-compare">
      <figure class="sp-cmp sn-bad">
        <div class="sp-set">
          <b>通知</b>
          <span>新评论</span>
          <span>生成完成</span>
          <b>隐私</b>
          <span>公开主页</span>
          <span>允许搜索到我</span>
        </div>
        <figcaption class="sn-c-danger">都是 16：看不出哪几行是一组</figcaption>
      </figure>
      <figure class="sp-cmp good">
        <div class="sp-set">
          <div>
            <b>通知</b>
            <span>新评论</span>
            <span>生成完成</span>
          </div>
          <div>
            <b>隐私</b>
            <span>公开主页</span>
            <span>允许搜索到我</span>
          </div>
        </div>
        <figcaption>组内 8、组和组之间 24：一眼分成两组</figcaption>
      </figure>
    </div>
  </div>
</template>
