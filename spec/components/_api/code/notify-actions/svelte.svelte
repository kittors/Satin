<script lang="ts">
  import { notify } from "satin-ui";

  const run = () => {
    notify({
      title: "林夏邀请你一起编辑“雨夜车站”",
      body: "你会看到她改的分镜，她也会看到你的。",
      icon: "users",
      time: "2 分钟前",
      // 按钮点了跑 run(卡片)；要关上就调 card.close()
      actions: [
        { label: "接受", variant: "primary", run: (card) => card.close() },
        { label: "稍后", run: (card) => card.close() },
      ],
    });
  };
</script>

<button type="button" class="sn-btn sn-secondary" onclick={run}>模拟收到邀请</button>
