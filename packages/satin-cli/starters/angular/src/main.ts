import { bootstrapApplication } from "@angular/platform-browser";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import { App } from "./app";

setup(); defineElements(); // 页面级行为整页装一次；有交互的组件用 <sn-xxx> 自定义元素（组件上加 CUSTOM_ELEMENTS_SCHEMA），纯样式的组件直接写 sn- 类名
bootstrapApplication(App).catch((e) => console.error(e));
