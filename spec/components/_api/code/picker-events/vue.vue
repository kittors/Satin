<script setup>
import { ref } from "vue";
import { DatePicker } from "satin-ui/vue";

const due = ref("");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <div class="sn-field">
      <span class="sn-lbl">交付日期</span>
      <!-- 选好、清除时发 change；text 是触发框里显示的文字（清除时是空字符串），交给接口时按需要的格式自己转 -->
      <DatePicker @change="(d) => (due = d.text)" />
    </div>
    <span class="sn-help">{{ due ? "交付日期：" + due : "还没选交付日期" }}</span>
  </div>
</template>
