<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createScrollArea } from "satin-ui/components";
import "satin-ui/css/data.css";
import "satin-ui/css/scroll.css";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value, (root) => {
    // .sn-tbl-sc 限高（--sn-tbl-max）以后在框里滚；表头 position: sticky 吸在顶上
    // 不加边缘渐隐（fade: "none"），免得表头被淡掉；表格不回弹：滚到头就停住，再滚一次交给页面
    createScrollArea(root.querySelector(".sn-tbl-sc"), { fade: "none" });
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="sn-tbl-wrap" style="--sn-tbl-max:248px">
      <div class="sn-tbl-sc">
        <table class="sn-tbl" aria-label="项目列表">
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
            <tr>
              <td>
                <b>雨夜车站</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span>
              </td>
              <td>
                <span class="sn-tag sn-ok"><i></i>已完成</span>
              </td>
              <td class="sn-r sn-num">48</td>
              <td class="sn-r sn-num">12:36</td>
            </tr>
            <tr>
              <td>
                <b>海边的第七天</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span>
              </td>
              <td>
                <span class="sn-tag sn-run"><i></i>生成中</span>
              </td>
              <td class="sn-r sn-num">32</td>
              <td class="sn-r sn-num">8:32</td>
            </tr>
            <tr>
              <td>
                <b>城南旧事（第二版）</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:150">陈</span>陈默</span>
              </td>
              <td>
                <span class="sn-tag "><i></i>草稿</span>
              </td>
              <td class="sn-r sn-num">12</td>
              <td class="sn-r sn-num">3:00</td>
            </tr>
            <tr>
              <td>
                <b>长夜</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:280">许</span>许诺</span>
              </td>
              <td>
                <span class="sn-tag sn-bad"><i></i>失败</span>
              </td>
              <td class="sn-r sn-num">20</td>
              <td class="sn-r sn-num">5:00</td>
            </tr>
            <tr>
              <td>
                <b>山那边的学校</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:340">李</span>李然</span>
              </td>
              <td>
                <span class="sn-tag sn-warn"><i></i>待审核</span>
              </td>
              <td class="sn-r sn-num">64</td>
              <td class="sn-r sn-num">17:02</td>
            </tr>
            <tr>
              <td>
                <b>最后一班地铁</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span>
              </td>
              <td>
                <span class="sn-tag sn-ok"><i></i>已完成</span>
              </td>
              <td class="sn-r sn-num">28</td>
              <td class="sn-r sn-num">7:00</td>
            </tr>
            <tr>
              <td>
                <b>雾港</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span>
              </td>
              <td>
                <span class="sn-tag sn-ok"><i></i>已完成</span>
              </td>
              <td class="sn-r sn-num">40</td>
              <td class="sn-r sn-num">10:15</td>
            </tr>
            <tr>
              <td>
                <b>春天的信</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:150">陈</span>陈默</span>
              </td>
              <td>
                <span class="sn-tag "><i></i>草稿</span>
              </td>
              <td class="sn-r sn-num">6</td>
              <td class="sn-r sn-num">1:30</td>
            </tr>
            <tr>
              <td>
                <b>旧城区</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:280">许</span>许诺</span>
              </td>
              <td>
                <span class="sn-tag sn-run"><i></i>生成中</span>
              </td>
              <td class="sn-r sn-num">36</td>
              <td class="sn-r sn-num">9:12</td>
            </tr>
            <tr>
              <td>
                <b>天台</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:340">李</span>李然</span>
              </td>
              <td>
                <span class="sn-tag sn-ok"><i></i>已完成</span>
              </td>
              <td class="sn-r sn-num">22</td>
              <td class="sn-r sn-num">4:48</td>
            </tr>
            <tr>
              <td>
                <b>便利店</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span>
              </td>
              <td>
                <span class="sn-tag "><i></i>草稿</span>
              </td>
              <td class="sn-r sn-num">9</td>
              <td class="sn-r sn-num">2:05</td>
            </tr>
            <tr>
              <td>
                <b>地铁口</b>
              </td>
              <td>
                <span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span>
              </td>
              <td>
                <span class="sn-tag sn-warn"><i></i>待审核</span>
              </td>
              <td class="sn-r sn-num">30</td>
              <td class="sn-r sn-num">6:40</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
