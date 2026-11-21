import { toast } from "satin-ui";

const run = () => {
  toast({
    kind: "action",
    text: "已归档“雨夜车站”",
    // 能撤销的操作不确认：直接做，再给"撤销"（5 秒倒计时，鼠标移上去暂停）
    action: { label: "撤销", run: (t) => t.update({ kind: "status", text: "已恢复“雨夜车站”", done: true, duration: 2000 }) },
  });
};

export default function ArchiveProject() {
  return <button type="button" class="sn-btn sn-secondary" onClick={run}>归档</button>;
}
