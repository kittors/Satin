// 颜色小工具：解析（#hex、rgb()/rgba()、hsl()/hsla()、color(srgb …)、颜色关键字）、混色、相对亮度、对比度、Lab 色差、饱和度
export const NAMED = {
  aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "000000", blanchedalmond: "ffebcd", blue: "0000ff",
  blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c",
  cyan: "00ffff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkgrey: "a9a9a9", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f",
  darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f", darkslategrey: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3",
  deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dimgrey: "696969", dodgerblue: "1e90ff", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "ff00ff", gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", grey: "808080", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c",
  indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2", lightgray: "d3d3d3", lightgreen: "90ee90", lightgrey: "d3d3d3", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa", lightslategray: "778899", lightslategrey: "778899",
  lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "00ff00", limegreen: "32cd32", linen: "faf0e6", magenta: "ff00ff", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3",
  mediumpurple: "9370db", mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5",
  navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98",
  paleturquoise: "afeeee", palevioletred: "db7093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", rebeccapurple: "663399",
  red: "ff0000", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0",
  skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", slategrey: "708090", snow: "fffafa", springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8",
  tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", wheat: "f5deb3", white: "ffffff", whitesmoke: "f5f5f5", yellow: "ffff00", yellowgreen: "9acd32",
};
// 一段值里所有写死的颜色：{ text, index, rgba }（rgba 解析不了时为 null，比如 oklch）
const NAMED_RE = new RegExp(`(?<![-\\w#.])(${Object.keys(NAMED).join("|")})(?![-\\w(])`, "gi");
const FN_RE = /(?<![-\w])(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(\s*[^()]*\)/gi;
const HEX_RE = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![0-9a-z])/gi;
export function findColors(value) {
  const out = [], seen = new Set();
  const v = String(value).replace(/url\((?:[^()"']|"[^"]*"|'[^']*')*\)/gi, (m) => " ".repeat(m.length)); // url(…) 里的不算（data:image/svg 里常有 #fff）
  for (const re of [FN_RE, HEX_RE, NAMED_RE]) { re.lastIndex = 0; let m; while ((m = re.exec(v))) { if ([...seen].some(([a, b]) => m.index >= a && m.index < b)) continue; seen.add([m.index, m.index + m[0].length]); out.push({ text: m[0], index: m.index, rgba: parseColor(m[0]) }); } }
  return out.sort((a, b) => a.index - b.index);
}
const num = (s, scale = 1) => (String(s).trim().endsWith("%") ? (parseFloat(s) / 100) * scale : parseFloat(s));
// → [r, g, b, a]（0–255，a 0–1）；解析不了返回 null
export function parseColor(s) {
  s = String(s).trim().toLowerCase();
  if (s === "transparent") return [0, 0, 0, 0];
  if (NAMED[s]) s = "#" + NAMED[s];
  let m;
  if ((m = /^#([0-9a-f]{3,8})$/.exec(s))) {
    let h = m[1]; if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
  }
  if ((m = /^rgba?\(([^)]*)\)$/.exec(s))) {
    const p = m[1].replace(/\//g, " ").split(/[\s,]+/).filter(Boolean); if (p.length < 3) return null;
    return [num(p[0], 255), num(p[1], 255), num(p[2], 255), p[3] != null ? num(p[3], 1) : 1];
  }
  if ((m = /^hsla?\(([^)]*)\)$/.exec(s))) {
    const p = m[1].replace(/\//g, " ").split(/[\s,]+/).filter(Boolean); if (p.length < 3) return null;
    const hh = (parseFloat(p[0]) % 360 + 360) % 360 / 360, ss = num(p[1], 1), ll = num(p[2], 1), a = p[3] != null ? num(p[3], 1) : 1;
    const q = ll < .5 ? ll * (1 + ss) : ll + ss - ll * ss, pp = 2 * ll - q, f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? pp + (q - pp) * 6 * t : t < .5 ? q : t < 2 / 3 ? pp + (q - pp) * (2 / 3 - t) * 6 : pp; };
    return [f(hh + 1 / 3) * 255, f(hh) * 255, f(hh - 1 / 3) * 255, a];
  }
  if ((m = /^color\(srgb\s+([^)]*)\)$/.exec(s))) {
    const p = m[1].replace(/\//g, " ").split(/\s+/).filter(Boolean);
    return [num(p[0], 1) * 255, num(p[1], 1) * 255, num(p[2], 1) * 255, p[3] != null ? num(p[3], 1) : 1];
  }
  return null;
}
// color-mix(in srgb, a p%, b)：按透明度预乘混
export function mix(a, b, pa) {
  const wa = pa, wb = 1 - pa, A = a[3] * wa + b[3] * wb;
  if (A === 0) return [0, 0, 0, 0];
  return [0, 1, 2].map((i) => (a[i] * a[3] * wa + b[i] * b[3] * wb) / A).concat(A);
}
// 叠在底色上（底色不透明）
export const over = (c, bg) => [0, 1, 2].map((i) => c[i] * c[3] + bg[i] * (1 - c[3])).concat(1);
export const hex = (c) => "#" + c.slice(0, 3).map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("") + (c[3] != null && c[3] < 1 ? Math.round(c[3] * 255).toString(16).padStart(2, "0") : "");
export function luminance(c) { const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; }
export const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
export function lab(c) {
  const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  const X = (r * .4124 + g * .3576 + b * .1805) / .95047, Y = r * .2126 + g * .7152 + b * .0722, Z = (r * .0193 + g * .1192 + b * .9505) / 1.08883;
  const f = (t) => (t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
export const deltaE = (a, b) => { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
// HSL 的饱和度和亮度（0–1）
export function hsl(c) {
  const [r, g, b] = c.slice(0, 3).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  const s = mx === mn ? 0 : l > .5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn);
  return { s, l };
}
// 中性色：黑、白、灰（只有透明度不同），允许 8 以内的偏差
export const neutral = (c) => Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]) <= 8;
