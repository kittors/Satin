import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createTagInput } from "satin-ui/components";
import "satin-ui/css/input.css";

export default function TaginputDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 回车或逗号加标签；重复的抖一下；超过 data-max 个不让加；
      // 退格先"点亮"最后一个、再按才删；粘贴一串自动拆开；中文输入法拼字时不响应
      const tags = createTagInput(root.querySelector("[data-tagin]"), {
        tags: ["雨夜", "车站"],
        onChange: (list) => console.log(list),
      });
      tags.tags;    // ["雨夜", "车站"]

      // 不写标记也行：createTagInput(空容器, { tags: ["雨夜"], max: 8 }) 按选项渲染（输入框 + 下面的计数行）
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-box-in sn-tagin" data-tagin="" data-max="8">
        <input placeholder="输入标签，回车确认" aria-label="添加标签" />
      </div>
      <div className="sn-tagin-foot">
        <span>回车或逗号添加 · 退格删除</span>
        <span className="sn-num"><span className="sn-roll">
  <span>0</span>
</span> / 8</span>
      </div>
    </div>
  );
}
