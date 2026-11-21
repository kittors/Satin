import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./spacing-1.css";

export default function SpacingDemo1() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sp-compare">
        <figure className="sp-cmp sn-bad">
          <div className="sp-set">
            <b>通知</b>
            <span>新评论</span>
            <span>生成完成</span>
            <b>隐私</b>
            <span>公开主页</span>
            <span>允许搜索到我</span>
          </div>
          <figcaption className="sn-c-danger">都是 16：看不出哪几行是一组</figcaption>
        </figure>
        <figure className="sp-cmp good">
          <div className="sp-set">
            <div>
              <b>通知</b>
              <span>新评论</span>
              <span>生成完成</span>
            </div>
            <div>
              <b>隐私</b>
              <span>公开主页</span>
              <span>允许搜索到我</span>
            </div>
          </div>
          <figcaption>组内 8、组和组之间 24：一眼分成两组</figcaption>
        </figure>
      </div>
    </div>
  );
}
