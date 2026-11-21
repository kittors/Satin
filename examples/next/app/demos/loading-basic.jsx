"use client";
export default function LoadingBasic() {
  return (
    <div className="sn-sk-list" aria-busy="true" aria-label="正在加载镜头">
    <div className="sn-sk-row"><span className="sn-sk" style={{ width: "64px", height: "40px", borderRadius: "6px" }}></span><div className="sn-meta"><span className="sn-sk" style={{ width: "46%", height: "12px" }}></span><span className="sn-sk" style={{ width: "22%", height: "10px" }}></span></div></div>
    <div className="sn-sk-row"><span className="sn-sk" style={{ width: "64px", height: "40px", borderRadius: "6px" }}></span><div className="sn-meta"><span className="sn-sk" style={{ width: "38%", height: "12px" }}></span><span className="sn-sk" style={{ width: "22%", height: "10px" }}></span></div></div>
    <div className="sn-sk-row"><span className="sn-sk" style={{ width: "64px", height: "40px", borderRadius: "6px" }}></span><div className="sn-meta"><span className="sn-sk" style={{ width: "52%", height: "12px" }}></span><span className="sn-sk" style={{ width: "22%", height: "10px" }}></span></div></div>
    </div>
  );
}
