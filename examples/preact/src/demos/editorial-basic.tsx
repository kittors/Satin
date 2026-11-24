import type { CSSProperties, MouseEvent } from "react";
import { Icon } from "satin-ui/react";
import { copied, toast } from "satin-ui";

const SWATCHES = [
  { name: "雨夜深蓝", hex: "#1C2733", tip: "积水暗部阴影基调 · 点击复制" },
  { name: "钠灯冷灰", hex: "#4A6274", tip: "雨幕漫反射中间调 · 点击复制" },
  { name: "钨丝暖琥珀", hex: "#C8935B", tip: "候车厅室内暖光高光 · 点击复制" },
  { name: "尾灯暗红", hex: "#7D2932", tip: "列车制动灯点缀色 · 点击复制" },
];

export default function EditorialBasic() {
  const copy = (hex: string, e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    navigator.clipboard?.writeText(hex).catch(() => {});
    copied(btn);
    toast({ text: `已复制 ${hex}` });
  };
  return (
    <div className="sn-ed">
      <header className="sn-ed-head">
        <div className="sn-ed-title" role="heading" aria-level={3}>把冷雨夜的光影层次，压进三分钟的留白里</div>
        <p className="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
      </header>
      <figure className="sn-ed-quote">
        <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
        <cite>导演分镜批注 · 第三集定稿评审</cite>
      </figure>
      <div className="sn-ed-palette-strip">
        <span className="sn-ed-palette-lbl">本场实景主光采样</span>
        <div className="sn-ed-swatches">
          {SWATCHES.map((s) => (
            <button key={s.hex} type="button" className="sn-ed-swatch" data-hex={s.hex} style={{ "--sn-c": s.hex } as CSSProperties} data-tip={s.tip} onClick={(e) => copy(s.hex, e)}>
              <i></i><b>{s.name}</b><code>{s.hex}</code>
              <span className="sn-swap"><span className="sn-a"><Icon name="copy" /></span><span className="sn-b"><Icon name="check" /></span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
