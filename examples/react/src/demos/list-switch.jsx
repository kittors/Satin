import { Icon } from "satin-ui/react";

export default function ListSwitch() {
  return (
    <div className="sn-set-list">
      <div className="sn-set-row"><span className="sn-ico"><Icon name="bell" /></span><div className="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label className="sn-switch"><input type="checkbox" role="switch" aria-label="生成完成时提醒" defaultChecked /><span className="sn-track"><span className="sn-knob"></span></span></label></div>
      <div className="sn-set-row"><span className="sn-ico"><Icon name="save" /></span><div className="sn-tx"><b>自动保存草稿</b><span>每次改动 2 秒后保存</span></div><label className="sn-switch"><input type="checkbox" role="switch" aria-label="自动保存草稿" /><span className="sn-track"><span className="sn-knob"></span></span></label></div>
    </div>
  );
}
