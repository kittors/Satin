// 交互提问（只用 node 内置的 readline）：选一项、填一行字。
// 不在终端里（AI 直接调用、CI、管道）不问：调用方先判断 interactive()，缺的参数要么用默认值、要么报错说清楚该传什么。
// 整个命令共用一个 readline：先到的输入行排队，后面的问题按顺序拿（粘贴好几行、脚本喂输入都不会丢）；输入结束（Ctrl+D）算取消
import readline from "node:readline";

export const interactive = () => !!(process.stdin.isTTY && process.stdout.isTTY) && !process.env.CI;

export class Cancelled extends Error { constructor() { super("已取消"); this.name = "Cancelled"; this.code = 130; } }

let rl = null, closed = false;
const queue = [], waiters = [];
function iface() {
  if (rl) return rl;
  closed = false;
  rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: !!process.stdin.isTTY });
  rl.on("line", (line) => { const w = waiters.shift(); if (w) w.resolve(line); else queue.push(line); });
  rl.on("close", () => { closed = true; for (const w of waiters.splice(0)) w.reject(new Cancelled()); });
  return rl;
}
async function ask(q) {
  const r = iface();
  r.setPrompt(q); r.prompt();
  if (queue.length) { const line = queue.shift(); if (!r.terminal) process.stdout.write(line + "\n"); return line.trim(); }
  if (closed) throw new Cancelled();
  return new Promise((resolve, reject) => waiters.push({ resolve: (l) => resolve(l.trim()), reject }));
}
export function closePrompts() { if (rl) { const r = rl; rl = null; r.close(); } queue.length = 0; }

export async function text(label, def = "") {
  const a = await ask(`${label}${def ? `（默认 ${def}）` : ""}：`);
  return a || def;
}

// items：[{ value, label }]；输入序号或者值都行，回车选默认那一项
export async function select(label, items, def = items[0]?.value) {
  console.log(label);
  items.forEach((it, i) => console.log(`  ${String(i + 1).padStart(2)}. ${it.label}${it.value === def ? "（默认）" : ""}`));
  for (;;) {
    const a = await ask("输入序号：");
    if (!a) return def;
    const n = Number(a);
    if (Number.isInteger(n) && n >= 1 && n <= items.length) return items[n - 1].value;
    const hit = items.find((it) => it.value === a.toLowerCase());
    if (hit) return hit.value;
    console.log(`没有这一项，输入 1–${items.length}`);
  }
}
