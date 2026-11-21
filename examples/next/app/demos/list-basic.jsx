"use client";
import { Icon } from "satin-ui/react";

export default function ListBasic() {
  return (
    <div className="sn-set-list">
      <div className="sn-set-row" tabIndex="0"><span className="sn-ico"><Icon name="user" /></span><div className="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span className="sn-end"><Icon name="chevron-right" /></span></div>
      <div className="sn-set-row" tabIndex="0"><span className="sn-ico"><Icon name="layout-grid" /></span><div className="sn-tx"><b>默认画面比例</b></div><span className="sn-val">16:9</span><span className="sn-end"><Icon name="chevron-right" /></span></div>
      <div className="sn-set-row" tabIndex="0"><span className="sn-ico"><Icon name="key-round" /></span><div className="sn-tx"><b>修改密码</b></div><span className="sn-end"><Icon name="chevron-right" /></span></div>
      <div className="sn-set-row sn-danger" tabIndex="0"><span className="sn-ico"><Icon name="log-out" /></span><div className="sn-tx"><b>退出登录</b></div></div>
    </div>
  );
}
