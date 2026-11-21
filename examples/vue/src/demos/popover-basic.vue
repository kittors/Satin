<script setup>
import { ref } from "vue";
import { Button, Popover, Switch } from "satin-ui/vue";

const download = ref(true);
</script>

<template>
  <Popover title="分享给协作者">
    <Button icon="share">分享</Button>
    <template #content>
      <p>拿到链接的人可以查看，不能修改。</p>
      <div class="sn-pop-row"><Switch v-model="download" label="允许下载原片" /></div>
    </template>
  </Popover>
</template>
