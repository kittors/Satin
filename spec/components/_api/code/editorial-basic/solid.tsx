import { For } from "solid-js";
import { copied, toast } from "satin-ui";

const SWATCHES = [
  { name: "雨夜深蓝", hex: "#1C2733", tip: "积水暗部阴影基调 · 点击复制" },
  { name: "钠灯冷灰", hex: "#4A6274", tip: "雨幕漫反射中间调 · 点击复制" },
  { name: "钨丝暖琥珀", hex: "#C8935B", tip: "候车厅室内暖光高光 · 点击复制" },
  { name: "尾灯暗红", hex: "#7D2932", tip: "列车制动灯点缀色 · 点击复制" },
];

export default function EditorialBasic() {
  const copy = (hex: string, e: MouseEvent) => {
    const btn = e.currentTarget as HTMLButtonElement;
    navigator.clipboard?.writeText(hex).catch(() => {});
    copied(btn);
    toast({ text: `已复制 ${hex}` });
  };
  return (
    <sn-enhance>
      <div class="sn-ed">
        <header class="sn-ed-head">
          <div class="sn-ed-title" role="heading" aria-level={3}>把冷雨夜的光影层次，压进三分钟的留白里</div>
          <p class="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p>
        </header>
        <figure class="sn-ed-quote">
          <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
          <cite>导演分镜批注 · 第三集定稿评审</cite>
        </figure>
        <div class="sn-ed-palette-strip">
          <span class="sn-ed-palette-lbl">本场实景主光采样</span>
          <div class="sn-ed-swatches">
            <For each={SWATCHES}>
              {(s) => (
                <button type="button" class="sn-ed-swatch" data-hex={s.hex} style={{ "--sn-c": s.hex }} data-tip={s.tip} onClick={(e) => copy(s.hex, e)}>
                  <i></i><b>{s.name}</b><code>{s.hex}</code>
                  <span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span>
                </button>
              )}
            </For>
          </div>
        </div>
      </div>
    </sn-enhance>
  );
}
