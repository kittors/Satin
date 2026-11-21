import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createCollapse, bindCollapses } from "satin-ui/components";

export default function CollapseDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 点条目标题展开 / 收起（高度过渡）；single：同时只开一项
      const faq = createCollapse(root.querySelector(".sn-acc"), {
        single: true,
        onToggle: ({ open }) => console.log(open ? "展开" : "收起"),
      });
      faq.open(0);

      // 或者把页面上所有 .sn-acc 一次接上
      bindCollapses(document);

      // 不写标记也行：createCollapse(空容器, { items: [{ title, content }], open: [0] }) 按选项渲染
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-acc" id="acc">
        <div className="sn-acc-item sn-open">
          <button className="sn-acc-hd" aria-expanded="true"><span data-i="chevron-right"></span>导出的成片放在哪里？</button>
          <div className="sn-acc-bd">
            <div>
              <p>默认放在"下载"文件夹里，以项目名建一个子文件夹。可以在设置 → 导出里改。</p>
            </div>
          </div>
        </div>
        <div className="sn-acc-item">
          <button className="sn-acc-hd" aria-expanded="false"><span data-i="chevron-right"></span>额度用完了会怎样？</button>
          <div className="sn-acc-bd">
            <div>
              <p>新的生成会排队，等额度恢复或充值后自动继续，已经提交的任务不会丢。</p>
            </div>
          </div>
        </div>
        <div className="sn-acc-item">
          <button className="sn-acc-hd" aria-expanded="false"><span data-i="chevron-right"></span>可以多人一起编辑一个项目吗？</button>
          <div className="sn-acc-bd">
            <div>
              <p>可以。在项目里点"分享"，把链接发给协作者；同一个镜头同一时间只能一个人编辑，别人会看到"正在编辑"。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
