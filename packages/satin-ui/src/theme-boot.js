// 第一帧之前先把主题写到根元素上：深浅、圆角，以及改过的主色、状态色、字体、字号。
// 放在 <head> 里同步加载（<script src="theme-boot.js"></script>）；模块脚本要等全部加载完才跑，没有这一步刷新时会先闪一下默认主题。
(() => {
  const d = document.documentElement;
  try {
    const p = localStorage.getItem("satin-theme") || "auto";
    d.dataset.theme = p === "auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : p;
    d.dataset.radius = localStorage.getItem("satin-radius") || "pill";
    const c = JSON.parse(localStorage.getItem("satin-custom-css") || "null");
    for (const [k, v] of Object.entries((c && c[d.dataset.theme]) || {})) d.style.setProperty(k, v);
  } catch {}
})();
