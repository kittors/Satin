<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createCollapse, bindCollapses } from "satin-ui/components";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value, (root) => {
    // 点条目标题展开 / 收起（高度过渡）；single：同时只开一项
    const faq = createCollapse(root.querySelector(".sn-acc"), {
      single: true,
      onToggle: ({ open }) => console.log(open ? "展开" : "收起"),
    });
    faq.open(0);

    // 或者把页面上所有 .sn-acc 一次接上
    bindCollapses(document);

    // 不写标记也行：给一个空容器，按选项渲染
    createCollapse(root.querySelector("#faq"), {
      items: [{ title: "导出的成片放在哪里？", content: "默认放在“下载”文件夹里。" }, { title: "能多人一起编辑吗？", content: "可以，在设置里邀请协作者。" }],
      open: [0],
    });
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="sn-acc" id="acc">
      <div class="sn-acc-item sn-open">
        <button class="sn-acc-hd" aria-expanded="true"><span data-i="chevron-right"></span>导出的成片放在哪里？</button>
        <div class="sn-acc-bd">
          <div>
            <p>默认放在"下载"文件夹里，以项目名建一个子文件夹。可以在设置 → 导出里改。</p>
          </div>
        </div>
      </div>
      <div class="sn-acc-item">
        <button class="sn-acc-hd" aria-expanded="false"><span data-i="chevron-right"></span>额度用完了会怎样？</button>
        <div class="sn-acc-bd">
          <div>
            <p>新的生成会排队，等额度恢复或充值后自动继续，已经提交的任务不会丢。</p>
          </div>
        </div>
      </div>
      <div class="sn-acc-item">
        <button class="sn-acc-hd" aria-expanded="false"><span data-i="chevron-right"></span>可以多人一起编辑一个项目吗？</button>
        <div class="sn-acc-bd">
          <div>
            <p>可以。在项目里点"分享"，把链接发给协作者；同一个镜头同一时间只能一个人编辑，别人会看到"正在编辑"。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
