export default function TagsAvatar() {
  return (
    <div className="sn-row">
      <span className="sn-av sn-sm" style={{ "--sn-h": 30 }}>周</span>
      <span className="sn-av" style={{ "--sn-h": 150 }}>陈</span>
      <span className="sn-av sn-lg sn-online" style={{ "--sn-h": 340 }}>李<i></i></span>
      <div className="sn-av-group" tabIndex="0" data-tip="林夏、周屿、陈默 3 人">
        <span className="sn-av sn-sm" style={{ "--sn-h": 210 }}>林</span>
        <span className="sn-av sn-sm" style={{ "--sn-h": 30 }}>周</span>
        <span className="sn-av sn-sm" style={{ "--sn-h": 150 }}>陈</span>
      </div>
    </div>
  );
}
