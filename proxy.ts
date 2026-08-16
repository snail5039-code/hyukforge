import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16에서 `middleware.ts`가 `proxy.ts`로 바뀌었다.
 * next-intl 문서는 아직 middleware 기준이라 여기서 이름만 맞춰준다.
 * 동작은 동일하다 — 언어 감지, 접두사 리다이렉트, 언어 쿠키.
 */
export const proxy = createMiddleware(routing);

export const config = {
  // 정적 파일과 API는 언어 처리를 타지 않는다.
  // - _next        빌드 산출물
  // - api          다운로드·인증 라우트 (언어는 쿼리로 받는다)
  // - brand, icon  로고·파비콘
  // - 확장자가 있는 경로는 전부 파일로 본다
  matcher: "/((?!api|_next|brand|icon|.*\\..*).*)",
};
