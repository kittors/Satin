<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value);
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="sn-tbl-wrap">
      <div class="sn-tbl-sc">
        <table class="sn-tbl" aria-label="正在加载" aria-busy="true">
          <thead>
            <tr>
              <th>项目</th>
              <th>负责人</th>
              <th>状态</th>
              <th class="sn-r">镜头</th>
              <th class="sn-r">时长</th>
            </tr>
          </thead>
          <tbody>
            <tr class="sn-tbl-sk">
              <td>
                <i class="sn-sk" style="width:60%"></i>
              </td>
              <td>
                <i class="sn-sk" style="width:48px"></i>
              </td>
              <td>
                <i class="sn-sk" style="width:56px"></i>
              </td>
              <td class="sn-r">
                <i class="sn-sk" style="width:24px"></i>
              </td>
              <td class="sn-r">
                <i class="sn-sk" style="width:36px"></i>
              </td>
            </tr>
            <tr class="sn-tbl-sk">
              <td>
                <i class="sn-sk" style="width:60%"></i>
              </td>
              <td>
                <i class="sn-sk" style="width:48px"></i>
              </td>
              <td>
                <i class="sn-sk" style="width:56px"></i>
              </td>
              <td class="sn-r">
                <i class="sn-sk" style="width:24px"></i>
              </td>
              <td class="sn-r">
                <i class="sn-sk" style="width:36px"></i>
              </td>
            </tr>
            <tr class="sn-tbl-sk">
              <td>
                <i class="sn-sk" style="width:60%"></i>
              </td>
              <td>
                <i class="sn-sk" style="width:48px"></i>
              </td>
              <td>
                <i class="sn-sk" style="width:56px"></i>
              </td>
              <td class="sn-r">
                <i class="sn-sk" style="width:24px"></i>
              </td>
              <td class="sn-r">
                <i class="sn-sk" style="width:36px"></i>
              </td>
            </tr>
            <tr class="sn-tbl-sk">
              <td>
                <i class="sn-sk" style="width:60%"></i>
              </td>
              <td>
                <i class="sn-sk" style="width:48px"></i>
              </td>
              <td>
                <i class="sn-sk" style="width:56px"></i>
              </td>
              <td class="sn-r">
                <i class="sn-sk" style="width:24px"></i>
              </td>
              <td class="sn-r">
                <i class="sn-sk" style="width:36px"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
