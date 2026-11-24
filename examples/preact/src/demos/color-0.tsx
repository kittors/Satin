import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import "./color-0.css";

export default function ColorDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="swatches" id="swatches">
        <div class="sw-group sn-cap">表面</div>
        <div class="sw">
          <i class="c" style="background:var(--sn-canvas)"></i>
          <b>bg.canvas</b>
          <span>窗口底色</span>
          <span class="sn-v">浅 #F5F5F7　深 #000000</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-raised)"></i>
          <b>bg.raised</b>
          <span>卡片、面板、表格容器</span>
          <span class="sn-v">浅 #FFFFFF　深 #1C1C1E</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-overlay)"></i>
          <b>bg.overlay</b>
          <span>菜单、对话框、通知</span>
          <span class="sn-v">浅 #FFFFFF　深 #2C2C2E</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-sunken)"></i>
          <b>bg.sunken</b>
          <span>画布底、代码块</span>
          <span class="sn-v">浅 #E8E8ED　深 #0E0E10</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-fill-hover)"></i>
          <b>fill.hover</b>
          <span>悬停叠加</span>
          <span class="sn-v">浅 黑 4%　深 白 6%</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-fill-active)"></i>
          <b>fill.active</b>
          <span>按下、选中</span>
          <span class="sn-v">浅 黑 7%　深 白 10%</span>
        </div>
        <div class="sw-group sn-cap">文字</div>
        <div class="sw">
          <i class="c" style="background:var(--sn-label)"></i>
          <b>text.primary</b>
          <span>标题、正文、选中项</span>
          <span class="sn-v">浅 #1D1D1F　深 #F5F5F7</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-label2)"></i>
          <b>text.secondary</b>
          <span>副信息、未选中导航</span>
          <span class="sn-v">浅 #424245　深 #AEAEB2</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-label3)"></i>
          <b>text.tertiary</b>
          <span>时间、占位、表头</span>
          <span class="sn-v">浅 #6E6E73　深 #86868B</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-label-off)"></i>
          <b>text.disabled</b>
          <span>禁用</span>
          <span class="sn-v">浅 #AEAEB2　深 #48484A</span>
        </div>
        <div class="sw-group sn-cap">线</div>
        <div class="sw">
          <i class="c" style="background:var(--sn-line)"></i>
          <b>line.subtle</b>
          <span>描边、表头下线</span>
          <span class="sn-v">浅 黑 8%　深 白 9%</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-line-control)"></i>
          <b>line.control</b>
          <span>输入框、选择框边框</span>
          <span class="sn-v">浅 黑 14%　深 白 14%</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-focus)"></i>
          <b>line.focus</b>
          <span>键盘焦点环</span>
          <span class="sn-v">浅 黑 40%　深 白 50%</span>
        </div>
        <div class="sw-group sn-cap">强调与语义</div>
        <div class="sw">
          <i class="c" style="background:var(--sn-accent)"></i>
          <b>accent</b>
          <span>开关、复选、进度、焦点</span>
          <span class="sn-v">浅 #1D1D1F　深 #F5F5F7</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-danger)"></i>
          <b>danger</b>
          <span>失败、删除（作文字时 ≥4.5:1）</span>
          <span class="sn-v">浅 #D92D20　深 #FF6961</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-success)"></i>
          <b>success</b>
          <span>成功的瞬时反馈</span>
          <span class="sn-v">浅 #248A3D　深 #30D158</span>
        </div>
        <div class="sw">
          <i class="c" style="background:var(--sn-warning)"></i>
          <b>warning</b>
          <span>系统级警告，很少用</span>
          <span class="sn-v">浅 #B25000　深 #FFD60A</span>
        </div>
      </div>
    </div>
  );
}
