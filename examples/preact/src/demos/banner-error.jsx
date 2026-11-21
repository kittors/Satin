import { Icon } from "satin-ui/react";

export default function BannerError() {
  return <div class="sn-banner-wrap"><div class="sn-banner sn-bad" role="alert"><Icon name="wifi-off" /><div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div><button type="button" class="sn-btn sn-ghost sn-sm">重新连接</button></div></div>;
}
