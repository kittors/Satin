// 自定义元素的属性只认字符串：数组写成 JSON
const TAGS = JSON.stringify(["雨夜", "车站"]);

export default function SceneTags() {
  return <sn-tag-input tags={TAGS}></sn-tag-input>;
}
