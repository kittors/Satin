// 展示页接线：从 kit-number.js 拆出来的 initNumbers 和演示数据。
// 数字变化（NumberFlow）
// 只动变了的那几位：变大往上走、变小往下走；从个位开始依次动（每位晚 30ms），像一串连锁反应。
// 四种样式：
//   roll 滚动：每一位是一条 0～9 的竖条，像里程表一样滚过中间的数字；上下边缘渐隐。
//   blur 模糊滚动：同样滚动，滚动时带竖直方向的运动模糊（滚过的格数越多越糊），停下变清晰。
//   push 推入：变了的那一位，旧数字往上（或往下）滑走，新数字从另一头滑进来，带一点模糊。
//   fade 淡入：变了的那一位原地淡出淡入，带一点缩放和模糊，适合小徽标。
// 位数变化（99 → 100、999 → 1,000）：新增的那一位从 0 宽长出来，去掉的收成 0 宽；千分位逗号、小数点、货币符号不跟着滚。
// 中途又来新值：从当前看到的位置接着滚，不跳。减少动态效果时直接换。只动 transform、opacity、filter 和这一位的宽度。
import { numberFlow } from "../../packages/satin-ui/src/number.js";

// ———— 演示：数字变化一节 + 乐观更新里的收藏数 ————
export function initNumbers(ctx) {
  const { $, $$, reduced, initSeg } = ctx;
  const sec = $("#numflow"); if (!sec) return;
  const yuan = (v) => "¥ " + v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const hours = (v) => `${Math.floor(v / 60)} 小时 ${String(v % 60).padStart(2, "0")} 分`;
  const flows = {
    shots: numberFlow($('[data-nf="shots"]', sec), { value: 1284, reduced }),
    price: numberFlow($('[data-nf="price"]', sec), { value: 199, format: yuan, reduced }),
    live: numberFlow($('[data-nf="live"]', sec), { value: 2875, format: hours, reduced }),
    badge: numberFlow($('[data-nf="badge"]', sec), { value: 3, format: (v) => (v > 99 ? "99+" : String(v)), reduced }),
  };
  sec._nf = flows; // 调试用
  const seg = $('[data-seg="nfstyle"]', sec);
  if (seg) initSeg(seg, (st) => { for (const f of Object.values(flows)) f.setStyle(st); });
  sec.addEventListener("click", (e) => {
    const add = e.target.closest("[data-nf-add]");
    if (add) { const f = flows.shots, k = add.dataset.nfAdd; f.set(Math.max(0, k === "rand" ? Math.round(Math.random() * 120000) : f.get() + Number(k))); }
    if (e.target.closest("[data-nf-plan]")) { const P = [199, 2399, 49.9, 12800, 999]; const f = flows.price; f.set(P[(P.indexOf(f.get()) + 1) % P.length]); }
    if (e.target.closest("[data-nf-badge]")) { const f = flows.badge; f.set(f.get() >= 120 ? 3 : f.get() + [1, 9, 40][(Math.random() * 3) | 0]); }
  });
  // 自动更新：只在这一节看得见时跑
  let timer = 0;
  new IntersectionObserver((es) => {
    const on = es.some((x) => x.isIntersecting); clearInterval(timer);
    if (on) timer = setInterval(() => flows.live.set(flows.live.get() + 1 + ((Math.random() * 3) | 0)), 1200);
  }).observe(sec);
  void $$;
}
