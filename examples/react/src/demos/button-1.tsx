import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./button-1.css";

export default function ButtonDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="btnStates">
        <div className="mx-h">
          <span></span>
          <span className="sn-cap">默认</span>
          <span className="sn-cap">悬停</span>
          <span className="sn-cap">按下</span>
          <span className="sn-cap">聚焦</span>
          <span className="sn-cap">禁用</span>
          <span className="sn-cap">等待</span>
          <span className="sn-cap">成功</span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">主按钮</span>
          <span className="mx-c">
            <button className="sn-btn sn-primary">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">保存修改</span>
              </span>
            </button>
            <small>默认</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-is-hover">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">保存修改</span>
              </span>
            </button>
            <small>悬停</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-is-active">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">保存修改</span>
              </span>
            </button>
            <small>按下</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-is-focus">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">保存修改</span>
              </span>
            </button>
            <small>聚焦</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-is-disabled" aria-disabled="true" data-tip="还没有可以保存的修改">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">保存修改</span>
              </span>
            </button>
            <small>禁用</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-busy">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">保存修改</span>
              </span>
            </button>
            <small>等待</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-ok">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">保存修改</span>
              </span>
            </button>
            <small>成功</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">次按钮（默认）</span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">导入原文</span>
              </span>
            </button>
            <small>默认</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-is-hover">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">导入原文</span>
              </span>
            </button>
            <small>悬停</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-is-active">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">导入原文</span>
              </span>
            </button>
            <small>按下</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-is-focus">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">导入原文</span>
              </span>
            </button>
            <small>聚焦</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-is-disabled" aria-disabled="true" data-tip="还没有可以保存的修改">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">导入原文</span>
              </span>
            </button>
            <small>禁用</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-busy">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">导入原文</span>
              </span>
            </button>
            <small>等待</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-ok">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">导入原文</span>
              </span>
            </button>
            <small>成功</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">更灰一档</span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">跳过</span>
              </span>
            </button>
            <small>默认</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-is-hover">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">跳过</span>
              </span>
            </button>
            <small>悬停</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-is-active">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">跳过</span>
              </span>
            </button>
            <small>按下</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-is-focus">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">跳过</span>
              </span>
            </button>
            <small>聚焦</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-is-disabled" aria-disabled="true" data-tip="还没有可以保存的修改">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">跳过</span>
              </span>
            </button>
            <small>禁用</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-busy">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">跳过</span>
              </span>
            </button>
            <small>等待</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-ok">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">跳过</span>
              </span>
            </button>
            <small>成功</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">无边框</span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">取消</span>
              </span>
            </button>
            <small>默认</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-is-hover">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">取消</span>
              </span>
            </button>
            <small>悬停</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-is-active">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">取消</span>
              </span>
            </button>
            <small>按下</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-is-focus">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">取消</span>
              </span>
            </button>
            <small>聚焦</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-is-disabled" aria-disabled="true" data-tip="还没有可以保存的修改">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">取消</span>
              </span>
            </button>
            <small>禁用</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-busy">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">取消</span>
              </span>
            </button>
            <small>等待</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ok">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">取消</span>
              </span>
            </button>
            <small>成功</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">危险</span>
          <span className="mx-c">
            <button className="sn-btn sn-danger">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">删除项目</span>
              </span>
            </button>
            <small>默认</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger sn-is-hover">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">删除项目</span>
              </span>
            </button>
            <small>悬停</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger sn-is-active">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">删除项目</span>
              </span>
            </button>
            <small>按下</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger sn-is-focus">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">删除项目</span>
              </span>
            </button>
            <small>聚焦</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger sn-is-disabled" aria-disabled="true" data-tip="还没有可以保存的修改">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">删除项目</span>
              </span>
            </button>
            <small>禁用</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger sn-busy">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">删除项目</span>
              </span>
            </button>
            <small>等待</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger sn-ok">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">删除项目</span>
              </span>
            </button>
            <small>成功</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">次要危险</span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">移除</span>
              </span>
            </button>
            <small>默认</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft sn-is-hover">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">移除</span>
              </span>
            </button>
            <small>悬停</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft sn-is-active">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">移除</span>
              </span>
            </button>
            <small>按下</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft sn-is-focus">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">移除</span>
              </span>
            </button>
            <small>聚焦</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft sn-is-disabled" aria-disabled="true" data-tip="还没有可以保存的修改">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">移除</span>
              </span>
            </button>
            <small>禁用</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft sn-busy">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">移除</span>
              </span>
            </button>
            <small>等待</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft sn-ok">
              <span className="sn-sheen"></span>
              <span className="sn-label">
                <span className="sn-spin"></span>
                <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-7"></path>
                </svg>
                <span className="sn-txt">移除</span>
              </span>
            </button>
            <small>成功</small>
          </span>
        </div>
      </div>
    </div>
  );
}
