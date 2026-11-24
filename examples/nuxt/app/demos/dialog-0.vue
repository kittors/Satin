<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { closeDialog, busy, toast } from "satin-ui/components";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value, (root: any) => {
    (async () => {
      // [data-dlg="弹窗 id"] 打开：从按钮那里长出来，关闭时原路缩回，焦点回到按钮——enhance() 已经接上
      // 弹窗里的 [data-x]、[data-cancel] 和 Esc 关闭；点背景只"顶一下"，不关
      const dlg = root.querySelector("#dlg-new"), name = dlg.querySelector("#dn-name");

      // 关闭前先问一句：挂一个 guard，Esc / 取消 / 点 × 都会先调它（填了名字就先提示，不弹系统对话框）
      dlg.guard = () => {
        if (!name.value.trim()) { closeDialog(dlg); return; }
        toast({ kind: "action", text: "名字还没保存", action: { label: "放弃并关闭", run: (t?: any) => { name.value = ""; closeDialog(dlg); t.close(); } } });
      };

      dlg.querySelector("form").addEventListener("submit", async (e?: any) => {
        e.preventDefault();
        const v = name.value.trim(); if (!v) { name.focus(); return; }
        await busy(dlg.querySelector(".sn-ft .sn-primary"), 900); // 换成你的创建请求（Promise）
        name.value = ""; closeDialog(dlg);
        toast({ text: `已创建"${v}"` });
      });
      // 不用标记也行：openDialog(弹窗, 触发按钮)
    })();
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <button class="sn-btn sn-primary" data-dlg="dlg-new">新建项目</button>
    <dialog class="sn-dlg" id="dlg-new" aria-labelledby="dn-t">
      <form method="dialog" novalidate>
        <div class="sn-hd">
          <div style="flex:1">
            <h3 id="dn-t">新建项目</h3>
            <div class="sn-sub">名称之后随时可以改。</div>
          </div>
          <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x="" aria-label="关闭" data-i="x"></button>
        </div>
        <div class="sn-bd">
          <div class="sn-field">
            <label class="sn-lbl" for="dn-name">项目名称</label>
            <input class="sn-input" id="dn-name">
          </div>
        </div>
        <div class="sn-ft">
          <button type="button" class="sn-btn sn-ghost" data-cancel="">取消</button>
          <button type="submit" class="sn-btn sn-primary">创建项目</button>
        </div>
      </form>
    </dialog>
  </div>
</template>
