import { mount } from "svelte";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "./styles.js";
import App from "./App.svelte";
setup(); defineElements(); // 有交互的组件用 <sn-xxx> 自定义元素；纯样式的组件直接写 sn- 类名
mount(App, { target: document.getElementById("app") });
