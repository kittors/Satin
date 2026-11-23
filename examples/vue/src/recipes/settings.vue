<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { Segmented as SnSegmented } from "satin-ui/vue";

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
    <div class="sn-page sn-narrow">
      <header class="sn-page-hd">
        <div>
          <h1>设置</h1>
        </div>
      </header>
      <div class="sn-panel">
        <section class="sn-setting">
          <div>
            <h3>个人资料</h3>
            <p>团队成员会看到你的名字。</p>
          </div>
          <form class="sn-form" novalidate>
            <div class="sn-field" data-f="name">
              <label class="sn-lbl" for="s-name">名字</label>
              <input class="sn-input" id="s-name" value="林夏">
              <div class="sn-err">
                <span></span>
              </div>
            </div>
            <div class="sn-field" data-f="mail">
              <label class="sn-lbl" for="s-mail">邮箱</label>
              <input class="sn-input" id="s-mail" type="email" value="linxia@example.com">
              <div class="sn-help">用来登录和接收通知。</div>
              <div class="sn-err">
                <span></span>
              </div>
            </div>
            <div class="sn-form-ft">
              <button class="sn-btn sn-primary" type="submit">保存修改</button>
            </div>
          </form>
        </section>
        <section class="sn-setting">
          <div>
            <h3>通知</h3>
            <p>发到上面的邮箱，改了马上生效。</p>
          </div>
          <div class="sn-stack sn-gap-12">
            <label class="sn-switch"><input type="checkbox" role="switch" checked><span class="sn-track">
  <span class="sn-knob"></span>
</span>生成完成时提醒我</label>
            <label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track">
  <span class="sn-knob"></span>
</span>每周发一封项目周报</label>
          </div>
        </section>
        <section class="sn-setting">
          <div>
            <h3>默认画面比例</h3>
            <p>新建项目时用这个比例。</p>
          </div>
          <div>
            <SnSegmented :items='["16:9 横屏","9:16 竖屏","1:1 方形"]' value="16:9 横屏" />
          </div>
        </section>
        <section class="sn-setting">
          <div>
            <h3>导出格式</h3>
            <p>点“导出”时默认生成的文件。</p>
          </div>
          <div>
            <SnSegmented :items='["PDF 分镜本","Excel 拍摄表"]' value="PDF 分镜本" />
          </div>
        </section>
        <section class="sn-setting">
          <div>
            <h3>删除账户</h3>
            <p>所有项目和素材会一起删除，不能恢复。</p>
          </div>
          <div>
            <button class="sn-btn sn-danger-soft">删除账户…</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
