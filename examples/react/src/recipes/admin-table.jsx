import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Segmented, Avatar, Pager } from "satin-ui/react";

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
                <p>共 128&nbsp;个项目，本周新增 6&nbsp;个</p>
              </div>
              <div className="sn-acts">
                <button className="sn-btn sn-secondary" data-i="download:before">导出</button>
                <button className="sn-btn sn-primary sn-tap" data-i="plus:before">新建项目</button>
              </div>
            </header>
            <div className="sn-filters">
              <span className="sn-ib sn-has-pre">
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
                      <th className="sn-hide-phone">负责人</th>
                      <th>状态</th>
                      <th className="sn-r">镜头</th>
                      <th className="sn-r sn-hide-phone">更新</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>雨夜车站</td>
                      <td className="sn-hide-phone">
                        <span className="sn-name"><Avatar seed="u3" name="林夏" size={20} decorative />林夏</span>
                      </td>
                      <td>
                        <span className="sn-tag sn-ok"><i></i>已完成</span>
                      </td>
                      <td className="sn-r sn-num">48</td>
                      <td className="sn-r sn-num sn-c-tertiary sn-hide-phone">3&nbsp;分钟前</td>
                      <td className="sn-r">
                        <button className="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button>
                      </td>
                    </tr>
                    <tr>
                      <td>海边的第七天</td>
                      <td className="sn-hide-phone">
                        <span className="sn-name"><Avatar seed="u4" name="周屿" size={20} decorative />周屿</span>
                      </td>
                      <td>
                        <span className="sn-tag sn-run"><i></i>生成中</span>
                      </td>
                      <td className="sn-r sn-num">32</td>
                      <td className="sn-r sn-num sn-c-tertiary sn-hide-phone">1&nbsp;小时前</td>
                      <td className="sn-r">
                        <button className="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button>
                      </td>
                    </tr>
                    <tr>
                      <td>长夜</td>
                      <td className="sn-hide-phone">
                        <span className="sn-name"><Avatar seed="u11" name="许诺" size={20} decorative />许诺</span>
                      </td>
                      <td>
                        <span className="sn-tag sn-bad"><i></i>失败</span>
                      </td>
                      <td className="sn-r sn-num">20</td>
                      <td className="sn-r sn-num sn-c-tertiary sn-hide-phone">昨天</td>
                      <td className="sn-r">
                        <button className="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="sn-row" style={{ justifyContent: "flex-end", marginTop: "var(--sn-sp-16)" }}>
              <Pager total={7} defaultPage={1} />
            </div>
          </div>
        </main>
        <nav className="sn-tabbar" aria-label="主导航">
          <a className="sn-nav-item sn-on" href="/projects" aria-current="page" data-i="layout-grid:before">项目</a>
          {" "}
          <a className="sn-nav-item" href="/assets" data-i="image:before">素材</a>
          {" "}
          <a className="sn-nav-item" href="/tasks" data-i="clock:before">任务<span className="sn-badge sn-soft">3</span></a>
          {" "}
          <a className="sn-nav-item" href="/team" data-i="users:before">团队</a>
          {" "}
          <a className="sn-nav-item" href="/settings" data-i="settings:before">设置</a>
        </nav>
      </div>
    </div>
  );
}
