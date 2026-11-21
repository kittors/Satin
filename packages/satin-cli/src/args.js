// 命令行参数：--key value、--key=value、--no-key（= false）、-y / -h / -v。
// 开关类的参数（BOOL 里的）不吃后面那个词：satin init --yes my-app 里 my-app 还是位置参数
const BOOL = new Set(["yes", "force", "help", "version", "json", "list", "install", "no-floats", "quiet"]);
const SHORT = { y: "yes", h: "help", v: "version", f: "force" };

export function parseArgs(argv) {
  const out = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") { out._.push(...argv.slice(i + 1)); break; }
    if (a.startsWith("--")) {
      let key = a.slice(2), val;
      const eq = key.indexOf("=");
      if (eq >= 0) { val = key.slice(eq + 1); key = key.slice(0, eq); }
      if (val === undefined && key.startsWith("no-") && !BOOL.has(key)) { out.flags[key.slice(3)] = false; continue; }
      if (val === undefined) {
        if (BOOL.has(key)) val = true;
        else if (i + 1 < argv.length && !argv[i + 1].startsWith("-")) val = argv[++i];
        else val = true;
      }
      out.flags[key] = val;
    } else if (a.startsWith("-") && a.length > 1) {
      for (const c of a.slice(1)) out.flags[SHORT[c] || c] = true;
    } else out._.push(a);
  }
  return out;
}

// 逗号分隔的列表参数：--agents claude,codex
export const listOf = (v) => (typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
