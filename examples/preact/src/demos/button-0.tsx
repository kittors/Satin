import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { busy, succeed } from "satin-ui/components";
import "./button-0.css";

export default function ButtonDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current, (root: any) => {
      // 点"保存修改"：300ms 内回来不转圈；转圈出现后至少留 500ms；完了打个勾
      for (const save of root.querySelectorAll(".sn-btn.sn-primary")) {
        save.addEventListener("click", async () => {
          await busy(save, 1200); // 第二个参数是毫秒或 Promise，比如 fetch("/api/projects/42", { method: "PUT" })
          succeed(save);
        });
      }
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="btnSizes">
        <div class="mx-h">
          <span></span>
          <span class="sn-cap">sm 28</span>
          <span class="sn-cap">md 32（默认）</span>
          <span class="sn-cap">lg 40</span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">主按钮</span>
          <span class="mx-c">
            <button class="sn-btn sn-primary sn-sm">保存修改</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-primary">保存修改</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-primary sn-lg">保存修改</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">次按钮（默认）</span>
          <span class="mx-c">
            <button class="sn-btn sn-secondary sn-sm">导入原文</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-secondary">导入原文</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-secondary sn-lg">导入原文</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">更灰一档</span>
          <span class="mx-c">
            <button class="sn-btn sn-tertiary sn-sm">跳过</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-tertiary">跳过</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-tertiary sn-lg">跳过</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">无边框</span>
          <span class="mx-c">
            <button class="sn-btn sn-ghost sn-sm">取消</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-ghost">取消</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-ghost sn-lg">取消</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">危险</span>
          <span class="mx-c">
            <button class="sn-btn sn-danger sn-sm">删除项目</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-danger">删除项目</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-danger sn-lg">删除项目</button>
            <small>lg 40</small>
          </span>
        </div>
        <div class="mx-r">
          <span class="sn-cap">次要危险</span>
          <span class="mx-c">
            <button class="sn-btn sn-danger-soft sn-sm">移除</button>
            <small>sm 28</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-danger-soft">移除</button>
            <small>md 32（默认）</small>
          </span>
          <span class="mx-c">
            <button class="sn-btn sn-danger-soft sn-lg">移除</button>
            <small>lg 40</small>
          </span>
        </div>
      </div>
    </div>
  );
}
