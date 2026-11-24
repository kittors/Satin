import { For } from "solid-js";

export default function AvatarSizes() {
  return (
    <div class="sn-row">
      <For each={[16, 20, 24, 32, 40, 64]}>{(size) => <sn-avatar name="张伟" size={size}></sn-avatar>}</For>
    </div>
  );
}
