import { ErrorHandler } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import { App } from "./app";
import { DemoErrors, Gallery } from "./gallery";
setup(); defineElements(); // 有交互的组件用 <sn-xxx> 自定义元素（模板里加 CUSTOM_ELEMENTS_SCHEMA）；纯样式的组件直接写 sn- 类名
// 打开的是 gallery.html（构建时从 index.html 另存的一份）或地址里带 ?gallery：启动全量示例（设计稿 61 块的全部演示，换上 DemoErrors：演示出错时框里写清楚），否则是同一批组件的对照页
const gallery = location.pathname.endsWith("/gallery.html") || location.search.includes("gallery");
bootstrapApplication(gallery ? Gallery : App, gallery ? { providers: [{ provide: ErrorHandler, useClass: DemoErrors }] } : undefined).catch((e) => console.error(e));
