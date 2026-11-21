// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
"use client";
import { Component } from "react";

// 每个演示套一层错误边界：一个演示出错只影响它自己（报错照样进控制台，验收脚本照样记下）
export default class Guard extends Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { console.error("演示 " + this.props.slug + " 出错：", err); }
  render() { return this.state.err ? <p className="demo-err">演示出错：{String(this.state.err?.message ?? this.state.err)}</p> : this.props.children; }
}
