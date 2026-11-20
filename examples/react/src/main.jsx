import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "satin-ui/css/page.css"; // 整页都用 Satin：令牌 + 页面级重置 + 全部组件样式（嵌进已有页面时改引 "satin-ui/css"）
import "../../shared/sink.css";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
