"use client";
import { Avatar, Button } from "satin-ui/react";

export default function CardContent() {
  return (
    <div className="sn-pcards" style={{ "--sn-card-min": "260px" }}>
      <div className="sn-card sn-divided">
        <div className="sn-card-hd">
          <div className="sn-card-titles"><b>云端渲染队列</b><span className="sn-card-sub">华东节点 · 4K 导出</span></div>
          <span className="sn-tag sn-ok"><i />运行中</span>
        </div>
        <div className="sn-card-bd">当前排队 3 个分镜工程，预计 14 分钟后全部完成并同步至素材库。</div>
        <div className="sn-card-ft">
          <span className="sn-card-sub">更新于 2 分钟前</span>
          <Button variant="secondary" size="sm">查看详情</Button>
        </div>
      </div>
      <div className="sn-card sn-bordered">
        <div className="sn-card-hd">
          <div className="sn-card-titles"><b>团队协作权限</b><span className="sn-card-sub">仅项目成员可导出成片</span></div>
        </div>
        <div className="sn-card-bd">已授权 5 位成员参与剪辑与审片，访客链接有效期 7 天。</div>
        <div className="sn-card-ft">
          <span className="sn-av-group">
            <Avatar seed="u3" name="林夏" size={24} decorative />
            <Avatar seed="u4" name="周屿" size={24} decorative />
            <Avatar seed="u8" name="陈默" size={24} decorative />
          </span>
          <Button variant="ghost" size="sm">管理成员</Button>
        </div>
      </div>
    </div>
  );
}
