import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

export default function GridBasic() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      const grid = createDataGrid(root.querySelector('[data-ex="grid"]'), { rows: 100000 });
      // 不用了（换页、卸载）记得：grid.destroy();
      void grid;
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div data-ex="grid"></div>
    </div>
  );
}
