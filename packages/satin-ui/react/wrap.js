"use client"; // Next.js 等 React 服务端组件环境：这些封装用到状态和副作用，是客户端组件
// satin-ui/react 的公共底子：把 createXxx 包成 React 组件的 wrap()，主入口（react/index.js）和重组件的子路径（react/grid.js……）都从这里拿。
// · 受控 / 非受控：给 value 就是受控（onChange 里不改 value，组件会退回去）；只给 defaultValue 就是非受控
// · ref 拿到 Satin 实例（update / destroy / 各组件的方法）
// · SSR 安全：服务端输出和浏览器第一帧一样的标记（createXxx.html），水合以后再接交互；导入时不碰 document
// · StrictMode 下挂两次、卸载一次也不漏：每次挂载都配对一次 destroy
// · 第一次挂载任何组件时自动调 setup()（Tooltip、浮层栈这些页面级行为），最后一个组件卸载时撤掉
import { createElement as h, forwardRef, useEffect, useLayoutEffect, useRef, useState, useImperativeHandle } from "react";
import { setup } from "../src/setup.js";

export const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
export const cx = (...a) => a.filter(Boolean).join(" ");
export const cap = (s) => s[0].toUpperCase() + s.slice(1);

// 把 createXxx 包成 React 组件。valueKey：受控的那个属性（value / page / tags……）；events：组件会发的事件名
export function wrap(create, { valueKey = "value", events = ["change"], displayName } = {}) {
  const C = forwardRef(function SatinComponent(props, ref) {
    const { className, style, id } = props;
    const host = useRef(null), inst = useRef(null), latest = useRef(props);
    latest.current = props;
    const defKey = "default" + cap(valueKey);
    // 传给 Satin 的选项：去掉回调（回调走下面固定的转发函数，props 换了也不用重新挂）和 defaultValue
    const optsOf = (p) => { const o = {}; for (const [k, v] of Object.entries(p)) if (!/^on[A-Z]/.test(k) && k !== defKey && k !== "className" && k !== "style" && k !== "id" && k !== "children") o[k] = v; if (p[valueKey] === undefined && p[defKey] !== undefined) o[valueKey] = p[defKey]; return o; };
    const [html] = useState(() => create.html({ ...optsOf(props) }));
    useIso(() => {
      const unsetup = setup();
      const handlers = {};
      for (const ev of events) handlers["on" + cap(ev)] = (v) => {
        latest.current["on" + cap(ev)]?.(v);
        // 受控：父组件没把新值传回来，就退回到父组件给的值
        if (ev === "change" && latest.current[valueKey] !== undefined) setTimeout(() => { const want = latest.current[valueKey]; if (inst.current && want !== undefined && JSON.stringify(inst.current[valueKey]) !== JSON.stringify(want)) inst.current.update({ [valueKey]: want }); });
      };
      inst.current = create(host.current.firstElementChild, { ...optsOf(latest.current), ...handlers });
      return () => { inst.current?.destroy(); inst.current = null; unsetup(); };
    }, []);
    // 每次渲染把最新的选项交给实例（实例自己判断有没有变化、要不要动画）
    useIso(() => { inst.current?.update(optsOf(props)); });
    useImperativeHandle(ref, () => inst.current, []);
    return h("div", { ref: host, id, className: cx("sn-host", className), style: { display: "contents", ...style }, dangerouslySetInnerHTML: { __html: html }, suppressHydrationWarning: true });
  });
  C.displayName = displayName || create.componentName;
  return C;
}
