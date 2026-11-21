// 参数用错了（退出码 2，和"跑了但有问题"的 1 分开，方便脚本、AI 判断）
export class UsageError extends Error {
  constructor(msg) { super(msg); this.name = "UsageError"; this.code = 2; }
}
