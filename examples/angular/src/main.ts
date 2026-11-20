import { bootstrapApplication } from "@angular/platform-browser";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import { App } from "./app";
setup(); defineElements(); // 有交互的组件用 <sn-xxx> 自定义元素（模板里加 CUSTOM_ELEMENTS_SCHEMA）；纯样式的组件直接写 sn- 类名
bootstrapApplication(App).catch((e) => console.error(e));
