<script lang="ts">
  import { toast } from "satin-ui";

  // 状态提示：底部中间出现，3 秒后自己消失
  const run = () => {
    toast({ text: "已保存到草稿箱" });
  };
</script>

<button type="button" class="sn-btn sn-secondary" onclick={run}>存草稿</button>
