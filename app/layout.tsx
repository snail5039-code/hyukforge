import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 모노스페이스는 버전·용량·날짜·라벨에 쓴다. 워크벤치 톤의 핵심.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HyukForge",
    template: "%s · HyukForge",
  },
  description: "혼자 만들고 혼자 고칩니다. 사무용 도구, 작은 게임, 잡다한 유틸리티.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={jetbrains.variable}>
      <head>
        {/* Pretendard는 구글 폰트에 없어 CDN에서 받는다. 동적 서브셋이라 한글 용량 부담이 적다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
