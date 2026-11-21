// 类型用例：菜单、右键菜单、Popover、命令面板、看图、上传、侧栏、无限列表、滚动区域、视频、音频，以及重组件子路径（对话、Markdown、流程图、画布表格）
import { Button, Menu, ContextMenu, Popover, CommandPalette, Lightbox, Upload, Sidebar, InfiniteList, ScrollArea, Player, AudioPlayer, type MenuItem, type CommandPaletteHandle } from "satin-ui/react";
import { Chat } from "satin-ui/react/chat";
import { Markdown } from "satin-ui/react/markdown";
import { Flow } from "satin-ui/react/flow";
import { CanvasGrid } from "satin-ui/react/canvas-grid";
import { useRef, useState } from "react";
const items: MenuItem[] = [{ key: "open", label: "打开", icon: "external-link", kbd: "↵" }, { type: "divider" }, { label: "移动到", children: [{ type: "group", label: "第一季" }, { key: "ep1", label: "第一集" }] }, { key: "del", label: "删除", danger: true }];
export function Extra() {
  const [i, setI] = useState<number | null>(null), [open, setOpen] = useState(false), [cur, setCur] = useState("all");
  const cmd = useRef<CommandPaletteHandle>(null), box = useRef<HTMLDivElement>(null);
  return (
    <div ref={box}>
      <Menu items={items} onSelect={(key, item) => console.log(key, item)} align="end"><Button>更多</Button></Menu>
      <ContextMenu items={items} bound={box} onSelect={(k) => console.log(k)}><div>右键这里</div></ContextMenu>
      <Popover title="分享" content={<p>拿到链接的人可以查看</p>} open={open} onOpenChange={setOpen}><Button>分享</Button></Popover>
      <CommandPalette ref={cmd} groups={[{ name: "动作", items: [{ name: "新建", icon: "plus", key: "⌘N" }] }]} onRun={(it) => console.log(it.name)} />
      <Button onClick={() => cmd.current?.open()}>命令</Button>
      <Lightbox items={[{ src: "a.jpg", ratio: 1.5 }]} index={i} onClose={() => setI(null)} thumbOf={() => null} />
      <Upload accept=".txt,.docx" maxSize={50 * 1024 * 1024} hint="支持 txt、docx" upload={async (file, progress) => { progress(1); return file.name; }} />
      <Sidebar title="Satin" items={[{ key: "all", label: "全部项目", icon: "layout-grid" }, { type: "group", label: "最近" }]} value={cur} onNavigate={(k) => setCur(k)} fx="bar"><main>主区</main></Sidebar>
      <InfiniteList loadPage={async (o, n) => Array.from({ length: n }, (_, k) => ({ title: `第 ${o + k + 1} 条` }))} renderItem={(it: { title: string }) => <b>{it.title}</b>} rowHeight={56} />
      <ScrollArea style={{ maxHeight: 200 }} fade="y" bar="hover"><p>长内容</p></ScrollArea>
      <Player src="a.mp4" poster="a.jpg" label="样片" onError={(e) => console.log(e)} />
      <AudioPlayer src="a.mp3" title="旁白" sub="00:32" />
      <Chat title="助手" status="在线" respond={async function* (text) { yield text; }} />
      <Markdown source="# 标题" />
      <Markdown>{"# 标题"}</Markdown>
      <Flow nodes={[{ id: "a", x: 0, y: 0, t: "剧本" }]} edges={[]} label="流程" />
      <CanvasGrid rows={1000000} seed={7} label="素材明细" />
    </div>
  );
}
