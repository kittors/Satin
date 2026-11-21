import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createSegmented } from "satin-ui/components";
import "./segmented-0.css";

export default function SegmentedDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      // 在已有的标记上接交互；给空容器时按 items、value 渲染
      const seg = createSegmented(root.querySelector(".sn-seg"), {
        onChange: (value) => console.log("选中了", value),
      });
      seg.select("9:16"); // 从外面切过去
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="row" style="gap:24px">
        <div class="sn-seg" data-seg="a">
          <span class="sn-thumb"></span>
          <button>验证码登录</button>
          <button>密码登录</button>
        </div>
        <div class="sn-seg" data-seg="b">
          <span class="sn-thumb"></span>
          <button>网格</button>
          <button>列表</button>
          <button>时间线</button>
        </div>
        <div class="sn-seg sn-sm" data-seg="c">
          <span class="sn-thumb"></span>
          <button>7 天</button>
          <button>30 天</button>
          <button>90 天</button>
          <button>全部</button>
        </div>
      </div>
    </div>
  );
}
