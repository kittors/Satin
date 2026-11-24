import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "./avatar-0.css";

defineElements();

export default function AvatarDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="row" style="gap:14px">
        <sn-avatar seed="u4" name="周屿" size="16"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="20"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="24"></sn-avatar>
        <sn-avatar seed="u4" name="周屿"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="40"></sn-avatar>
        <sn-avatar seed="u4" name="周屿" size="64"></sn-avatar>
      </div>
    </div>
  );
}
