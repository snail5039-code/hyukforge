import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

// 모노스페이스는 버전·용량·날짜·라벨에 쓴다. 워크벤치 톤의 핵심.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

type Params = { locale: string };

/** 10개 언어를 모두 정적 생성한다. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  // Next.js 16에서 params는 Promise다.
  const { locale } = await params;

  // [locale]은 모르는 경로까지 다 받아내는 자리라(/unknown.txt 같은),
  // 지원 언어가 아니면 여기서 걸러야 한다.
  if (!hasLocale(routing.locales, locale)) notFound();

  // 이걸 빼면 하위 페이지가 전부 동적 렌더링으로 떨어진다.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={jetbrains.variable}>
      <head>
        {/* Pretendard는 구글 폰트에 없어 직접 호스팅한다.
            scripts/fonts.mjs 가 node_modules 에서 public/fonts 로 복사한다.
            동적 서브셋이라 브라우저가 실제로 쓰는 글자 범위만 받는다. */}
        <link rel="stylesheet" href="/fonts/pretendard/pretendard.css" />
      </head>
      <body>
        {/* 서버 컴포넌트에서 렌더되면 locale과 messages를 알아서 받는다 */}
        <NextIntlClientProvider>
          <Nav />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
