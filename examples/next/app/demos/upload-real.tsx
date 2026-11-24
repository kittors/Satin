"use client";
import { Upload } from "satin-ui/react";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新这一行的进度；返回 Promise（reject 那一行变成"重试"）
const upload = (_file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.2; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

export default function RealUpload() {
  return <Upload accept=".txt,.docx" maxSize={5e6} hint="支持 txt、docx，单个不超过 5 MB" upload={upload} />;
}
