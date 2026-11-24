// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
import { createApp } from "vue";
import Satin from "satin-ui/vue";
import { defineElements } from "satin-ui/elements";
import "satin-ui/css/page.css";
import "../../shared/gallery.css";
import Gallery from "./Gallery.vue";
defineElements();
createApp(Gallery).use(Satin).mount("#app"); // app.use(Satin)：注册 <SnXxx> 组件、装好页面级行为
