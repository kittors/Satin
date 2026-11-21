import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

export default function GridBasic() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      const grid = createDataGrid(root.querySelector('[data-ex="grid"]'), { rows: 100000 });
      // 不用了（换页、卸载）记得：grid.destroy();
      void grid;
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div data-ex="grid"></div>
    </div>
  );
}
