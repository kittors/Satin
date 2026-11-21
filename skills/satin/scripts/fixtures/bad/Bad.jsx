// 坏组件（检查器自测用）
import { Sparkles, Wand2 } from "lucide-react";
export default function Hero() {
  const el = document.querySelector(".x");
  el.animate([{ width: "0px" }, { width: "200px" }], { duration: 300 });
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-500 p-[13px] text-gray-500 font-bold transition-all shadow-purple-500/50 uppercase tracking-widest">
      <Sparkles size={16} />
      <h1 style={{ color: "#333", padding: 13, fontWeight: 800 }}>一键智能生成，赋能你的创作！🚀</h1>
      <p>Lorem ipsum dolor sit amet</p>
      <p>这是对话的开始</p>
      <span className="sn-av">林</span>
      <a href="/all" className="sn-t-callout">全部项目</a>
      <select><option>全部</option></select>
      <button className="sn-btn">保存<br />草稿</button>
      <span>已载入 1,208 条</span>
      <Chat title="分镜助手" status="在线" respond={async function* (q) { yield `收到：“${q}”。`; }} />
      <button className="outline-none" onClick={() => {}}>开始</button>
    </section>
  );
}
