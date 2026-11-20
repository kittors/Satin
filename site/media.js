// 官网用到的真实素材：照片来自 Unsplash（Unsplash License，可免费商用），音乐、视频来自 Mixkit（Mixkit License，可免费商用）。
// 直接引用原站的 CDN，不复制到仓库里；作者和出处在页脚"素材来源"里列出。
const U = (id, w = 960, q = 72) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const PHOTO = {
  // 片场、电影
  clapboard: { id: "1485846234645-a62644f84728", by: "Jakob Owens", alt: "路边举起的场记板" },
  soundstage: { id: "1612544409025-e1f6a56c1152", by: "Brands&People", alt: "影棚里架着灯和机器的剧组" },
  slate: { id: "1515634928627-2a4e0dae3ddf", by: "Avel Chuklanov", alt: "手里拿着场记板" },
  clapper: { id: "1594909122845-11baa439b7bf", by: "Jon Tyson", alt: "挡在脸前的场记板" },
  studio: { id: "1471341971476-ae15ff5dd4ea", by: "Alexander Dummer", alt: "摄影棚里的机位" },
  hallway: { id: "1759417501248-0aa9489dab3f", by: "Phil Hearing", alt: "走廊里架好的电影摄影机" },
  crew: { id: "1632187981988-40f3cbaeef5e", by: "Jakob Owens", alt: "围着机器讨论镜头的人" },
  projector: { id: "1788145687063-7a37303015de", by: "Marko Sun", alt: "花园里的投影幕和两把椅子" },
  // 人像
  suwan: { id: "1781888681811-332968760c2a", by: "Jonathan Borba", alt: "穿白西装、笑着的女士" },
  lin: { id: "1557053910-d9eadeed1c58", by: "Olena Bohovyk", alt: "靠墙站着、穿红衣服的女士" },
  zhou: { id: "1590086782792-42dd2350140d", by: "Ludovic Migneault", alt: "穿蓝色圆领衫的男士" },
  chen: { id: "1558730234-d8b2281b0d00", by: "Payton Tuttle", alt: "黑白照片里的男士" },
  xu: { id: "1581841064838-a470c740e8ee", by: "Andrey Zvyagintsev", alt: "戴黑帽子、穿绿衣服的女士" },
  li: { id: "1714462396046-29272a3cb549", by: "Esther Masscheleyn", alt: "穿绿衬衫的女士" },
  // 风景
  range: { id: "1532019333101-b0f43c16a912", by: "Louis Reed", alt: "连绵的山脉" },
  tree: { id: "1705435896415-933b94be4ea5", by: "Mojtaba Mohammadi", alt: "阴天山坡上一棵孤树" },
  lake: { id: "1523248948644-586f1ab2a83e", by: "Tyler Lastovich", alt: "水边的山" },
  mist: { id: "1727806935726-e380d295c559", by: "Sies Kranen", alt: "层层叠叠消失在雾里的山" },
  dunes: { id: "1765498069015-aaf7e6bc1759", by: "Royce Fonseca", alt: "浅色天空下的白沙丘" },
  snow: { id: "1524037581787-4715802662f9", by: "Helena Cook", alt: "蓝天下的雪山" },
  coast: { id: "1511087273610-b219e302a808", by: "Aimen Ben Aissa", alt: "航拍的山丘和海水" },
  dusk: { id: "1643865420039-0c4d77d0553f", by: "Jay Lo", alt: "日落时分的群山" },
  // 城市夜景
  tram: { id: "1516900557549-41557d405adf", by: "Filip Mroz", alt: "夜里停在站台边的电车" },
  crossing: { id: "1541702467897-41915a07d3a7", by: "Andre Benz", alt: "雨衣和橙色汽车经过路口" },
  road: { id: "1554103577-c0d26e9b90e0", by: "Igor Karimov", alt: "夜里的柏油路" },
  rain: { id: "1576514864427-f0809d2b66eb", by: "Gil Ribeiro", alt: "雨天街上走路的人" },
  river: { id: "1774979300738-5c8c05e1db6b", by: "Madeline Liu", alt: "城市灯光映在夜里的水面" },
  puddle: { id: "1589803196988-17b417281773", by: "Dyana Wing So", alt: "积水映着街景" },
};
export const img = (key, w, q) => U(PHOTO[key].id, w, q);

export const MUSIC = [
  { id: 127, title: "Valley Sunset", by: "Alejandro Magaña (A. M.)", dur: "2:14", cover: "mist" },
  { id: 184, title: "Vastness", by: "Andrew Ev", dur: "3:50", cover: "dunes" },
  { id: 148, title: "Forest Mist Whispers", by: "Alejandro Magaña (A. M.)", dur: "2:31", cover: "tree" },
  { id: 140, title: "Cyberpunk City", by: "Alejandro Magaña (A. M.)", dur: "1:40", cover: "river" },
];
export const musicSrc = (id) => `https://assets.mixkit.co/music/${id}/${id}.mp3`;
export const waveSrc = (id) => `https://assets.mixkit.co/music/${id}/${id}-waveform.json`;

export const VIDEO = [
  { id: 4332, title: "Times Square during a rainy night", alt: "雨夜里的时代广场", poster: "puddle" },
  { id: 4451, title: "Quiet Tokyo street at night", alt: "夜里安静的东京街道", poster: "tram" },
  { id: 3428, title: "Street with people walking at dusk", alt: "黄昏时街上走路的人", poster: "rain" },
  { id: 44370, title: "Flying over the sea during sunset", alt: "日落时贴着海面飞过", poster: "coast" },
];
export const videoSrc = (id) => `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;

// 页脚"素材来源"：按来源列出作者
export function creditsHTML() {
  const by = [...new Set(Object.values(PHOTO).map((p) => p.by))];
  return `<p><b>照片</b>来自 <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a>（Unsplash License）：${by.join("、")}。</p>`
    + `<p><b>音乐</b>来自 <a href="https://mixkit.co/free-stock-music/" target="_blank" rel="noopener">Mixkit</a>（Mixkit License）：${[...new Set(MUSIC.map((m) => m.by))].join("、")}。</p>`
    + `<p><b>视频</b>来自 <a href="https://mixkit.co/free-stock-video/" target="_blank" rel="noopener">Mixkit</a>（Mixkit License）。</p>`;
}
