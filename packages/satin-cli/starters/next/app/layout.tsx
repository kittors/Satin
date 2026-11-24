import type { ReactNode } from "react";
import themeBoot from "satin-ui/theme-boot-script";
import "satin-ui/css/page.css"; // 整页都用 Satin：令牌 + 页面级重置 + 全部组件样式

export const metadata = { title: "新建项目" };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

// theme-boot 内联进 <head>：第一帧之前给 <html> 写上 data-theme、data-radius（刷新不闪），所以 <html> 要加 suppressHydrationWarning
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBoot }} /></head>
      <body>{children}</body>
    </html>
  );
}
