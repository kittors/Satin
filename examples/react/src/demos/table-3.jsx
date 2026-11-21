"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function TableDemo3() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-tbl-wrap sn-compact">
        <div className="sn-tbl-sc">
          <table className="sn-tbl" aria-label="项目列表">
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
              <tr>
                <td>
                  <b>雨夜车站</b>
                </td>
                <td>
                  <span className="sn-name"><span className="sn-av sn-xs" style={{ "--sn-h": "210" }}>林</span>林夏</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">48</td>
                <td className="sn-r sn-num">12:36</td>
              </tr>
              <tr>
                <td>
                  <b>海边的第七天</b>
                </td>
                <td>
                  <span className="sn-name"><span className="sn-av sn-xs" style={{ "--sn-h": "30" }}>周</span>周屿</span>
                </td>
                <td>
                  <span className="sn-tag sn-run"><i></i>生成中</span>
                </td>
                <td className="sn-r sn-num">32</td>
                <td className="sn-r sn-num">8:32</td>
              </tr>
              <tr>
                <td>
                  <b>城南旧事（第二版）</b>
                </td>
                <td>
                  <span className="sn-name"><span className="sn-av sn-xs" style={{ "--sn-h": "150" }}>陈</span>陈默</span>
                </td>
                <td>
                  <span className="sn-tag "><i></i>草稿</span>
                </td>
                <td className="sn-r sn-num">12</td>
                <td className="sn-r sn-num">3:00</td>
              </tr>
              <tr>
                <td>
                  <b>长夜</b>
                </td>
                <td>
                  <span className="sn-name"><span className="sn-av sn-xs" style={{ "--sn-h": "280" }}>许</span>许诺</span>
                </td>
                <td>
                  <span className="sn-tag sn-bad"><i></i>失败</span>
                </td>
                <td className="sn-r sn-num">20</td>
                <td className="sn-r sn-num">5:00</td>
              </tr>
              <tr>
                <td>
                  <b>山那边的学校</b>
                </td>
                <td>
                  <span className="sn-name"><span className="sn-av sn-xs" style={{ "--sn-h": "340" }}>李</span>李然</span>
                </td>
                <td>
                  <span className="sn-tag sn-warn"><i></i>待审核</span>
                </td>
                <td className="sn-r sn-num">64</td>
                <td className="sn-r sn-num">17:02</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
