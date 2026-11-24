import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function TableDemo7() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-tbl-wrap">
        <div className="sn-tbl-sc">
          <table className="sn-tbl" aria-label="正在加载" aria-busy="true">
            <thead>
              <tr>
                <th>项目</th>
                <th>负责人</th>
                <th>状态</th>
                <th className="sn-r">镜头</th>
                <th className="sn-r">时长</th>
              </tr>
            </thead>
            <tbody>
              <tr className="sn-tbl-sk">
                <td>
                  <i className="sn-sk" style={{ width: "60%" }}></i>
                </td>
                <td>
                  <i className="sn-sk" style={{ width: "48px" }}></i>
                </td>
                <td>
                  <i className="sn-sk" style={{ width: "56px" }}></i>
                </td>
                <td className="sn-r">
                  <i className="sn-sk" style={{ width: "24px" }}></i>
                </td>
                <td className="sn-r">
                  <i className="sn-sk" style={{ width: "36px" }}></i>
                </td>
              </tr>
              <tr className="sn-tbl-sk">
                <td>
                  <i className="sn-sk" style={{ width: "60%" }}></i>
                </td>
                <td>
                  <i className="sn-sk" style={{ width: "48px" }}></i>
                </td>
                <td>
                  <i className="sn-sk" style={{ width: "56px" }}></i>
                </td>
                <td className="sn-r">
                  <i className="sn-sk" style={{ width: "24px" }}></i>
                </td>
                <td className="sn-r">
                  <i className="sn-sk" style={{ width: "36px" }}></i>
                </td>
              </tr>
              <tr className="sn-tbl-sk">
                <td>
                  <i className="sn-sk" style={{ width: "60%" }}></i>
                </td>
                <td>
                  <i className="sn-sk" style={{ width: "48px" }}></i>
                </td>
                <td>
                  <i className="sn-sk" style={{ width: "56px" }}></i>
                </td>
                <td className="sn-r">
                  <i className="sn-sk" style={{ width: "24px" }}></i>
                </td>
                <td className="sn-r">
                  <i className="sn-sk" style={{ width: "36px" }}></i>
                </td>
              </tr>
              <tr className="sn-tbl-sk">
                <td>
                  <i className="sn-sk" style={{ width: "60%" }}></i>
                </td>
                <td>
                  <i className="sn-sk" style={{ width: "48px" }}></i>
                </td>
                <td>
                  <i className="sn-sk" style={{ width: "56px" }}></i>
                </td>
                <td className="sn-r">
                  <i className="sn-sk" style={{ width: "24px" }}></i>
                </td>
                <td className="sn-r">
                  <i className="sn-sk" style={{ width: "36px" }}></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
