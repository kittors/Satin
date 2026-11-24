import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot, toast } from "satin-ui";
import { Button, Chip, Input } from "satin-ui/react";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

export default function TagEditorUndo() {
  const [tags, setTags] = useState(TAGS), [text, setText] = useState(""), box = useRef<HTMLDivElement>(null), els = useRef(new Map<string, HTMLElement>());
  const now = useRef(tags); now.current = tags; // 撤销是过一会儿才调的：读最新的列表
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = (t: string, at = now.current.length) => {
    const xs = now.current;
    if (!t || xs.includes(t)) return;
    if (!box.current) return;
    const play = flipSnapshot(box.current);
    flushSync(() => setTags([...xs.slice(0, at), t, ...xs.slice(at)]));
    play(els.current.get(t));
  };
  const submit = () => { add(text.trim()); setText(""); };
  const remove = (t: string) => {
    const at = now.current.indexOf(t);
    setTags((xs) => xs.filter((x) => x !== t));
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  };
  return (
    <div>
      <div className="sn-add-row">
        <Input placeholder="添加一个标签，回车确认" aria-label="添加标签" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) submit(); }} />
        <Button onClick={submit}>添加</Button>
      </div>
      <div className="sn-chips-box" ref={box}>
        {tags.map((t) => (
          // 删除：先脱离布局淡出，剩下的用弹簧补位：Chip 自己播动画，播完调 onRemove，这时再从数据里删
          <Chip key={t} ref={(el) => { if (el) els.current.set(t, el); else els.current.delete(t); }} removable selected onRemove={() => remove(t)}>{t}</Chip>
        ))}
      </div>
    </div>
  );
}
