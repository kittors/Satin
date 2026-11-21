"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Segmented } from "satin-ui/react";

export default function Dashboard() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-page">
        <header className="sn-page-hd">
          <div>
            <h1>本周概览</h1>
            <p>11 月 14 日 – 11 月 20 日</p>
          </div>
          <div className="sn-acts">
            <Segmented items={["本周","本月","全年"]} defaultValue="本周" />
          </div>
        </header>
        <div className="sn-panel" style={{ marginBottom: "var(--sn-sp-24)" }}>
          <div className="sn-cols" style={{ "--sn-min": "160px" }}>
            <div className="sn-stat">
              <span>生成的镜头</span>
              <b>1,284</b>
              <small className="sn-up">比上周 +12%</small>
            </div>
            <div className="sn-stat">
              <span>完成的项目</span>
              <b>36</b>
              <small>比上周 +4</small>
            </div>
            <div className="sn-stat">
              <span>平均生成时长</span>
              <b>2 分 18 秒</b>
              <small className="sn-down">比上周慢 9 秒</small>
            </div>
            <div className="sn-stat">
              <span>本月用量</span>
              <b>68%</b>
              <small>还剩 3,200 次</small>
            </div>
          </div>
        </div>
        <div className="sn-with-aside" style={{ "--sn-aside": "340px" }}>
          <section className="sn-panel">
            <div className="sn-panel-hd">
              <h2>各状态的项目</h2>
              <a className="sn-t-callout" href="/projects">全部项目</a>
            </div>
            <div className="sn-stack sn-gap-16">
              <div className="sn-stack sn-gap-8">
                <div className="sn-row sn-between">
                  <span>已完成</span>
                  <span className="sn-num sn-c-secondary">58</span>
                </div>
                <div className="sn-pbar" style={{ "--sn-p": ".45" }}>
                  <i></i>
                </div>
              </div>
              <div className="sn-stack sn-gap-8">
                <div className="sn-row sn-between">
                  <span>生成中</span>
                  <span className="sn-num sn-c-secondary">31</span>
                </div>
                <div className="sn-pbar" style={{ "--sn-p": ".24" }}>
                  <i></i>
                </div>
              </div>
              <div className="sn-stack sn-gap-8">
                <div className="sn-row sn-between">
                  <span>待审核</span>
                  <span className="sn-num sn-c-secondary">27</span>
                </div>
                <div className="sn-pbar" style={{ "--sn-p": ".21" }}>
                  <i></i>
                </div>
              </div>
              <div className="sn-stack sn-gap-8">
                <div className="sn-row sn-between">
                  <span>失败</span>
                  <span className="sn-num sn-c-secondary">12</span>
                </div>
                <div className="sn-pbar" style={{ "--sn-p": ".09" }}>
                  <i></i>
                </div>
              </div>
            </div>
          </section>
          <section className="sn-panel">
            <div className="sn-panel-hd">
              <h2>最近动态</h2>
            </div>
            <div className="sn-stack sn-gap-12">
              <div className="sn-row sn-gap-8">
                <span className="sn-av sn-sm" style={{ "--sn-h": "210" }}>林</span>
                <div className="sn-grow"><b>林夏</b> 完成了「雨夜车站」<div className="sn-t-caption sn-c-tertiary">3 分钟前</div></div>
              </div>
              <div className="sn-row sn-gap-8">
                <span className="sn-av sn-sm" style={{ "--sn-h": "30" }}>周</span>
                <div className="sn-grow"><b>周屿</b> 上传了 12 张素材<div className="sn-t-caption sn-c-tertiary">1 小时前</div></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
