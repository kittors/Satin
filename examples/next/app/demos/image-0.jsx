"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { openLightbox } from "satin-ui/lightbox";
import "./image-0.css";

export default function ImageDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
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
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-img-grid" id="imgGrid">
        <div className="sn-im sn-loaded" data-n="0">
          <span className="sn-ph sn-sk"></span>
          <span className="sn-pic"></span>
          <span className="sn-tag-ratio">16:9</span>
          <div className="sn-err"><span data-i="image-off"></span>图片加载失败<button className="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
        <div className="sn-im sn-loaded" data-n="1">
          <span className="sn-ph sn-sk"></span>
          <span className="sn-pic"></span>
          <span className="sn-tag-ratio">1:1</span>
          <div className="sn-err"><span data-i="image-off"></span>图片加载失败<button className="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
        <div className="sn-im" data-n="2">
          <span className="sn-ph sn-sk"></span>
          <span className="sn-pic"></span>
          <span className="sn-tag-ratio">4:3</span>
          <div className="sn-err"><span data-i="image-off"></span>图片加载失败<button className="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
        <div className="sn-im" data-n="3">
          <span className="sn-ph sn-sk"></span>
          <span className="sn-pic"></span>
          <span className="sn-tag-ratio">9:16</span>
          <div className="sn-err"><span data-i="image-off"></span>图片加载失败<button className="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
        <div className="sn-im" data-n="4">
          <span className="sn-ph sn-sk"></span>
          <span className="sn-pic"></span>
          <span className="sn-tag-ratio">16:9</span>
          <div className="sn-err"><span data-i="image-off"></span>图片加载失败<button className="sn-textbtn" data-img-retry="">重试</button></div>
        </div>
      </div>
      <div className="row" style={{ marginTop: "14px" }}>
        <button className="sn-btn sn-secondary" data-img-reload="" data-i="refresh-cw:before">重新加载</button>
        <span className="sn-note">第 4 张模拟加载失败</span>
      </div>
    </div>
  );
}
