import { useRef, useState, type ChangeEvent } from "react";
import { optimistic } from "satin-ui";
import { Switch } from "satin-ui/react";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function AutosaveSetting() {
  const [on, setOn] = useState(false), row = useRef<HTMLDivElement>(null);
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
    optimistic({ shake: row.current, apply: () => setOn(next), revert: () => setOn(!next), save });
  };
  return (
    <div className="sn-opt-row" ref={row}>
      <Switch label="自动保存草稿" checked={on} onChange={change} />
    </div>
  );
}
