import { createApp } from "vue";
import Satin from "satin-ui/vue";
import "satin-ui/css/page.css"; // 整页都用 Satin：令牌 + 页面级重置 + 全部组件样式（嵌进已有页面时改引 "satin-ui/css"）
import "../../shared/sink.css";
import App from "./App.vue";
// app.use(Satin) 以后模板里直接写 <SnButton>、<SnSegmented v-model="x" />……
createApp(App).use(Satin).mount("#app");
