import type { ReactNode } from "react";
import themeBoot from "satin-ui/theme-boot-script";
import "satin-ui/css/page.css"; // 整页都用 Satin：令牌 + 页面级重置 + 全部组件样式
import "../../shared/sink.css";

export const metadata = { title: "Satin · Next.js" };

// theme-boot 在第一帧之前给 <html> 写上 data-theme、data-radius（刷新不闪），所以 <html> 要加 suppressHydrationWarning
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBoot }} /></head>
      <body>{children}</body>
    </html>
  );
}
