export default function QualityPicker() {
  return (
    <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
      <label class="sn-radio"><input type="radio" name="quality" value="standard" checked /><span class="sn-box"></span>标准画质</label>
      <label class="sn-radio"><input type="radio" name="quality" value="high" /><span class="sn-box"></span>高画质</label>
      <label class="sn-radio"><input type="radio" name="quality" value="max" /><span class="sn-box"></span>最高画质（更慢）</label>
    </div>
  );
}
