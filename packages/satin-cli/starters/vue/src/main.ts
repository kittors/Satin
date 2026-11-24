import { createApp } from "vue";
import Satin from "satin-ui/vue";
import "satin-ui/css/page.css"; // 整页都用 Satin：令牌 + 页面级重置 + 全部组件样式
import App from "./App.vue";

// app.use(Satin) 以后，模板里直接写 <SnButton>、<SnSegmented v-model="x" />……
createApp(App).use(Satin).mount("#app");
