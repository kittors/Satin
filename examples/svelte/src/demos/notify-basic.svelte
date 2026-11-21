<script>
  import { notify } from "satin-ui";

  // 通知：右上角滑进来，不自己消失，点 × 关
  const run = () => {
    notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
  };
</script>

<button type="button" class="sn-btn sn-secondary" onclick={run}>模拟导出完成</button>
