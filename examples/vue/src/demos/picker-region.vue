<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";

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
    <div class="sn-field">
      <span class="sn-lbl">寄送地址</span>
      <div class="sn-pk" data-pk="region" style="min-width:250px">
        <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
          <span class="sn-val sn-ph" data-ph="选择省 / 市 / 区">选择省 / 市 / 区</span>
          <span class="sn-end sn-swap">
            <span class="sn-a" data-i="map-pin"></span>
            <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
          </span>
        </button>
        <div class="sn-pk-panel sn-rg" role="dialog" aria-label="选择地址">
          <div class="sn-rg-search">
            <input class="sn-input sn-sm" type="text" enterkeyhint="search" placeholder="搜索省、市、区，比如：西湖" aria-label="搜索地址">
          </div>
          <div class="sn-rg-hot">常用<button type="button" data-path="北京市/北京市">北京</button><button type="button" data-path="上海市/上海市">上海</button><button type="button" data-path="广东省/广州市">广州</button><button type="button" data-path="广东省/深圳市">深圳</button><button type="button" data-path="浙江省/杭州市">杭州</button><button type="button" data-path="四川省/成都市">成都</button></div>
          <div class="sn-rg-tabs" role="tablist">
            <span class="sn-ink"></span>
          </div>
          <div class="sn-rg-vp">
            <div class="sn-rg-res sn-sa-vp sn-fy" role="listbox" hidden></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
