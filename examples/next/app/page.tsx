// 服务端组件：直接用 satin-ui/react 的组件（库里已经标了 "use client"），服务端输出完整标记，水合以后接上交互
import Sink from "./sink";
export const dynamic = "force-dynamic"; // 每次请求都在服务端渲染（不做构建时预渲染），验收服务端渲染 + 水合
export default function Page() { return <Sink />; }
