import { Slider } from "satin-ui/react";

export default function VolumeSlider() {
  return <Slider defaultValue={40} max={100} label="音量" />;
}
