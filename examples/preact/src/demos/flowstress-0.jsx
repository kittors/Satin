import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function FlowstressDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>

    </div>
  );
}
