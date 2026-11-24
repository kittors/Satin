import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { createTagInput } from "satin-ui/components";
import "satin-ui/css/input.css";

export default function TaginputDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current, (root: any) => {
      // 回车或逗号加标签；重复的抖一下；超过 data-max 个不让加；
      // 退格先"点亮"最后一个、再按才删；粘贴一串自动拆开；中文输入法拼字时不响应
      const tags = createTagInput(root.querySelector("[data-tagin]"), {
        tags: ["雨夜", "车站"],
        onChange: (list?: any) => console.log(list),
      });
      tags.tags;    // ["雨夜", "车站"]

      // 不写标记也行：createTagInput(空容器, { tags: ["雨夜"], max: 8 }) 按选项渲染（输入框 + 下面的计数行）
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-box-in sn-tagin" data-tagin="" data-max="8">
        <input placeholder="输入标签，回车确认" aria-label="添加标签" />
      </div>
      <div class="sn-tagin-foot">
        <span>回车或逗号添加 · 退格删除</span>
        <span class="sn-num"><span class="sn-roll">
  <span>0</span>
</span> / 8</span>
      </div>
    </div>
  );
}
