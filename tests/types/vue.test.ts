import { defineComponent, h, ref } from "vue";
import Satin, { Button, Segmented, toast } from "satin-ui/vue";
export default defineComponent({
  setup() {
    const v = ref("网格");
    return () => h("div", [h(Button, { variant: "primary", onClick: () => toast({ text: "已保存" }) }, () => "保存"), h(Segmented, { items: ["网格", "列表"], modelValue: v.value, "onUpdate:modelValue": (x: string) => (v.value = x) })]);
  },
});
export const plugin = Satin;
