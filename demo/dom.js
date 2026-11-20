// 展示页自己的查找函数：嵌入模式（官网文档里的演示 iframe，index.html?embed=区块）只把要演示的那一块留在页面上，
// 别的区块挪进一个不挂到页面上的容器（window.__satinRest，见 index.html 末尾）。在整页里按选择器找不到时再去那里找——
// 各区块的接线代码照样跑、不报错，但那些元素不算样式、不排版、不画。这是展示页的事，不放进组件库（库里的 $ 只在 document 里找）。
const rest = () => globalThis.__satinRest;
export const $ = (s, r = document) => r.querySelector(s) ?? (r === document && rest() ? rest().querySelector(s) : null);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
