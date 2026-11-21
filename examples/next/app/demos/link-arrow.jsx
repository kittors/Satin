"use client";
import { Icon } from "satin-ui/react";

export default function LinkArrow() {
  return (
    <div className="sn-row">
      <a className="sn-textbtn" href="/projects">查看全部项目<Icon name="arrow-right" className="sn-after" /></a>
      <a className="sn-textbtn sn-danger-text" href="/billing">去处理<Icon name="arrow-right" className="sn-after" /></a>
    </div>
  );
}
