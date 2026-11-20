// 展示页的演示素材：场景图（官网和展示页都用真实照片，不用渐变色块冒充图片）。组件库里不带这些。
export const SCENES = [
  "radial-gradient(110% 80% at 72% 18%, rgba(244,194,122,.42), transparent 60%), linear-gradient(160deg, #2c3b50, #0e131b)",
  "radial-gradient(90% 60% at 50% 112%, rgba(246,208,160,.6), transparent 62%), linear-gradient(180deg, #8fb3c9, #3b5d76 60%, #1d2f3d)",
  "radial-gradient(70% 60% at 25% 30%, rgba(255,236,200,.35), transparent 70%), linear-gradient(160deg, #c9a77c, #6d5233 70%, #2e2216)",
  "radial-gradient(60% 50% at 30% 30%, rgba(125,108,255,.3), transparent 70%), linear-gradient(200deg, #1e1b3a, #07060f)",
  "radial-gradient(80% 50% at 70% 0%, rgba(255,255,230,.45), transparent 70%), linear-gradient(180deg, #9cc3a0, #4c7a5a 55%, #233b2c)",
  "radial-gradient(80% 36% at 50% 52%, rgba(255,255,255,.16), transparent 70%), linear-gradient(90deg, #1c2a36, #3a4b5a 50%, #1c2a36)",
];
// 官网里（嵌入模式、或地址带 ?photos）用真实照片代替上面的渐变占位：和六个场景的气氛对应（雨夜、海边、暖光旧屋、长夜、山野、雾）。
// 照片来自 Unsplash（Unsplash License，可免费商用），作者在官网"素材来源"里列出
export const PHOTOS = ["1516900557549-41557d405adf", "1511087273610-b219e302a808", "1471341971476-ae15ff5dd4ea", "1554103577-c0d26e9b90e0", "1705435896415-933b94be4ea5", "1727806935726-e380d295c559"]
  .map((id) => `url('https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&q=70') center / cover, #2a2f36`);
/* 单引号：这串会被写进 style="--g:…" 里 */
SCENES.splice(0, SCENES.length, ...PHOTOS);
