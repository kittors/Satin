"use client";
import { DataGrid } from "satin-ui/react/grid";

export default function ShotListFixture() {
  // 同一个 seed 每次生成一样的数据（截图、自动化测试用）；行数少一点载得更快
  return <DataGrid rows={2000} seed={7} label="镜头清单，2000 行" />;
}
