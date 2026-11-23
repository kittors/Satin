import { useEffect, useRef } from "react";
import { setup, enhance, injectIcons } from "satin-ui";
import { Select, Segmented, Avatar } from "satin-ui/react";
import { busy, succeed, toast, createNumberFlow, createScrollArea } from "satin-ui/components";
import { createAreaChart, createBarChart, createDonutChart, createChart3D, createSparkline } from "satin-ui/charts";

export default function Dashboard() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      injectIcons();
      createScrollArea(root.querySelector("#dbTblSc"), { fade: "none", overscroll: "auto" });

      const DATASET = {
        "本周": {
          range: "11.17 – 11.23",
          kpis: [
            { val: 1784, delta: "+14.2%", spk: [168, 214, 196, 268, 312, 284, 342] },
            { val: 84.6, fmt: (v) => v.toFixed(1) + "%", delta: "+3.8%", spk: [79, 81, 80, 83, 85, 84, 86] },
            { text: "1 分 52 秒", delta: "快 14 秒", spk: [134, 128, 125, 119, 116, 114, 112] },
            { val: 78.2, fmt: (v) => v.toFixed(1) + "%", delta: "余量 22%", spk: [66, 72, 70, 76, 82, 79, 78] },
          ],
          area: {
            labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            gen: [168, 214, 196, 268, 312, 284, 342],
            pass: [134, 178, 162, 224, 266, 241, 298],
          },
          donut: [
            { label: "已完成", value: 64, color: "success" },
            { label: "生成中", value: 32, color: "blue" },
            { label: "待审核", value: 24, color: "warning" },
            { label: "失败重试", value: 8, color: "danger" },
          ],
          bar: { cur: [420, 580, 360, 290, 470], prev: [350, 490, 310, 260, 390] },
          c3d: [[72, 94, 88, 126, 148, 112], [56, 78, 108, 118, 134, 96], [42, 64, 74, 92, 106, 84]],
        },
        "本月": {
          range: "11.01 – 11.23",
          kpis: [
            { val: 6230, delta: "+21.6%", spk: [1120, 1480, 1690, 1940] },
            { val: 86.1, fmt: (v) => v.toFixed(1) + "%", delta: "+5.1%", spk: [81, 83, 85, 87] },
            { text: "1 分 46 秒", delta: "快 22 秒", spk: [128, 118, 110, 106] },
            { val: 82.4, fmt: (v) => v.toFixed(1) + "%", delta: "余量 18%", spk: [71, 76, 80, 82] },
          ],
          area: {
            labels: ["第 1 周", "第 2 周", "第 3 周", "第 4 周"],
            gen: [1120, 1480, 1690, 1940],
            pass: [918, 1258, 1468, 1712],
          },
          donut: [
            { label: "已完成", value: 214, color: "success" },
            { label: "生成中", value: 68, color: "blue" },
            { label: "待审核", value: 49, color: "warning" },
            { label: "失败重试", value: 15, color: "danger" },
          ],
          bar: { cur: [1480, 1960, 1240, 920, 1630], prev: [1210, 1640, 1080, 810, 1390] },
          c3d: [[96, 118, 132, 154, 176, 140], [74, 98, 124, 146, 158, 122], [62, 82, 94, 116, 128, 104]],
        },
        "本季": {
          range: "2026 Q4（9 – 11 月）",
          kpis: [
            { val: 18420, delta: "+38.4%", spk: [4280, 5610, 6230, 7480] },
            { val: 87.9, fmt: (v) => v.toFixed(1) + "%", delta: "+7.4%", spk: [78, 82, 86, 88] },
            { text: "1 分 39 秒", delta: "快 35 秒", spk: [134, 120, 108, 99] },
            { val: 85.1, fmt: (v) => v.toFixed(1) + "%", delta: "余量 15%", spk: [68, 75, 81, 85] },
          ],
          area: {
            labels: ["9 月上", "9 月下", "10 月上", "10 月下", "11 月上", "11 月下"],
            gen: [2120, 2640, 3080, 3420, 3510, 3650],
            pass: [1760, 2244, 2680, 3010, 3124, 3318],
          },
          donut: [
            { label: "已完成", value: 618, color: "success" },
            { label: "生成中", value: 112, color: "blue" },
            { label: "待审核", value: 84, color: "warning" },
            { label: "失败重试", value: 26, color: "danger" },
          ],
          bar: { cur: [4120, 5640, 3480, 2640, 4540], prev: [3190, 4420, 2760, 2180, 3580] },
          c3d: [[112, 134, 148, 172, 194, 162], [88, 114, 138, 162, 178, 146], [76, 94, 112, 134, 152, 126]],
        },
      };

      const LINE_SCALE = { all: [1, "全部业务线"], drama: [0.62, "剧集分镜"], ad: [0.44, "商业短片"], anime: [0.51, "二维动画"] };
      const PROJECTS = [
        { name: "雨夜车站 · 第 3 集", owner: "林夏", line: "drama", genre: "电影感", status: "已完成", tone: "sn-ok", shots: 48, rate: "93.8%", avg: "1分38秒" },
        { name: "风起长街 · 预告片", owner: "周屿", line: "ad", genre: "纪录", status: "生成中", tone: "sn-run", shots: 32, rate: "84.4%", avg: "1分49秒" },
        { name: "星河渡口 · 先导集", owner: "许诺", line: "anime", genre: "动画", status: "待审核", tone: "sn-warn", shots: 64, rate: "87.5%", avg: "1分56秒" },
        { name: "霓虹脉搏 · 视觉单曲", owner: "苏婉", line: "ad", genre: "MV", status: "已完成", tone: "sn-ok", shots: 28, rate: "92.9%", avg: "1分31秒" },
        { name: "海雾尽头 · 第 1 集", owner: "程橙", line: "drama", genre: "短剧", status: "生成中", tone: "sn-run", shots: 56, rate: "81.2%", avg: "2分04秒" },
        { name: "旧城回声 · 复原篇", owner: "陈默", line: "drama", genre: "纪录", status: "失败重试", tone: "sn-bad", shots: 19, rate: "68.4%", avg: "2分36秒" },
      ];

      let period = "本周", line = "all", filterStatus = "", filterGenre = "", query = "";

      const nf0 = createNumberFlow(root.querySelector("#kpiVal0"), { value: 1784 });
      const nf1 = createNumberFlow(root.querySelector("#kpiVal1"), { value: 84.6, format: (v) => v.toFixed(1) + "%" });
      const nf3 = createNumberFlow(root.querySelector("#kpiVal3"), { value: 78.2, format: (v) => v.toFixed(1) + "%" });
      const spks = [
        createSparkline(root.querySelector("#kpiSpk0"), { values: DATASET["本周"].kpis[0].spk, color: "accent", height: 30 }),
        createSparkline(root.querySelector("#kpiSpk1"), { values: DATASET["本周"].kpis[1].spk, color: "success", height: 30 }),
        createSparkline(root.querySelector("#kpiSpk2"), { values: DATASET["本周"].kpis[2].spk, color: "blue", height: 30 }),
        createSparkline(root.querySelector("#kpiSpk3"), { values: DATASET["本周"].kpis[3].spk, color: "violet", height: 30 }),
      ];

      const area = createAreaChart(root.querySelector("#dbArea"), {
        labels: DATASET["本周"].area.labels,
        height: 244,
        unit: " 镜",
        series: [
          { name: "生成镜头", color: "accent", values: DATASET["本周"].area.gen },
          { name: "一次通过", color: "success", values: DATASET["本周"].area.pass },
        ],
      });

      const donut = createDonutChart(root.querySelector("#dbDonut"), {
        size: 158,
        centerLabel: "项目数",
        unit: " 个",
        items: DATASET["本周"].donut,
        onSelect(item) { filterStatus = item ? item.label : ""; renderRows(); },
      });

      const c3d = createChart3D(root.querySelector("#db3d"), {
        rows: ["上海集群", "杭州集群", "深圳集群"],
        cols: ["周一", "周二", "周三", "周四", "周五", "周六"],
        rowColors: ["blue", "violet", "success"],
        metricLabel: "渲染吞吐",
        unit: " 镜/h",
        height: 304,
        values: DATASET["本周"].c3d,
      });

      const bar = createBarChart(root.querySelector("#dbBar"), {
        labels: ["纪录", "电影感", "动画", "MV", "短剧"],
        height: 256,
        unit: " 镜",
        series: [
          { name: "本期交付", color: "blue", values: DATASET["本周"].bar.cur },
          { name: "上期交付", color: "muted", values: DATASET["本周"].bar.prev },
        ],
        onSelect(label) { filterGenre = label || ""; renderRows(); },
      });

      function renderRows() {
        const q = query.trim().toLowerCase();
        const list = PROJECTS.filter((p) => (line === "all" || p.line === line) && (!filterStatus || p.status === filterStatus) && (!filterGenre || p.genre === filterGenre) && (!q || p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q)));
        const tb = root.querySelector("#dbRows");
        tb.innerHTML = list.length ? list.map((p) => `<tr>
    <td><b>${p.name}</b><div class="sn-t-caption sn-c-tertiary">${p.owner}</div></td>
    <td>${p.genre}</td>
    <td><span class="sn-tag ${p.tone}"><i></i>${p.status}</span></td>
    <td class="sn-num" style="text-align:right">${p.shots}</td>
    <td class="sn-num" style="text-align:right">${p.rate}</td>
    <td class="sn-num sn-c-secondary" style="text-align:right">${p.avg}</td>
  </tr>`).join("") : `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--sn-label3)">当前筛选条件下暂无匹配项目</td></tr>`;
        const parts = [filterStatus && `状态：${filterStatus}`, filterGenre && `题材：${filterGenre}`, q && `搜索：${q}`].filter(Boolean);
        root.querySelector("#dbTblHint").textContent = parts.length ? `已筛选 ${list.length} / ${PROJECTS.length} 个项目 · ${parts.join(" · ")}` : `全部 ${list.length} 个项目 · 支持图表联动与关键词筛选`;
        root.querySelector("#dbReset").hidden = !parts.length;
      }

      function applyFilters() {
        const d = DATASET[period] || DATASET["本周"], [k, lineName] = LINE_SCALE[line] || LINE_SCALE.all;
        const sc = (arr) => arr.map((v) => Math.max(1, Math.round(v * k)));
        root.querySelector("#dbRange").textContent = `${d.range} · ${lineName}`;
        nf0.set(Math.round(d.kpis[0].val * k));
        nf1.set(d.kpis[1].val);
        root.querySelector("#kpiVal2").textContent = d.kpis[2].text;
        nf3.set(d.kpis[3].val);
        d.kpis.forEach((kp, i) => {
          document.getElementById("kpiDelta" + i).textContent = kp.delta;
          spks[i].update({ values: i === 0 ? sc(kp.spk) : kp.spk });
        });
        const gen = sc(d.area.gen), pass = sc(d.area.pass);
        const totalG = gen.reduce((a, b) => a + b, 0), totalP = pass.reduce((a, b) => a + b, 0);
        root.querySelector("#dbRateNote").textContent = `采纳率 ${((totalP / Math.max(1, totalG)) * 100).toFixed(1)}%`;
        area.update({ labels: d.area.labels, series: [{ name: "生成镜头", color: "accent", values: gen }, { name: "一次通过", color: "success", values: pass }] });
        donut.update({ items: d.donut.map((it) => ({ ...it, value: Math.max(1, Math.round(it.value * k)) })) });
        bar.update({ series: [{ name: "本期交付", color: "blue", values: sc(d.bar.cur) }, { name: "上期交付", color: "muted", values: sc(d.bar.prev) }] });
        c3d.update({ values: d.c3d.map(sc) });
        renderRows();
      }

      root.querySelector("#dbPeriod").addEventListener("sn-change", (e) => { period = e.detail; applyFilters(); });
      root.querySelector("#dbLine").addEventListener("sn-change", (e) => { line = e.detail; applyFilters(); });
      root.querySelector("#dbSearch").addEventListener("input", (e) => { query = e.target.value; renderRows(); });
      root.querySelector("#dbReset").addEventListener("click", () => { filterStatus = ""; filterGenre = ""; query = ""; root.querySelector("#dbSearch").value = ""; donut.update({ activeIndex: -1 }); bar.update({ activeIndex: -1 }); renderRows(); });
      root.querySelector("#dbExport").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        await busy(btn, 720);
        succeed(btn);
        toast({ text: `已导出「${period} · ${LINE_SCALE[line][1]}」效能分析周报` });
      });

      renderRows();
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-page">
        <header className="sn-page-hd">
          <div style={{ minWidth: "0", flex: "1" }}>
            <h1>渲染与创作效能</h1>
            <p id="dbRange" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>11.17 – 11.23 · 全部业务线</p>
          </div>
          <div className="sn-acts" style={{ flexWrap: "wrap" }}>
            <Select id="dbLine" defaultValue="all" items={[{"value":"all","label":"全部业务线"},{"value":"drama","label":"剧集分镜"},{"value":"ad","label":"商业短片"},{"value":"anime","label":"二维动画"}]} />
            <Segmented id="dbPeriod" items={["本周","本月","本季"]} defaultValue="本周" />
            <button type="button" className="sn-btn sn-secondary sn-sm" id="dbExport" style={{ flex: "none" }} data-i="download:before">导出周报</button>
          </div>
        </header>
        <div className="sn-stack sn-gap-24">
          <section className="sn-panel">
            <div className="sn-stats">
              <div className="sn-stat">
                <div className="sn-row sn-between">
                  <span>累计生成镜头</span>
                  <small className="sn-up" id="kpiDelta0">+14.2%</small>
                </div>
                <b className="sn-num" id="kpiVal0">1,784</b>
                <div id="kpiSpk0"></div>
              </div>
              <div className="sn-stat">
                <div className="sn-row sn-between">
                  <span>首镜通过率</span>
                  <small className="sn-up" id="kpiDelta1">+3.8%</small>
                </div>
                <b className="sn-num" id="kpiVal1">84.6%</b>
                <div id="kpiSpk1"></div>
              </div>
              <div className="sn-stat">
                <div className="sn-row sn-between">
                  <span>平均单镜耗时</span>
                  <small className="sn-up" id="kpiDelta2">快 14&nbsp;秒</small>
                </div>
                <b className="sn-num" id="kpiVal2">1&nbsp;分&nbsp;52&nbsp;秒</b>
                <div id="kpiSpk2"></div>
              </div>
              <div className="sn-stat">
                <div className="sn-row sn-between">
                  <span>GPU&nbsp;利用率</span>
                  <small id="kpiDelta3">余量 22%</small>
                </div>
                <b className="sn-num" id="kpiVal3">78.2%</b>
                <div id="kpiSpk3"></div>
              </div>
            </div>
          </section>
          <div className="sn-with-aside" style={{ "--sn-aside": "360px" }}>
            <section className="sn-panel">
              <div className="sn-panel-hd">
                <div>
                  <h2>镜头生成与一次通过走势</h2>
                  <p>悬停查看逐日产出与采纳率，点击图例可开关对比系列</p>
                </div>
                <span className="sn-t-caption sn-c-tertiary sn-num" id="dbRateNote">采纳率 84.6%</span>
              </div>
              <div id="dbArea"></div>
            </section>
            <section className="sn-panel">
              <div className="sn-panel-hd">
                <div>
                  <h2>项目交付状态分布</h2>
                  <p>点击环段直接筛选下方项目明细</p>
                </div>
              </div>
              <div id="dbDonut"></div>
            </section>
          </div>
          <div className="sn-with-aside" style={{ "--sn-aside": "440px" }}>
            <section className="sn-panel">
              <div className="sn-panel-hd">
                <div>
                  <h2>三大渲染集群时空吞吐（3D）</h2>
                  <p>拖拽 360° 观察机房峰值分布，支持等轴测 / 俯视 / 正面切换</p>
                </div>
              </div>
              <div id="db3d"></div>
            </section>
            <section className="sn-panel">
              <div className="sn-panel-hd">
                <div>
                  <h2>各题材镜头交付对比</h2>
                  <p>点击柱组联动筛选对应题材项目</p>
                </div>
              </div>
              <div id="dbBar"></div>
            </section>
          </div>
          <div className="sn-with-aside" style={{ "--sn-aside": "288px" }}>
            <section className="sn-panel sn-flush">
              <div className="sn-panel-hd" style={{ padding: "var(--sn-sp-16) var(--sn-sp-20) var(--sn-sp-12)" }}>
                <div style={{ minWidth: "0", flex: "1" }}>
                  <h2>重点项目效能明细</h2>
                  <p id="dbTblHint" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>全部 6&nbsp;个项目 · 支持图表联动与关键词筛选</p>
                </div>
                <div className="sn-row sn-gap-8" style={{ flex: "none" }}>
                  <button type="button" className="sn-btn sn-ghost sn-sm" id="dbReset" hidden>重置筛选</button>
                  <input className="sn-input sn-sm" id="dbSearch" type="search" placeholder="搜索项目或导演…" style={{ width: "156px" }} />
                </div>
              </div>
              <div className="sn-tbl-wrap sn-plain" style={{ minHeight: "320px" }}>
                <div className="sn-tbl-sc" id="dbTblSc">
                  <table className="sn-tbl">
                    <thead>
                      <tr>
                        <th>项目</th>
                        <th>题材</th>
                        <th>状态</th>
                        <th className="sn-num" style={{ textAlign: "right" }}>镜头</th>
                        <th className="sn-num" style={{ textAlign: "right" }}>通过率</th>
                        <th className="sn-num" style={{ textAlign: "right" }}>均耗时</th>
                      </tr>
                    </thead>
                    <tbody id="dbRows"></tbody>
                  </table>
                </div>
              </div>
            </section>
            <section className="sn-panel">
              <div className="sn-panel-hd">
                <div>
                  <h2>实时渲染与团队动态</h2>
                  <p>最近 24&nbsp;小时关键事件</p>
                </div>
              </div>
              <div className="sn-stack sn-gap-16">
                <div className="sn-row sn-gap-12" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                  <Avatar seed="u3" name="林夏" size={32} decorative />
                  <div className="sn-grow">林夏完成了「雨夜车站 · 第 3 集」母带导出<div className="sn-t-caption sn-c-tertiary">3&nbsp;分钟前 · 上海集群</div></div>
                </div>
                <div className="sn-row sn-gap-12" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                  <Avatar seed="u4" name="周屿" size={32} decorative />
                  <div className="sn-grow">周屿调优了「风起长街」超分管线，单镜缩短 18&nbsp;秒<div className="sn-t-caption sn-c-tertiary">42&nbsp;分钟前 · 杭州集群</div></div>
                </div>
                <div className="sn-row sn-gap-12" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                  <Avatar seed="u11" name="许诺" size={32} decorative />
                  <div className="sn-grow">许诺提交「星河渡口」14&nbsp;个镜头进入审核队列<div className="sn-t-caption sn-c-tertiary">2&nbsp;小时前 · 剧集分镜</div></div>
                </div>
                <div className="sn-row sn-gap-12" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                  <Avatar seed="u8" name="陈默" size={32} decorative />
                  <div className="sn-grow">「旧城回声」2&nbsp;个高动态镜头触发重试并已自动恢复<div className="sn-t-caption sn-c-tertiary">昨天 19:20 · 深圳集群</div></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
