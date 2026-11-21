// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
import { mount } from "svelte";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "satin-ui/css/page.css";
import "../../shared/gallery.css";
import Gallery from "./Gallery.svelte";
setup(); defineElements(); // 应用入口调一次
mount(Gallery, { target: document.getElementById("app") });
