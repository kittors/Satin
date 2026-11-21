"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance, createTable, toast } from "satin-ui";
import "satin-ui/css/data.css";
import "./table-8.css";

export default function TableDemo8() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 真数据的表格：createTable（React <Table>、Vue <SnTable>）——点表头排序（行移到新位置，相邻行错开 15ms）、勾选（全选、半选）、
      // 空状态、加载中（骨架行）、数字列右对齐等宽；斑马纹 / 紧凑 / 无外框 / 网格线 / 限高时表头固定都是选项。
      // 多级展开、合并、拖动行列、改列宽行高这几样还只在展示页里接（这个完整示例），没有做成公开的选项。
      const rows = [
        { id: 1, name: "雨夜车站", owner: "林夏", status: ["sn-ok", "已完成"], shots: 48 },
        { id: 2, name: "海边的第七天", owner: "周屿", status: ["sn-run", "生成中"], shots: 32 },
        { id: 3, name: "长夜", owner: "许诺", status: ["sn-bad", "失败"], shots: 20 },
      ];
      const table = createTable(root.querySelector("#projects"), {
        columns: [
          { key: "name", title: "项目", sortable: true },
          { key: "owner", title: "负责人" },
          { key: "status", title: "状态", html: ([tone, text]) => `<span class="sn-tag ${tone}"><i></i>${text}</span>` },
          { key: "shots", title: "镜头", align: "right", sortable: true },
        ],
        rows, rowKey: "id", selectable: true, label: "项目列表", empty: "还没有项目",
        onSelect: (keys) => console.log("选中", keys),
        onRowClick: (row) => toast({ text: "打开「" + row.name + "」" }),
      });
      table.update({ rows: [...rows, { id: 4, name: "城南旧事", owner: "陈默", status: ["", "草稿"], shots: 12 }] }); // 换数据
      table.update({ loading: true });  // 加载中：骨架行
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row">
        <span className="sn-ib sn-has-pre" style={{ flex: "1 1 160px", minWidth: "140px", maxWidth: "240px" }}>
          <span className="sn-pre" data-i="search"></span>
          <input className="sn-input" id="tblSearch" placeholder="搜索项目或负责人" />
        </span>
        <div className="sn-seg sn-sm" data-seg="density">
          <span className="sn-thumb"></span>
          <button>舒适</button>
          <button>紧凑</button>
        </div>
        <div className="sn-seg sn-sm" data-seg="tlines">
          <span className="sn-thumb"></span>
          <button data-v="row">行线</button>
          <button data-v="grid">网格</button>
        </div>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="sn-btn sn-secondary" data-i="download:before">导出</button>
        </span>
      </div>
      <div className="sn-tbl-wrap" id="tbl" style={{ "--sn-tbl-max": "420px" }}>
        <div className="sn-sa sn-ov-y sn-ov-x" data-bar="auto" data-over="auto">
          <div className="sn-tbl-sc sn-sa-vp">
            <table className="sn-tbl" aria-label="项目列表">
              <colgroup>
                <col className="sn-c-ck" />
                <col data-c="n" />
                <col data-c="o" />
                <col data-c="st" />
                <col data-c="shots" />
                <col data-c="dur" />
                <col data-c="ts" />
                <col className="sn-c-acts" />
              </colgroup>
              <thead>
                <tr>
                  <th className="sn-ck">
                    <label className="sn-check">
                      <input type="checkbox" aria-label="全选" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                  </th>
                  <th data-c="n">
                    <button className="sn-sort" data-k="n">项目<span data-i="arrow-up"></span></button>
                    <i className="sn-g-rz" aria-hidden="true"></i>
                  </th>
                  <th data-c="o">
                    <button className="sn-sort" data-k="o">负责人<span data-i="arrow-up"></span></button>
                    <i className="sn-g-rz" aria-hidden="true"></i>
                  </th>
                  <th data-c="st">
                    <button className="sn-sort" data-k="st">状态<span data-i="arrow-up"></span></button>
                    <i className="sn-g-rz" aria-hidden="true"></i>
                  </th>
                  <th className="sn-r" data-c="shots">
                    <button className="sn-sort" data-k="shots">镜头<span data-i="arrow-up"></span></button>
                    <i className="sn-g-rz" aria-hidden="true"></i>
                  </th>
                  <th className="sn-r" data-c="dur">
                    <button className="sn-sort" data-k="dur">时长<span data-i="arrow-up"></span></button>
                    <i className="sn-g-rz" aria-hidden="true"></i>
                  </th>
                  <th data-c="ts">
                    <button className="sn-sort" data-k="ts">更新<span data-i="arrow-up"></span></button>
                    <i className="sn-g-rz" aria-hidden="true"></i>
                  </th>
                  <th className="sn-acts"></th>
                </tr>
              </thead>
              <tbody>
                <tr data-id="p0" data-lv="0" data-parent="" data-row="0" className="sn-open">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 雨夜车站" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="true">
                        <span data-i="chevron-right"></span>
                      </button>
                      <span></span>
                      <b>雨夜车站</b>
                      <span className="sn-cnt">2 集</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="5" className="sn-mg">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">48</td>
                  <td data-c="dur" className="sn-r sn-num">12:36</td>
                  <td data-c="ts" className="sn-muted">3 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p0.e0" data-lv="1" data-parent="p0" className="sn-kid sn-open" data-kid="0">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="true">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 1 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1" hidden>
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">22</td>
                  <td data-c="dur" className="sn-r sn-num">6:18</td>
                  <td data-c="ts" className="sn-muted">3 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p0.e0.s0" data-lv="2" data-parent="p0.e0" className="sn-kid" data-kid="0">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 车站外" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 车站外</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1" hidden>
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">10</td>
                  <td data-c="dur" className="sn-r sn-num">3:09</td>
                  <td data-c="ts" className="sn-muted">3 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p0.e0.s1" data-lv="2" data-parent="p0.e0" className="sn-kid" data-kid="0">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 候车厅" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 候车厅</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1" hidden>
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">11</td>
                  <td data-c="dur" className="sn-r sn-num">3:18</td>
                  <td data-c="ts" className="sn-muted">3 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p0.e1" data-lv="1" data-parent="p0" className="sn-kid" data-kid="0">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 2 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1" hidden>
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">25</td>
                  <td data-c="dur" className="sn-r sn-num">6:35</td>
                  <td data-c="ts" className="sn-muted">3 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p0.e1.s0" data-lv="2" data-parent="p0.e1" className="sn-kid" data-kid="0" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 站台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 站台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">7</td>
                  <td data-c="dur" className="sn-r sn-num">2:12</td>
                  <td data-c="ts" className="sn-muted">3 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p0.e1.s1" data-lv="2" data-parent="p0.e1" className="sn-kid" data-kid="0" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 车厢里" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 车厢里</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">8</td>
                  <td data-c="dur" className="sn-r sn-num">2:21</td>
                  <td data-c="ts" className="sn-muted">3 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p0.e1.s2" data-lv="2" data-parent="p0.e1" className="sn-kid" data-kid="0" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 雨夜" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 雨夜</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">9</td>
                  <td data-c="dur" className="sn-r sn-num">2:30</td>
                  <td data-c="ts" className="sn-muted">3 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1" data-lv="0" data-parent="" data-row="1">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 海边的第七天" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <span></span>
                      <b>海边的第七天</b>
                      <span className="sn-cnt">3 集</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">32</td>
                  <td data-c="dur" className="sn-r sn-num">8:32</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e0" data-lv="1" data-parent="p1" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 1 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">9</td>
                  <td data-c="dur" className="sn-r sn-num">2:51</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e0.s0" data-lv="2" data-parent="p1.e0" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 车厢里" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 车厢里</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:57</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e0.s1" data-lv="2" data-parent="p1.e0" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 雨夜" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 雨夜</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">3</td>
                  <td data-c="dur" className="sn-r sn-num">1:06</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e0.s2" data-lv="2" data-parent="p1.e0" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 回忆" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 回忆</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">1:15</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e1" data-lv="1" data-parent="p1" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 2 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">12</td>
                  <td data-c="dur" className="sn-r sn-num">3:08</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e1.s0" data-lv="2" data-parent="p1.e1" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 回忆" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 回忆</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">5</td>
                  <td data-c="dur" className="sn-r sn-num">1:34</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e1.s1" data-lv="2" data-parent="p1.e1" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 告别" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 告别</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">6</td>
                  <td data-c="dur" className="sn-r sn-num">1:43</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e2" data-lv="1" data-parent="p1" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 3 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">15</td>
                  <td data-c="dur" className="sn-r sn-num">3:25</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e2.s0" data-lv="2" data-parent="p1.e2" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 清晨" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 清晨</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">1:08</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e2.s1" data-lv="2" data-parent="p1.e2" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 天台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 天台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">5</td>
                  <td data-c="dur" className="sn-r sn-num">1:17</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p1.e2.s2" data-lv="2" data-parent="p1.e2" className="sn-kid" data-kid="1" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 便利店" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 便利店</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">6</td>
                  <td data-c="dur" className="sn-r sn-num">1:26</td>
                  <td data-c="ts" className="sn-muted">12 分钟前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2" data-lv="0" data-parent="" data-row="2">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 城南旧事（第二版）" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <span></span>
                      <b>城南旧事（第二版）</b>
                      <span className="sn-cnt">4 集</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">12</td>
                  <td data-c="dur" className="sn-r sn-num">3:00</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e0" data-lv="1" data-parent="p2" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 1 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">0:45</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e0.s0" data-lv="2" data-parent="p2.e0" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 告别" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 告别</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:23</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e0.s1" data-lv="2" data-parent="p2.e0" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 清晨" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 清晨</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:32</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e1" data-lv="1" data-parent="p2" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 2 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">1:02</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e1.s0" data-lv="2" data-parent="p2.e1" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 天台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 天台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:21</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e1.s1" data-lv="2" data-parent="p2.e1" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 便利店" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 便利店</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:30</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e1.s2" data-lv="2" data-parent="p2.e1" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 车站外" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 车站外</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:39</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e2" data-lv="1" data-parent="p2" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 3 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">7</td>
                  <td data-c="dur" className="sn-r sn-num">1:19</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e2.s0" data-lv="2" data-parent="p2.e2" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 车站外" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 车站外</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">3</td>
                  <td data-c="dur" className="sn-r sn-num">0:40</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e2.s1" data-lv="2" data-parent="p2.e2" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 候车厅" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 候车厅</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">0:49</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e3" data-lv="1" data-parent="p2" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 4 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 4 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">10</td>
                  <td data-c="dur" className="sn-r sn-num">1:36</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e3.s0" data-lv="2" data-parent="p2.e3" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 站台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 站台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:32</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e3.s1" data-lv="2" data-parent="p2.e3" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 车厢里" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 车厢里</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">3</td>
                  <td data-c="dur" className="sn-r sn-num">0:41</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p2.e3.s2" data-lv="2" data-parent="p2.e3" className="sn-kid" data-kid="2" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 雨夜" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 雨夜</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">0:50</td>
                  <td data-c="ts" className="sn-muted">1 小时前</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p3" data-lv="0" data-parent="" data-row="3">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 长夜" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <span></span>
                      <b>长夜</b>
                      <span className="sn-cnt">2 集</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">许</span>许诺</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-bad"><i></i>失败</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">20</td>
                  <td data-c="dur" className="sn-r sn-num">5:00</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p3.e0" data-lv="1" data-parent="p3" className="sn-kid" data-kid="3" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 1 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">许</span>许诺</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-bad"><i></i>失败</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">8</td>
                  <td data-c="dur" className="sn-r sn-num">2:30</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p3.e0.s0" data-lv="2" data-parent="p3.e0" className="sn-kid" data-kid="3" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 便利店" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 便利店</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">许</span>许诺</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:50</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p3.e0.s1" data-lv="2" data-parent="p3.e0" className="sn-kid" data-kid="3" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 车站外" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 车站外</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">许</span>许诺</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">3</td>
                  <td data-c="dur" className="sn-r sn-num">0:59</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p3.e0.s2" data-lv="2" data-parent="p3.e0" className="sn-kid" data-kid="3" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 候车厅" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 候车厅</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">许</span>许诺</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">1:08</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p3.e1" data-lv="1" data-parent="p3" className="sn-kid" data-kid="3" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 2 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">许</span>许诺</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">11</td>
                  <td data-c="dur" className="sn-r sn-num">2:47</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p3.e1.s0" data-lv="2" data-parent="p3.e1" className="sn-kid" data-kid="3" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 候车厅" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 候车厅</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">许</span>许诺</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">5</td>
                  <td data-c="dur" className="sn-r sn-num">1:24</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p3.e1.s1" data-lv="2" data-parent="p3.e1" className="sn-kid" data-kid="3" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 站台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 站台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">许</span>许诺</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">6</td>
                  <td data-c="dur" className="sn-r sn-num">1:33</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4" data-lv="0" data-parent="" data-row="4">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 山那边的学校" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <span></span>
                      <b>山那边的学校</b>
                      <span className="sn-cnt">3 集</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">64</td>
                  <td data-c="dur" className="sn-r sn-num">17:02</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e0" data-lv="1" data-parent="p4" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 1 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">19</td>
                  <td data-c="dur" className="sn-r sn-num">5:41</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e0.s0" data-lv="2" data-parent="p4.e0" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 站台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 站台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">9</td>
                  <td data-c="dur" className="sn-r sn-num">2:51</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e0.s1" data-lv="2" data-parent="p4.e0" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 车厢里" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 车厢里</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">10</td>
                  <td data-c="dur" className="sn-r sn-num">3:00</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e1" data-lv="1" data-parent="p4" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 2 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">22</td>
                  <td data-c="dur" className="sn-r sn-num">5:58</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e1.s0" data-lv="2" data-parent="p4.e1" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 雨夜" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 雨夜</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">6</td>
                  <td data-c="dur" className="sn-r sn-num">1:59</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e1.s1" data-lv="2" data-parent="p4.e1" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 回忆" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 回忆</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">7</td>
                  <td data-c="dur" className="sn-r sn-num">2:08</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e1.s2" data-lv="2" data-parent="p4.e1" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 告别" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 告别</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">8</td>
                  <td data-c="dur" className="sn-r sn-num">2:17</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e2" data-lv="1" data-parent="p4" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 3 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">25</td>
                  <td data-c="dur" className="sn-r sn-num">6:15</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e2.s0" data-lv="2" data-parent="p4.e2" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 告别" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 告别</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">12</td>
                  <td data-c="dur" className="sn-r sn-num">3:08</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p4.e2.s1" data-lv="2" data-parent="p4.e2" className="sn-kid" data-kid="4" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 清晨" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 清晨</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">李</span>李然</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">13</td>
                  <td data-c="dur" className="sn-r sn-num">3:17</td>
                  <td data-c="ts" className="sn-muted">昨天</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5" data-lv="0" data-parent="" data-row="5">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 最后一班地铁" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <span></span>
                      <b>最后一班地铁</b>
                      <span className="sn-cnt">4 集</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">28</td>
                  <td data-c="dur" className="sn-r sn-num">7:00</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e0" data-lv="1" data-parent="p5" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 1 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">5</td>
                  <td data-c="dur" className="sn-r sn-num">1:45</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e0.s0" data-lv="2" data-parent="p5.e0" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 回忆" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 回忆</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:35</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e0.s1" data-lv="2" data-parent="p5.e0" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 告别" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 告别</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:44</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e0.s2" data-lv="2" data-parent="p5.e0" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 清晨" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 清晨</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">3</td>
                  <td data-c="dur" className="sn-r sn-num">0:53</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e1" data-lv="1" data-parent="p5" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 2 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">8</td>
                  <td data-c="dur" className="sn-r sn-num">2:02</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e1.s0" data-lv="2" data-parent="p5.e1" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 清晨" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 清晨</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">3</td>
                  <td data-c="dur" className="sn-r sn-num">1:01</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e1.s1" data-lv="2" data-parent="p5.e1" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 天台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 天台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">1:10</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e2" data-lv="1" data-parent="p5" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 3 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">11</td>
                  <td data-c="dur" className="sn-r sn-num">2:19</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e2.s0" data-lv="2" data-parent="p5.e2" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 便利店" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 便利店</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">3</td>
                  <td data-c="dur" className="sn-r sn-num">0:46</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e2.s1" data-lv="2" data-parent="p5.e2" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 车站外" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 车站外</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">0:55</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e2.s2" data-lv="2" data-parent="p5.e2" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 候车厅" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 候车厅</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">5</td>
                  <td data-c="dur" className="sn-r sn-num">1:04</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e3" data-lv="1" data-parent="p5" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 4 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 4 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">14</td>
                  <td data-c="dur" className="sn-r sn-num">2:36</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e3.s0" data-lv="2" data-parent="p5.e3" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 候车厅" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 候车厅</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">6</td>
                  <td data-c="dur" className="sn-r sn-num">1:18</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p5.e3.s1" data-lv="2" data-parent="p5.e3" className="sn-kid" data-kid="5" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 站台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 站台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">林</span>林夏</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">7</td>
                  <td data-c="dur" className="sn-r sn-num">1:27</td>
                  <td data-c="ts" className="sn-muted">11 月 14 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p6" data-lv="0" data-parent="" data-row="6">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 雾港" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <span></span>
                      <b>雾港</b>
                      <span className="sn-cnt">2 集</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">40</td>
                  <td data-c="dur" className="sn-r sn-num">10:15</td>
                  <td data-c="ts" className="sn-muted">11 月 12 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p6.e0" data-lv="1" data-parent="p6" className="sn-kid" data-kid="6" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 1 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">18</td>
                  <td data-c="dur" className="sn-r sn-num">5:08</td>
                  <td data-c="ts" className="sn-muted">11 月 12 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p6.e0.s0" data-lv="2" data-parent="p6.e0" className="sn-kid" data-kid="6" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 天台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 天台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">8</td>
                  <td data-c="dur" className="sn-r sn-num">2:34</td>
                  <td data-c="ts" className="sn-muted">11 月 12 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p6.e0.s1" data-lv="2" data-parent="p6.e0" className="sn-kid" data-kid="6" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 便利店" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 便利店</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">9</td>
                  <td data-c="dur" className="sn-r sn-num">2:43</td>
                  <td data-c="ts" className="sn-muted">11 月 12 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p6.e1" data-lv="1" data-parent="p6" className="sn-kid" data-kid="6" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 2 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">21</td>
                  <td data-c="dur" className="sn-r sn-num">5:25</td>
                  <td data-c="ts" className="sn-muted">11 月 12 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p6.e1.s0" data-lv="2" data-parent="p6.e1" className="sn-kid" data-kid="6" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 车站外" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 车站外</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">6</td>
                  <td data-c="dur" className="sn-r sn-num">1:48</td>
                  <td data-c="ts" className="sn-muted">11 月 12 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p6.e1.s1" data-lv="2" data-parent="p6.e1" className="sn-kid" data-kid="6" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 候车厅" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 候车厅</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">7</td>
                  <td data-c="dur" className="sn-r sn-num">1:57</td>
                  <td data-c="ts" className="sn-muted">11 月 12 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p6.e1.s2" data-lv="2" data-parent="p6.e1" className="sn-kid" data-kid="6" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 站台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 站台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">周</span>周屿</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">8</td>
                  <td data-c="dur" className="sn-r sn-num">2:06</td>
                  <td data-c="ts" className="sn-muted">11 月 12 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7" data-lv="0" data-parent="" data-row="7">
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 春天的信" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <span></span>
                      <b>春天的信</b>
                      <span className="sn-cnt">3 集</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">6</td>
                  <td data-c="dur" className="sn-r sn-num">1:30</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e0" data-lv="1" data-parent="p7" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 1 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">0:30</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e0.s0" data-lv="2" data-parent="p7.e0" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 候车厅" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 候车厅</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:10</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e0.s1" data-lv="2" data-parent="p7.e0" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 站台" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 站台</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:19</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e0.s2" data-lv="2" data-parent="p7.e0" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 车厢里" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 车厢里</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:28</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e1" data-lv="1" data-parent="p7" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 2 集</b>
                      <span className="sn-cnt">2 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">4</td>
                  <td data-c="dur" className="sn-r sn-num">0:47</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e1.s0" data-lv="2" data-parent="p7.e1" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 车厢里" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 车厢里</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:24</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e1.s1" data-lv="2" data-parent="p7.e1" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 雨夜" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 雨夜</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:33</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e2" data-lv="1" data-parent="p7" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 集" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <button type="button" className="sn-disc sn-exp" aria-label="展开" aria-expanded="false">
                        <span data-i="chevron-right"></span>
                      </button>
                      <b>第 3 集</b>
                      <span className="sn-cnt">3 场</span>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-ok"><i></i>已完成</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">6</td>
                  <td data-c="dur" className="sn-r sn-num">1:04</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e2.s0" data-lv="2" data-parent="p7.e2" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 1 场 · 回忆" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 1 场 · 回忆</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-run"><i></i>生成中</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:21</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e2.s1" data-lv="2" data-parent="p7.e2" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 2 场 · 告别" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 2 场 · 告别</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag"><i></i>草稿</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">2</td>
                  <td data-c="dur" className="sn-r sn-num">0:30</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr data-id="p7.e2.s2" data-lv="2" data-parent="p7.e2" className="sn-kid" data-kid="7" hidden>
                  <td className="sn-ck">
                    <span className="sn-grip" aria-label="拖动换位置">
                      <span data-i="grip-vertical"></span>
                    </span>
                    <label className="sn-check">
                      <input type="checkbox" aria-label="选择 第 3 场 · 清晨" />
                      <span className="sn-box">
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                        </svg>
                        <span className="sn-bar"></span>
                      </span>
                    </label>
                    <i className="sn-g-rh" aria-hidden="true"></i>
                  </td>
                  <td data-c="n">
                    <span className="sn-name">
                      <i className="sn-leaf" aria-hidden="true"></i>
                      <b>第 3 场 · 清晨</b>
                    </span>
                  </td>
                  <td data-c="o" rowSpan="1">
                    <span className="sn-name"><span className="sn-av sn-xs">陈</span>陈默</span>
                  </td>
                  <td data-c="st">
                    <span className="sn-tag sn-warn"><i></i>待审核</span>
                  </td>
                  <td data-c="shots" className="sn-r sn-num">3</td>
                  <td data-c="dur" className="sn-r sn-num">0:39</td>
                  <td data-c="ts" className="sn-muted">11 月 10 日</td>
                  <td className="sn-acts">
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-edit="" data-tip="重命名" aria-label="重命名">
                      <span data-i="pencil"></span>
                    </button>
                    <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-row-more="" data-tip="更多" aria-label="更多">
                      <span data-i="ellipsis"></span>
                    </button>
                  </td>
                </tr>
                <tr className="sn-tbl-empty" hidden>
                  <td colSpan="8"></td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="sum">
                  <td className="sn-ck"></td>
                  <td data-c="n">合计 <b data-sum-n="">8</b> 个项目</td>
                  <td data-c="o"></td>
                  <td data-c="st"></td>
                  <td data-c="shots" className="sn-r sn-num" data-sum-shots="">250</td>
                  <td data-c="dur" className="sn-r sn-num" data-sum-dur="">64:55</td>
                  <td data-c="ts"></td>
                  <td className="sn-acts"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="sn-sa-bar sn-y" aria-hidden="true">
            <i className="sn-sa-thumb"></i>
          </div>
          <div className="sn-sa-bar sn-x" aria-hidden="true">
            <i className="sn-sa-thumb"></i>
          </div>
        </div>
        <div className="sn-bulk" role="toolbar" aria-label="批量操作">
          <span>已选 <span className="sn-n">
  <span>0</span>
</span> 项</span>
          <span className="sn-sep"></span>
          <button className="sn-bb" data-b="archive"><span data-i="archive"></span>归档</button>
          <button className="sn-bb" data-b="export"><span data-i="download"></span>导出</button>
          <button className="sn-bb sn-bad" data-b="del"><span data-i="trash-2"></span>删除</button>
          <span className="sn-sep"></span>
          <button className="sn-bb" data-b="clear" aria-label="取消选择">
            <span data-i="x"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
