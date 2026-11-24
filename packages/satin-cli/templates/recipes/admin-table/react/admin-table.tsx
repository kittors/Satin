import { useEffect, useRef } from "react";
import { setup, enhance, createBrowserTabs, createTable, avatarHTML } from "satin-ui";
import { Segmented } from "satin-ui/react";

export default function AdminTable() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      createBrowserTabs(root.querySelector("#work-tabs"), {
        tabs: [
          { id: "projects", title: "全部项目", icon: "layout-grid", pinned: true },
          { id: "station", title: "雨夜车站 · 分镜", icon: "film" },
          { id: "tasks", title: "渲染任务", icon: "clock", dot: "ok" },
        ],
        active: "projects",
      });
      createTable(root.querySelector("#projects-table"), {
        columns: [
          { key: "name", title: "项目", fixed: "left", width: 220, sortable: true, html: (v?: any) => `<b>${v}</b>` },
          { key: "owner", title: "负责人", width: 132, html: (v?: any, r?: any) => `<span class="sn-name">${avatarHTML({ seed: r.uid, name: v, size: 20, decorative: true })}${v}</span>` },
          { key: "status", title: "状态", width: 112, html: (v?: any) => `<span class="sn-tag ${v.tone}"><i></i>${v.text}</span>` },
          { key: "shots", title: "镜头", width: 96, align: "right", sortable: true },
          { key: "res", title: "分辨率", width: 120, className: "sn-num sn-c-secondary" },
          { key: "updated", title: "更新时间", width: 120, align: "right", className: "sn-num sn-c-tertiary" },
          { key: "acts", type: "actions", fixed: "right", width: 72, html: () => `<button class="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button>` },
        ],
        data: [
          { id: "p1", name: "雨夜车站", uid: "u3", owner: "林夏", status: { tone: "sn-ok", text: "已完成" }, shots: 48, res: "4K · 24fps", updated: "3 分钟前" },
          { id: "p2", name: "海边的第七天", uid: "u4", owner: "周屿", status: { tone: "sn-run", text: "生成中" }, shots: 32, res: "2K · 24fps", updated: "1 小时前" },
          { id: "p3", name: "长夜", uid: "u11", owner: "许诺", status: { tone: "sn-bad", text: "失败" }, shots: 20, res: "4K · 30fps", updated: "昨天" },
        ],
        selectable: true,
        fill: true,
        pagination: { pageSize: 12, pageSizes: [10, 20, 50] },
        label: "项目列表",
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-app sn-workbench" data-navfx="slide">
        <aside className="sn-side">
          <div className="sn-side-top">
            <span className="sn-logo"></span>
            <b>分镜工作台</b>
            <button type="button" className="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse="" data-tip="收起侧栏" data-kbd={"⌘\\"} data-i="panel-left" aria-label="收起侧栏"></button>
          </div>
          <nav className="sn-side-nav" aria-label="工作台导航">
            <span className="sn-hl-bar" aria-hidden="true"></span>
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
        <div className="sn-app-shell">
          <div id="work-tabs"></div>
          <main className="sn-work-body">
            <div className="sn-page sn-work">
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
              <div id="projects-table"></div>
            </div>
          </main>
        </div>
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
