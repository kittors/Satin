<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { notify, toast } from "satin-ui/components";
  import "./notify-0.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root, (root: any) => {
      // 卡片在右上角叠起来：后面的底边露出 12px、最多 3 层；指针移上去展开成列表；可以一键全部清除
      // 每次点"来一条通知"按顺序来一条（tone："ok" 成功 | "bad" 失败 | "warn" 提醒；不写就是中性）
      const NOTES = [
        () => notify({ icon: "circle-check", tone: "ok", title: "第三集生成完成", body: "12 个镜头都生成好了，可以开始剪辑。", actions: [{ label: "查看", variant: "secondary", run: (card?: any) => { toast({ text: "打开第三集" }); card.close(); } }] }),
        () => notify({ icon: "circle-x", tone: "bad", title: "镜头 11 没有生成", body: "画面描述里有不允许的内容，改一下再试。" }),
        () => notify({ icon: "user-plus", title: "周屿加入了项目", body: "可以编辑分镜和配音。" }),
      ];
      let i = 0;
      for (const b of root.querySelectorAll("[data-notify]")) b.addEventListener("click", () => NOTES[i++ % NOTES.length]());
      // 每来一条都会在 document 上发 notify 事件，铃铛这类地方可以跟着记未读：document.addEventListener("notify", (e?: any) => …)
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="row">
    <button class="sn-btn sn-secondary" data-notify="" data-i="bell-ring:before">来一条通知</button>
    <span class="sn-note">连点几次看堆叠；把指针移到右上角的通知上看展开，悬停时左上角出现关闭</span>
    <span style="flex:1"></span>
    <button class="sn-btn sn-ghost sn-ibtn" id="bellBtn" data-pop="pop-bell" data-tip="通知" data-i="bell">
      <span data-i="bell"></span>
      <span class="sn-count" hidden>0</span>
    </button>
  </div>
</div>
