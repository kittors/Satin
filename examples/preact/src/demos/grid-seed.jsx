import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

export default function GridSeed() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      createDataGrid(root.querySelector('[data-ex="grid2"]'), { rows: 2000, seed: 7, label: "镜头清单，2000 行" });
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div data-ex="grid2"></div>
    </div>
  );
}
