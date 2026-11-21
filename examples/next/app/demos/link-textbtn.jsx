"use client";
export default function LinkTextbtn() {
  return (
    <div className="sn-row">
      <button type="button" className="sn-textbtn">编辑</button>
      <button type="button" className="sn-textbtn sn-quiet">取消</button>
      <button type="button" className="sn-textbtn sn-quiet">忘记密码？</button>
      <button type="button" className="sn-textbtn sn-danger-text">删除草稿</button>
    </div>
  );
}
