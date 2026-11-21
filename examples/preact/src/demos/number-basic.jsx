import { Stepper } from "satin-ui/react";

export default function ShotLength() {
  return <Stepper defaultValue={4} min={1} max={60} unit="秒" label="镜头时长" />;
}
