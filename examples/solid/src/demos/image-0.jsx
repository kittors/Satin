import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { openLightbox } from "satin-ui/lightbox";
import "./image-0.css";

export default function ImageDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      // 缩略图：加载中显示骨架，加载好淡入（.sn-loaded），失败显示重试（.sn-failed）。这里用定时器模拟加载，第 4 张模拟失败
      const grid = root.querySelector("#imgGrid");
      const ims = () => [...grid.querySelectorAll(".sn-im")];
      function load() {
        ims().forEach((im, i) => { im.classList.remove("sn-loaded", "sn-failed"); setTimeout(() => im.classList.add(i === 3 ? "sn-failed" : "sn-loaded"), 400 + i * 260 + Math.random() * 300); });
      }
      load();
      root.querySelector("[data-img-reload]").addEventListener("click", load);

      // 点开：从缩略图那里放大到铺满窗口，关上时缩回去；能放大缩小、拖动、旋转、还原，← → 翻页、Esc 关闭
      // 每一项：src（图片地址）+ size（原图宽高）；这里的缩略图是 CSS 背景，就传 bg + ratio
      const RATIO = new Map([["16:9", 16 / 9], ["1:1", 1], ["4:3", 4 / 3], ["9:16", 9 / 16]]);
      const items = () => ims().map((im) => ({ bg: getComputedStyle(im).getPropertyValue("--sn-g") || im.style.getPropertyValue("--sn-g"), ratio: RATIO.get(im.querySelector(".sn-tag-ratio")?.textContent.trim()) || 16 / 9 }));
      const thumbOf = (i) => grid.querySelector(`.sn-im[data-n="${i}"]`), enabled = (i) => thumbOf(i)?.classList.contains("sn-loaded");
      grid.addEventListener("click", (e) => {
        const retry = e.target.closest("[data-img-retry]"), im = e.target.closest(".sn-im");
        if (retry) { im.classList.remove("sn-failed"); setTimeout(() => im.classList.add("sn-loaded"), 700); return; } // 换成真的重新请求
        if (im?.classList.contains("sn-loaded")) openLightbox(items(), Number(im.dataset.n), { thumbOf, enabled });
      });
      grid.addEventListener("keydown", (e) => { const im = e.target.closest(".sn-im"); if (im && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); im.click(); } });
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sn-img-grid" id="imgGrid">
        <div class="sn-im sn-loaded" data-n="0">
          <span class="sn-ph sn-sk"></span>
          <span class="sn-pic"></span>
          <span class="sn-tag-ratio">16:9</span>
          <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button class="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
        <div class="sn-im sn-loaded" data-n="1">
          <span class="sn-ph sn-sk"></span>
          <span class="sn-pic"></span>
          <span class="sn-tag-ratio">1:1</span>
          <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button class="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
        <div class="sn-im" data-n="2">
          <span class="sn-ph sn-sk"></span>
          <span class="sn-pic"></span>
          <span class="sn-tag-ratio">4:3</span>
          <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button class="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
        <div class="sn-im" data-n="3">
          <span class="sn-ph sn-sk"></span>
          <span class="sn-pic"></span>
          <span class="sn-tag-ratio">9:16</span>
          <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button class="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
        <div class="sn-im" data-n="4">
          <span class="sn-ph sn-sk"></span>
          <span class="sn-pic"></span>
          <span class="sn-tag-ratio">16:9</span>
          <div class="sn-err"><span data-i="image-off"></span>图片加载失败<button class="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
      </div>
      <div class="row" style="margin-top:14px">
        <button class="sn-btn sn-secondary" data-img-reload="" data-i="refresh-cw:before">重新加载</button>
        <span class="sn-note">第 4 张模拟加载失败</span>
      </div>
    </div>
  );
}
