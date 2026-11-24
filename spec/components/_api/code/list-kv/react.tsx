import { Avatar } from "satin-ui/react";

export default function ListKv() {
  return (
    <dl className="sn-kv">
      <dt>项目</dt><dd>雨夜车站</dd>
      <dt>负责人</dt><dd><Avatar seed="u3" name="林夏" size={20} decorative />林夏</dd>
      <dt>状态</dt><dd><span className="sn-tag sn-ok"><i></i>已完成</span></dd>
      <dt>镜头</dt><dd className="sn-num">48 个 · 12 分 36 秒</dd>
      <dt>创建时间</dt><dd className="sn-num">2026-11-02 14:20</dd>
    </dl>
  );
}
