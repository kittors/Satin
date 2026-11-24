import { useEffect, useRef } from "preact/hooks";
import { setup, enhance, reduced } from "satin-ui";
import { createProgressCard, toast } from "satin-ui/components";
import "./progress-0.css";

export default function ProgressDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current, (root: any) => {
      (async () => {
        // 进度卡：数量、进度条、剩余时间、可取消；完成时文字换掉，图标原地变对勾，出"打开文件夹"
        const pc = root.querySelector("#pcard");
        pc.querySelector(".sn-pc-acts").insertAdjacentHTML("beforeend", '<button class="sn-btn sn-secondary sn-sm sn-off" data-pc-open>打开文件夹</button>');
        let timer = 0;
        const card = createProgressCard(pc, {
          onCancel: () => { clearInterval(timer); card.cancel("已取消导出", "已导出的部分不会保留。"); },
          onOpen: () => toast({ icon: "folder-open", text: '这里会打开"下载"文件夹' }),
        });
        // 换成你的导出任务：这里每 260ms 走一点
        function startExport(enter?: any) {
          clearInterval(timer); let p = 0;
          card.start("正在导出 第三集.mp4", "准备中…", enter);
          timer = window.setInterval(() => {
            p = Math.min(1, p + 0.035 + Math.random() * 0.03);
            card.set(p, `已完成 ${Math.round(p * 120)} / 120 个镜头 · 还剩约 ${Math.max(1, Math.ceil((1 - p) * 24))} 秒`);
            if (p >= 1) { clearInterval(timer); window.setTimeout(() => card.finish("导出完成", '第三集.mp4 · 1.2 GB · 已保存到"下载"'), 240); }
          }, 260);
        }
        root.querySelector("[data-pc-start]").addEventListener("click", () => startExport(true));
        startExport(false);

        // AI 生成：先亮步骤；拆完镜头就按最终文字留好位置，再一段段淡入
        const PARAS = ["远景。夜里的车站广场积着水，路灯倒映在水面上，镜头从高处慢慢推近站门。", "全景。林夏收起伞走进候车厅，暖黄的灯光，人不多，广播在报晚点。",
          "中景。站台尽头，最后一班车进站，车灯穿过雨幕，照亮她的侧脸，她没有上车。"];
        const ai = root.querySelector("#aigen"), steps = [...ai.querySelectorAll(".sn-ai-steps li")], out = ai.querySelector(".sn-ai-out"), run = ai.querySelector("[data-ai-run]");
        const wait = (ms?: any) => new Promise((r?: any) => window.setTimeout(r, ms));
        let runId = 0;
        run.addEventListener("click", async () => {
          const id = ++runId; run.setAttribute("aria-disabled", "true"); run.classList.add("sn-is-disabled");
          steps.forEach((s?: any) => s.classList.remove("sn-run", "sn-done")); out.innerHTML = "";
          steps[0].classList.add("sn-run"); await wait(700); if (id !== runId) return; steps[0].classList.replace("sn-run", "sn-done");
          steps[1].classList.add("sn-run"); await wait(800); if (id !== runId) return;
          out.innerHTML = PARAS.map((t?: any, i?: any) => `<div class="sn-para"><span class="sn-no">镜头 ${i + 1}</span><div class="sn-body"><div class="sn-txt">${t}</div><div class="sn-ph"><span class="sn-sk" style="width:100%"></span><span class="sn-sk" style="width:${[62, 48, 70][i]}%"></span></div></div></div>`).join("");
          if (!reduced()) out.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: "cubic-bezier(.32,.72,0,1)" });
          steps[1].classList.replace("sn-run", "sn-done"); steps[2].classList.add("sn-run");
          for (const para of out.querySelectorAll(".sn-para")) { await wait(650); if (id !== runId) return; para.classList.add("sn-on"); }
          await wait(300); steps[2].classList.replace("sn-run", "sn-done");
          run.removeAttribute("aria-disabled"); run.classList.remove("sn-is-disabled"); run.lastChild.textContent = "重新生成";
        });
      })();
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="pg-live-bar" data-parity-appended="">
        <span class="sn-cap">实时拖动预览</span>
        <div class="sn-slider" id="pgSlider" data-slider="" data-max="100" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64" aria-label="演示进度">
          <span class="sn-rail"></span>
          <span class="sn-fillbar" style="width:64%"></span>
          <span class="sn-knob" style="left:64%"></span>
          <span class="sn-bubble" style="left:64%">64</span>
        </div>
        <span class="sn-t-code sn-c-tertiary sn-num" id="pgVal">64%</span>
      </div>
      <div class="grid-m lc" id="pgShowcase">
        <span class="sn-cap">活跃微光</span>
        <div class="stack" style="gap:10px;max-width:440px">
          <div class="sn-pbar sn-active sn-lg" data-pg-bind="" style="--sn-p:.64">
            <i></i>
          </div>
          <div class="sn-pbar sn-active sn-ok" data-pg-bind="" style="--sn-p:.64">
            <i></i>
          </div>
        </div>
        <span class="sn-cap">双段不确定</span>
        <div style="max-width:440px">
          <div class="sn-pbar sn-lg sn-indet">
            <i></i>
          </div>
        </div>
        <span class="sn-cap">分段刻度</span>
        <div style="max-width:440px">
          <div class="sn-pseg" id="pgSeg">
            <i class="sn-done"></i>
            <i class="sn-done"></i>
            <i class="sn-done"></i>
            <i class="sn-done"></i>
            <i class="sn-done"></i>
            <i class="sn-cur"></i>
            <i></i>
            <i></i>
          </div>
        </div>
        <span class="sn-cap">圆头进度环</span>
        <div class="row" style="gap:16px" id="pgRings">
          <span class="sn-pring-svg sn-sm" data-pg-bind="" style="--sn-p:.64">
            <svg viewBox="0 0 36 36">
              <circle class="sn-pr-tr" cx="18" cy="18" r="15.9"></circle>
              <circle class="sn-pr-fg" cx="18" cy="18" r="15.9" pathLength="100"></circle>
            </svg>
          </span>
          <span class="sn-pring-svg" data-pg-bind="" style="--sn-p:.64">
            <svg viewBox="0 0 36 36">
              <circle class="sn-pr-tr" cx="18" cy="18" r="15.9"></circle>
              <circle class="sn-pr-fg" cx="18" cy="18" r="15.9" pathLength="100"></circle>
            </svg>
            <b data-pg-pct="">64%</b>
          </span>
          <span class="sn-pring-svg sn-lg sn-ok" data-pg-bind="" style="--sn-p:.64">
            <svg viewBox="0 0 36 36">
              <circle class="sn-pr-tr" cx="18" cy="18" r="15.9"></circle>
              <circle class="sn-pr-fg" cx="18" cy="18" r="15.9" pathLength="100"></circle>
            </svg>
            <b data-pg-pct="">64%</b>
          </span>
          <span class="sn-pring-svg sn-warn" style="--sn-p:.42">
            <svg viewBox="0 0 36 36">
              <circle class="sn-pr-tr" cx="18" cy="18" r="15.9"></circle>
              <circle class="sn-pr-fg" cx="18" cy="18" r="15.9" pathLength="100"></circle>
            </svg>
            <b>42%</b>
          </span>
          <span class="sn-pring-svg sn-bad" style="--sn-p:.85">
            <svg viewBox="0 0 36 36">
              <circle class="sn-pr-tr" cx="18" cy="18" r="15.9"></circle>
              <circle class="sn-pr-fg" cx="18" cy="18" r="15.9" pathLength="100"></circle>
            </svg>
            <b>85%</b>
          </span>
        </div>
      </div>
      <div class="sn-pcard" id="pcard">
        <span class="sn-pc-ic">
          <span class="sn-swap">
            <span class="sn-a" data-i="film"></span>
            <span class="sn-b" data-i="check"></span>
          </span>
        </span>
        <div class="sn-pc-main">
          <div class="sn-pc-top">
            <b class="sn-pc-title">
              <span>正在导出 第三集.mp4</span>
            </b>
            <span class="sn-pc-num sn-num">0%</span>
          </div>
          <div class="sn-pbar sn-active">
            <i></i>
          </div>
          <div class="sn-pc-sub sn-num">
            <span>准备中…</span>
          </div>
        </div>
        <div class="sn-pc-acts">
          <button class="sn-btn sn-ghost sn-sm" data-pc-cancel="">取消</button>
        </div>
      </div>
      <div class="row">
        <button class="sn-btn sn-secondary" data-pc-start="" data-i="refresh-cw:before">重新导出</button>
        <span class="sn-note">中途点"取消"看取消后的状态</span>
      </div>
      <div class="sn-aigen" id="aigen">
        <div class="sn-ai-head">
          <b>生成分镜描述</b>
          <button class="sn-btn sn-secondary sn-sm" data-ai-run="" data-i="play:before">开始生成</button>
        </div>
        <ol class="sn-ai-steps">
          <li data-s="0">理解原文</li>
          <li data-s="1">拆分成镜头</li>
          <li data-s="2">写画面描述</li>
        </ol>
        <div class="sn-ai-out"></div>
      </div>
    </div>
  );
}
