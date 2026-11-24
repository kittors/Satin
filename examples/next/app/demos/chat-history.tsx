"use client";
import { Chat, type ChatHistory, type ChatItem } from "satin-ui/react/chat";

// 演示用的历史：一段真的对话（从旧到新，每条不重复）；换成你的接口——initial() 先给最近的，older() 往前要一页
const CONVO: [boolean, string][] = [
  [false, "第三集的分镜我看完了，候车厅那段节奏有点赶。"], [true, "我也觉得，加一个她收伞的停顿？"],
  [false, "可以，停两秒左右就够。"], [true, "那第 6 个镜头往后顺延，结尾不动。"],
  [false, "配音稿要跟着改吗？"], [true, "旁白第三句往后挪半秒，别的不用动。"],
  [false, "好，我晚上对一遍口型。"], [true, "雨声素材放在共享盘的「第三集」里了。"],
  [false, "拿到了，比上次那版干净。"], [true, "车站广播那句要不要留？"],
  [false, "留着吧，有年代感。音量压低一点。"], [true, "行，让混音那边压 6 分贝。"],
  [false, "明天几点对片？"], [true, "下午两点，会议室 B。"],
  [false, "我带上耳机，顺便把第四集的稿子也过一下。"], [true, "第四集的分镜还在拆，周五前给你。"],
  [false, "不急，先把第三集定下来。"], [true, "定稿后导一份镜头时长表给你。"],
  [false, "好，记得标上原文段落。"], [true, "会的，景别也一起写上。"],
  [false, "封面图换了吗？"], [true, "换成了雨夜站台那张，等会儿发你。"],
  [false, "那张的灯光好看。"], [true, "今天先这样，明天见。"],
];
const msgs = (list: [boolean, string][]): ChatItem[] => list.map(([me, text]) => ({ kind: "msg", me, text }));
const OLDER: [string, [boolean, string][]][] = [["3 天前", CONVO.slice(0, 6)], ["前天", CONVO.slice(6, 12)]];
let left = OLDER.length;
// initial() 一开始的条目（从旧到新）；往上翻到顶时 older() 要更早的一页（可以是 Promise），hasMore() 说还有没有
const history: ChatHistory = {
  initial: () => [
    { kind: "day", text: "昨天" }, ...msgs(CONVO.slice(12)),
    { kind: "day", text: "今天" },
    { kind: "msg", me: true, type: "image", g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover", cap: "雨夜车站 · 定稿" },
    { kind: "msg", me: true, type: "file", name: "第三集分镜脚本（终版）.docx", ext: "DOCX", size: 2516582 },
    { kind: "msg", me: false, text: "收到，下午配音。" },
  ],
  older: () => new Promise<ChatItem[]>((ok) => setTimeout(() => { const [day, list] = OLDER[--left]; ok([{ kind: "day", text: day }, ...msgs(list)]); }, 600)),
  hasMore: () => left > 0,
};

export default function Conversation() {
  // 消息再多也只画看得见的；往上翻快到顶时自动要更早的一页，插进来后视口不跳；history 只在创建时用（换一段对话就换 key）
  return <Chat title="林夏" status="在线" placeholder="发给林夏" history={history} />;
}
