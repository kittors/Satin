import { notify } from "satin-ui";

const run = () => {
  notify({
    title: "第 12 个镜头生成失败",
    body: "画面描述里有不能生成的内容，改一下再试。",
    tone: "bad",
    time: "刚刚",
    actions: [{ label: "去修改", variant: "primary", run: (card) => card.close() }],
  });
};

export default function RenderFailed() {
  return <button type="button" class="sn-btn sn-secondary" onClick={run}>模拟生成失败</button>;
}
