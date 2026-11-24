"use client";
import type { MouseEvent } from "react";
import { Icon } from "satin-ui/react";
import { copied } from "satin-ui";

const LINK = "https://example.com/s/7f3k2q";

export default function CopyLink() {
  // 复制成功：copied(按钮) 让图标原地变成对勾 1.2 秒、提示换成"已复制"，不另弹轻提示
  const copy = async (e: MouseEvent<HTMLButtonElement>) => { const b = e.currentTarget; await navigator.clipboard.writeText(LINK); copied(b); };
  return (
    <button type="button" className="sn-btn sn-ghost sn-ibtn" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C" onClick={copy}>
      <span className="sn-swap"><span className="sn-a"><Icon name="copy" /></span><span className="sn-b"><Icon name="check" /></span></span>
    </button>
  );
}
