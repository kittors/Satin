import { bootstrapApplication } from "@angular/platform-browser";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import { App } from "./app";
import { Gallery } from "./gallery";
setup(); defineElements(); // 有交互的组件用 <sn-xxx> 自定义元素（模板里加 CUSTOM_ELEMENTS_SCHEMA）；纯样式的组件直接写 sn- 类名
// 地址里带 ?gallery：启动全量示例（设计稿 61 块的全部演示），否则是同一批组件的对照页
bootstrapApplication(location.search.includes("gallery") ? Gallery : App).catch((e) => console.error(e));
