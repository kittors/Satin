import { Button, toast } from "satin-ui/react";

// 状态提示：底部中间出现，3 秒后自己消失
const run = () => {
  toast({ text: "已保存到草稿箱" });
};

export default function SaveDraft() {
  return <Button onClick={run}>存草稿</Button>;
}
