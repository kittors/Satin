import { useState } from "react";
import { Button, Icon } from "satin-ui/react";

export default function UpdateBanner() {
  const [closed, setClosed] = useState(false);
  // 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来（元素留着，不用等动画再删）
  return (
    <div className={closed ? "sn-banner-wrap sn-closing" : "sn-banner-wrap"}>
      <div className="sn-banner" role="status">
        <Icon name="download" />
        <div className="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
        <Button size="sm">重启</Button>
        <Button variant="ghost" size="sm" icon="x" tip="关闭" onClick={() => setClosed(true)} />
      </div>
    </div>
  );
}
