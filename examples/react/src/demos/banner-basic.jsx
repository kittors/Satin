import { Icon } from "satin-ui/react";

export default function BannerBasic() {
  return <div className="sn-banner-wrap"><div className="sn-banner sn-warn" role="status"><Icon name="triangle-alert" /><div className="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" className="sn-btn sn-secondary sn-sm">查看额度</button></div></div>;
}
