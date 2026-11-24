import { render, h } from "preact";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "satin-ui/css/page.css"; // 整页都用 Satin：令牌 + 页面级重置 + 全部组件样式
import App from "./App";

setup(); defineElements(); // 页面级行为整页装一次；有交互的组件用 <sn-xxx> 自定义元素，纯样式的组件直接写 sn- 类名
render(h(App, null), document.getElementById("app")!);
