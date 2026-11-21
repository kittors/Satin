<script>
  import { createChat } from "satin-ui/chat";
  // 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
  async function* respond(question, ctx) {
    const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
    for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
      await new Promise((r) => setTimeout(r, 40));
      yield answer.slice(i, i + 2);
    }
  }
  // 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
  const EMPTY = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "上次停在候车厅", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
  // 输入框顶上的上下文栏：带 options 的那项点开是菜单
  const CONTEXT = [
    { icon: "folder", text: "雨夜车站" },
    { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
    { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
  ];
  // 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
  const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
  const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];

  // 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件；挂上以后建，卸载时 destroy()
  let host;
  $effect(() => {
    const it = createChat(host, { title: "新对话", placeholder: "随心输入", respond, empty: EMPTY, context: CONTEXT, mode: MODE, models: MODELS, model: "fine",
      onModelChange: (v) => console.log("换了模型", v), onModeChange: (v) => console.log("换了权限", v) });
    return () => it.destroy();
  });
</script>

<div bind:this={host}></div>
