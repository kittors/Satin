import { Progress, Spinner } from "satin-ui/react";

export default function Rings() {
  return (
    <div class="sn-row">
      {/* ring：放在缩略图、按钮里的小进度；Spinner：不知道进度时转圈 */}
      <Progress ring value={0.25} label="上传 1" />
      <Progress ring value={0.62} label="上传 2" />
      <Progress ring size="lg" value={0.9} label="上传 3" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  );
}
