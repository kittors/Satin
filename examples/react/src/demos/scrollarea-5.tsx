import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Avatar } from "satin-ui/react";
import { createScrollArea } from "satin-ui/components";

export default function ScrollareaDemo5() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
      const num = (v?: any) => (v == null || v === "" ? undefined : Number(v));
      for (const el of root.querySelectorAll("[data-sa]")) {
        const d = el.dataset;
        createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
      }
      // 表格用默认的 overscroll: "auto"，不回弹（浏览器自带的回弹会把吸附的表头、合计行一起拉走）；data-sa="none" 不加边缘渐隐，免得表头、合计行被淡掉
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-tbl-wrap" style={{ "--sn-tbl-max": "236px" }}>
        <div className="sn-tbl-sc" data-sa="none">
          <table className="sn-tbl" aria-label="项目列表">
            <thead>
              <tr>
                <th>项目</th>
                <th>负责人</th>
                <th>状态</th>
                <th className="sn-r">镜头</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>雨夜车站</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u3" name="林夏" size={20} decorative />林夏</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">48</td>
              </tr>
              <tr>
                <td>
                  <b>海边的第七天</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u4" name="周屿" size={20} decorative />周屿</span>
                </td>
                <td>
                  <span className="sn-tag sn-run"><i></i>生成中</span>
                </td>
                <td className="sn-r sn-num">32</td>
              </tr>
              <tr>
                <td>
                  <b>城南旧事（第二版）</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u8" name="陈默" size={20} decorative />陈默</span>
                </td>
                <td>
                  <span className="sn-tag "><i></i>草稿</span>
                </td>
                <td className="sn-r sn-num">12</td>
              </tr>
              <tr>
                <td>
                  <b>长夜</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u11" name="许诺" size={20} decorative />许诺</span>
                </td>
                <td>
                  <span className="sn-tag sn-bad"><i></i>失败</span>
                </td>
                <td className="sn-r sn-num">20</td>
              </tr>
              <tr>
                <td>
                  <b>山那边的学校</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u5" name="李然" size={20} decorative />李然</span>
                </td>
                <td>
                  <span className="sn-tag sn-warn"><i></i>待审核</span>
                </td>
                <td className="sn-r sn-num">64</td>
              </tr>
              <tr>
                <td>
                  <b>最后一班地铁</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u3" name="林夏" size={20} decorative />林夏</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">28</td>
              </tr>
              <tr>
                <td>
                  <b>雾港</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u4" name="周屿" size={20} decorative />周屿</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">40</td>
              </tr>
              <tr>
                <td>
                  <b>春天的信</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u8" name="陈默" size={20} decorative />陈默</span>
                </td>
                <td>
                  <span className="sn-tag "><i></i>草稿</span>
                </td>
                <td className="sn-r sn-num">6</td>
              </tr>
              <tr>
                <td>
                  <b>旧城区</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u11" name="许诺" size={20} decorative />许诺</span>
                </td>
                <td>
                  <span className="sn-tag sn-run"><i></i>生成中</span>
                </td>
                <td className="sn-r sn-num">36</td>
              </tr>
              <tr>
                <td>
                  <b>天台</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u5" name="李然" size={20} decorative />李然</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">22</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>合计 10 个项目</td>
                <td></td>
                <td></td>
                <td className="sn-r sn-num">308</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
