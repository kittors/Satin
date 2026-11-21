import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { setup, enhance, reduced } from "satin-ui";
import { createProgressCard, toast } from "satin-ui/components";

@Component({
  selector: "demo-progress-0",
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 模板里有 <sn-xxx> 这类自定义元素
  encapsulation: ViewEncapsulation.None, // 接上交互时动态加的元素（图标、滚动条）也要吃到样式
  styles: [`
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .row + .row { margin-top: 16px; }
    .sn-nf-card .row { display: flex; flex-wrap: wrap; gap: 6px; }
    .stack { display: grid; gap: 16px; }
    .grid-m { display: grid; align-items: center; gap: 14px 16px; }
    .grid-m .sn-cap { white-space: nowrap; }
    .grid-m.lc { grid-template-columns: var(--lc, 112px) minmax(0, 1fr); }
    .grid-m.lc { grid-template-columns: minmax(0, 1fr); row-gap: 8px; }
    .grid-m.lc > .sn-cap:not(:first-child) { margin-top: 12px; }
  `],
  template: `
    <div #root>
      <div class="grid-m lc">
        <span class="sn-cap">进度条</span>
        <div class="stack" style="gap:12px;max-width:420px">
          <div class="sn-pbar" style="--sn-p:.62">
            <i></i>
          </div>
          <div class="sn-pbar sn-indet">
            <i></i>
          </div>
        </div>
        <span class="sn-cap">进度环</span>
        <div class="row">
          <span class="sn-pring" style="--sn-p:.25"></span>
          <span class="sn-pring" style="--sn-p:.62"></span>
          <span class="sn-pring sn-lg" style="--sn-p:.9"></span>
          <span class="sn-spinner"></span>
          <span class="sn-spinner sn-lg"></span>
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
          <div class="sn-pbar">
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
    </div>`,
})
export class ProgressDemo0Component {
  @ViewChild("root", { static: true }) root!: ElementRef<HTMLElement>;
  private off = () => {};
  ngAfterViewInit() {
    const unsetup = setup();
    const done = enhance(this.root.nativeElement, (root: any) => {
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
          timer = setInterval(() => {
            p = Math.min(1, p + 0.035 + Math.random() * 0.03);
            card.set(p, `已完成 ${Math.round(p * 120)} / 120 个镜头 · 还剩约 ${Math.max(1, Math.ceil((1 - p) * 24))} 秒`);
            if (p >= 1) { clearInterval(timer); setTimeout(() => card.finish("导出完成", '第三集.mp4 · 1.2 GB · 已保存到"下载"'), 240); }
          }, 260);
        }
        root.querySelector("[data-pc-start]").addEventListener("click", () => startExport(true));
        startExport(false);

        // AI 生成：先亮步骤；拆完镜头就按最终文字留好位置，再一段段淡入
        const PARAS = ["远景。夜里的车站广场积着水，路灯倒映在水面上，镜头从高处慢慢推近站门。", "全景。林夏收起伞走进候车厅，暖黄的灯光，人不多，广播在报晚点。",
          "中景。站台尽头，最后一班车进站，车灯穿过雨幕，照亮她的侧脸，她没有上车。"];
        const ai = root.querySelector("#aigen"), steps = [...ai.querySelectorAll(".sn-ai-steps li")], out = ai.querySelector(".sn-ai-out"), run = ai.querySelector("[data-ai-run]");
        const wait = (ms?: any) => new Promise((r?: any) => setTimeout(r, ms));
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
    this.off = () => { done(); unsetup(); };
  }
  ngOnDestroy() { this.off(); }
}
