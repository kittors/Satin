import Satin from "satin-ui/vue";

// 注册以后模板里直接写 <SnButton>、<SnSegmented v-model="x" />……（服务端也能渲染，交互在水合以后接上）
export default defineNuxtPlugin((nuxtApp) => { nuxtApp.vueApp.use(Satin); });
