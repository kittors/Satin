import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

export default function GridComponent() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      createDataGrid(root.querySelector('[data-ex="grid3"]'), { rows: 100000, seed: 11 });
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div data-ex="grid3"></div>
    </div>
  );
}
