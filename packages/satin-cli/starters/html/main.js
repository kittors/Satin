// 页面级行为整页装一次（setup）；注册 <sn-xxx> 自定义元素；把写在标记上的交互一次接上、data-i 换成图标（enhance）
import { setup, enhance } from "satin-ui";
import { toast } from "satin-ui/components";
import { defineElements } from "satin-ui/elements";

setup(); defineElements(); enhance();

const name = document.getElementById("p-name");
let view = "网格";
document.querySelector("sn-segmented").addEventListener("sn-change", (e) => (view = e.detail));
document.getElementById("create").addEventListener("click", () => {
  toast({ text: `已创建「${name.value.trim() || "未命名项目"}」，默认视图：${view}` });
});
