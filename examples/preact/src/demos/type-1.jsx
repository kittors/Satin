import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import "./type-1.css";

export default function TypeDemo1() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="row" id="tones">
        <span class="sn-t-body sn-c-primary">主文字</span>
        <span class="sn-t-body sn-c-secondary">副信息</span>
        <span class="sn-t-body sn-c-tertiary">时间、占位</span>
        <span class="sn-t-body sn-c-off">禁用</span>
        <span class="sn-t-body sn-c-danger">失败、删除</span>
        <span class="sn-t-body sn-c-success">成功（瞬时反馈）</span>
        <span class="sn-t-body sn-c-warning">系统警告</span>
      </div>
    </div>
  );
}
