// 服务端组件：页面本身在服务端渲染；用到 useState 的表单放在客户端组件里（new-project.jsx）
import NewProject from "./new-project.jsx";

export default function Page() {
  return <NewProject />;
}
