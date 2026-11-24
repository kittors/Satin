// 自定义元素的属性只认字符串：数组写成 JSON
const STATUSES = JSON.stringify([
  { value: "draft", label: "草稿" },
  { value: "review", label: "待审核" },
  { value: "done", label: "已完成", disabled: true },
]);

export default function StatusSelect() {
  return <sn-select items={STATUSES} value="draft" label="状态"></sn-select>;
}
