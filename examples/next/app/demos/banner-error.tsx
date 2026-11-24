"use client";
import { Icon } from "satin-ui/react";

export default function BannerError() {
  return <div className="sn-banner-wrap"><div className="sn-banner sn-bad" role="alert"><Icon name="wifi-off" /><div className="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" className="sn-btn sn-ghost sn-sm">重新连接</button></div></div>;
}
