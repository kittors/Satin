// 自定义元素的属性只认字符串：数组写成 JSON
const ITEMS = JSON.stringify(["网格","列表"]);

export default function ViewSwitch() {
  return <sn-segmented items={ITEMS} value="网格" label="视图"></sn-segmented>;
}
