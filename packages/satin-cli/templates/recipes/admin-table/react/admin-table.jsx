"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Segmented, Pager } from "satin-ui/react";

export default function AdminTable() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-app">
        <aside className="sn-side">
          <div className="sn-side-top">
            <span className="sn-logo"></span>
            <b>分镜工作台</b>
          </div>
          <nav className="sn-side-nav">
            <a className="sn-on" href="/projects" data-i="layout-grid:before">
              <span className="sn-lbl">全部项目</span>
            </a>
            <a href="/assets" data-i="image:before">
              <span className="sn-lbl">素材库</span>
            </a>
            <a href="/tasks" data-i="clock:before">
              <span className="sn-lbl">任务</span>
              <span className="sn-badge sn-soft">3</span>
            </a>
            <a href="/team" data-i="users:before">
              <span className="sn-lbl">团队</span>
            </a>
          </nav>
          <div className="sn-side-foot">
            <a href="/settings" data-i="settings:before">
              <span className="sn-lbl">设置</span>
            </a>
          </div>
        </aside>
        <main className="sn-app-main">
          <div className="sn-page sn-wide">
            <header className="sn-page-hd">
              <div>
                <h1>全部项目</h1>
                <p>共 128 个项目，本周新增 6 个</p>
              </div>
              <div className="sn-acts">
                <button className="sn-btn sn-secondary" data-i="download:before">导出</button>
                <button className="sn-btn sn-primary" data-i="plus:before">新建项目</button>
              </div>
            </header>
            <div className="sn-row" style={{ marginBottom: "var(--sn-sp-16)" }}>
              <span className="sn-ib sn-has-pre" style={{ width: "240px" }}>
                <span className="sn-pre" data-i="search"></span>
                <input className="sn-input" placeholder="搜索项目或负责人" aria-label="搜索" />
              </span>
              <Segmented items={["全部","进行中","已完成","失败"]} defaultValue="全部" />
            </div>
            <div className="sn-tbl-wrap">
              <div className="sn-tbl-sc">
                <table className="sn-tbl" aria-label="项目列表">
                  <thead>
                    <tr>
                      <th>项目</th>
                      <th>负责人</th>
                      <th>状态</th>
                      <th className="sn-r">镜头</th>
                      <th className="sn-r">更新</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <b>雨夜车站</b>
                      </td>
                      <td>
                        <span className="sn-name"><span className="sn-av sn-xs" style={{ "--sn-h": "210" }}>林</span>林夏</span>
                      </td>
                      <td>
                        <span className="sn-tag sn-ok"><i></i>已完成</span>
                      </td>
                      <td className="sn-r sn-num">48</td>
                      <td className="sn-r sn-num sn-c-tertiary">3 分钟前</td>
                      <td className="sn-r">
                        <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="更多" data-i="ellipsis"></button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>海边的第七天</b>
                      </td>
                      <td>
                        <span className="sn-name"><span className="sn-av sn-xs" style={{ "--sn-h": "30" }}>周</span>周屿</span>
                      </td>
                      <td>
                        <span className="sn-tag sn-run"><i></i>生成中</span>
                      </td>
                      <td className="sn-r sn-num">32</td>
                      <td className="sn-r sn-num sn-c-tertiary">1 小时前</td>
                      <td className="sn-r">
                        <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="更多" data-i="ellipsis"></button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>长夜</b>
                      </td>
                      <td>
                        <span className="sn-name"><span className="sn-av sn-xs" style={{ "--sn-h": "280" }}>许</span>许诺</span>
                      </td>
                      <td>
                        <span className="sn-tag sn-bad"><i></i>失败</span>
                      </td>
                      <td className="sn-r sn-num">20</td>
                      <td className="sn-r sn-num sn-c-tertiary">昨天</td>
                      <td className="sn-r">
                        <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="更多" data-i="ellipsis"></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="sn-row sn-between" style={{ marginTop: "var(--sn-sp-16)" }}>
              <span className="sn-t-callout sn-c-tertiary">第 1–20 条，共 128 条</span>
              <Pager total={7} defaultPage={1} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
