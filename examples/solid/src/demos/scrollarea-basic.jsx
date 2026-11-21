import { onSettled } from "solid-js";
import { createScrollArea } from "satin-ui";

export default function SceneList() {
  let host;
  // 写法和 div 一样，限高写在 style 上；滚动条细、不滚 0.7 秒后淡出；上下还有内容时边缘渐隐；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createScrollArea(host, {});
    return () => it.destroy();
  });
  return (
    <div ref={(el) => (host = el)} class="sn-sa-vp" style="max-height:160px">
      <p>第 1 场 · 车站外</p>
      <p>第 2 场 · 候车厅</p>
      <p>第 3 场 · 站台</p>
      <p>第 4 场 · 车厢里</p>
      <p>第 5 场 · 雨夜</p>
      <p>第 6 场 · 回忆</p>
      <p>第 7 场 · 告别</p>
      <p>第 8 场 · 清晨</p>
      <p>第 9 场 · 天台</p>
      <p>第 10 场 · 便利店</p>
    </div>
  );
}
