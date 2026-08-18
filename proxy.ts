import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

/**
 * Next.js 16에서 `middleware.ts`가 `proxy.ts`로 바뀌었다.
 * next-intl 문서는 아직 middleware 기준이라 여기서 이름만 맞춰준다.
 *
 * 두 가지 일을 한다.
 *  1. 언어 감지·접두사 리다이렉트·언어 쿠키 (next-intl)
 *  2. 만료된 세션 토큰 갱신 (Supabase)
 *
 * 2번이 없으면 토큰이 만료된 사용자가 로그아웃된 것처럼 보인다.
 * 갱신된 토큰은 아래 setAll을 통해 응답 쿠키로 나간다.
 */

const handleI18n = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 언어 처리를 먼저 한다. 리다이렉트가 나올 수 있는데 그 응답에도 쿠키를 붙여야 한다.
  const response = handleI18n(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getSession()이 아니라 getUser()를 쓴다. 서버에서 믿을 수 있는 건 이쪽이다 —
  // getSession()은 쿠키에 담긴 값을 검증 없이 돌려준다.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // 언어 처리를 타지 않을 경로
  // - _next        빌드 산출물
  // - api, auth    다운로드·인증 라우트 (언어 접두사가 붙으면 콜백 주소가 깨진다)
  // - brand, icon  로고·파비콘
  // - 확장자가 있는 경로는 전부 파일로 본다
  matcher: "/((?!api|auth|_next|brand|icon|.*\\..*).*)",
};
