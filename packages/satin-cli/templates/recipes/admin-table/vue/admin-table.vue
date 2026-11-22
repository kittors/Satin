<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { Segmented as SnSegmented, Avatar as SnAvatar, Pager as SnPager } from "satin-ui/vue";

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
    <div class="sn-app">
      <aside class="sn-side">
        <div class="sn-side-top">
          <span class="sn-logo"></span>
          <b>分镜工作台</b>
        </div>
        <nav class="sn-side-nav">
          <a class="sn-on" href="/projects" data-i="layout-grid:before">
            <span class="sn-lbl">全部项目</span>
          </a>
          <a href="/assets" data-i="image:before">
            <span class="sn-lbl">素材库</span>
          </a>
          <a href="/tasks" data-i="clock:before">
            <span class="sn-lbl">任务</span>
            <span class="sn-badge sn-soft">3</span>
          </a>
          <a href="/team" data-i="users:before">
            <span class="sn-lbl">团队</span>
          </a>
        </nav>
        <div class="sn-side-foot">
          <a href="/settings" data-i="settings:before">
            <span class="sn-lbl">设置</span>
          </a>
        </div>
      </aside>
      <main class="sn-app-main">
        <div class="sn-page sn-wide">
          <header class="sn-page-hd">
            <div>
              <h1>全部项目</h1>
              <p>共 128&nbsp;个项目，本周新增 6&nbsp;个</p>
            </div>
            <div class="sn-acts">
              <button class="sn-btn sn-secondary" data-i="download:before">导出</button>
              <button class="sn-btn sn-primary sn-tap" data-i="plus:before">新建项目</button>
            </div>
          </header>
          <div class="sn-filters">
            <span class="sn-ib sn-has-pre">
              <span class="sn-pre" data-i="search"></span>
              <input class="sn-input" placeholder="搜索项目或负责人" aria-label="搜索">
            </span>
            <SnSegmented :items='["全部","进行中","已完成","失败"]' value="全部" />
          </div>
          <div class="sn-tbl-wrap">
            <div class="sn-tbl-sc">
              <table class="sn-tbl" aria-label="项目列表">
                <thead>
                  <tr>
                    <th>项目</th>
                    <th class="sn-hide-phone">负责人</th>
                    <th>状态</th>
                    <th class="sn-r">镜头</th>
                    <th class="sn-r sn-hide-phone">更新</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>雨夜车站</td>
                    <td class="sn-hide-phone">
                      <span class="sn-name"><SnAvatar seed="u3" name="林夏" :size='20' decorative />林夏</span>
                    </td>
                    <td>
                      <span class="sn-tag sn-ok"><i></i>已完成</span>
                    </td>
                    <td class="sn-r sn-num">48</td>
                    <td class="sn-r sn-num sn-c-tertiary sn-hide-phone">3&nbsp;分钟前</td>
                    <td class="sn-r">
                      <button class="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button>
                    </td>
                  </tr>
                  <tr>
                    <td>海边的第七天</td>
                    <td class="sn-hide-phone">
                      <span class="sn-name"><SnAvatar seed="u4" name="周屿" :size='20' decorative />周屿</span>
                    </td>
                    <td>
                      <span class="sn-tag sn-run"><i></i>生成中</span>
                    </td>
                    <td class="sn-r sn-num">32</td>
                    <td class="sn-r sn-num sn-c-tertiary sn-hide-phone">1&nbsp;小时前</td>
                    <td class="sn-r">
                      <button class="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button>
                    </td>
                  </tr>
                  <tr>
                    <td>长夜</td>
                    <td class="sn-hide-phone">
                      <span class="sn-name"><SnAvatar seed="u11" name="许诺" :size='20' decorative />许诺</span>
                    </td>
                    <td>
                      <span class="sn-tag sn-bad"><i></i>失败</span>
                    </td>
                    <td class="sn-r sn-num">20</td>
                    <td class="sn-r sn-num sn-c-tertiary sn-hide-phone">昨天</td>
                    <td class="sn-r">
                      <button class="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="sn-row" style="justify-content: flex-end; margin-top: var(--sn-sp-16)">
            <SnPager :total='7' :page='1' />
          </div>
        </div>
      </main>
      <nav class="sn-tabbar" aria-label="主导航">
        <a class="sn-nav-item sn-on" href="/projects" aria-current="page" data-i="layout-grid:before">项目</a> <a class="sn-nav-item" href="/assets" data-i="image:before">素材</a> <a class="sn-nav-item" href="/tasks" data-i="clock:before">任务<span class="sn-badge sn-soft">3</span></a> <a class="sn-nav-item" href="/team" data-i="users:before">团队</a> <a class="sn-nav-item" href="/settings" data-i="settings:before">设置</a>
      </nav>
    </div>
  </div>
</template>
