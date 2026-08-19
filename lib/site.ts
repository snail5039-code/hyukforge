/**
 * 사이트의 정식 주소.
 *
 * sitemap 과 hreflang 에 들어가는 값이라 틀리면 검색엔진이 엉뚱한 주소를 먹는다.
 * NEXT_PUBLIC_SITE_URL 은 로컬에서 http://localhost:3000 이라 그대로 쓰면 안 된다 —
 * 빌드가 로컬에서 돌아도 사이트맵에는 실제 주소가 들어가야 한다.
 *
 * 순서
 *   1. NEXT_PUBLIC_SITE_URL — 단, localhost 면 건너뛴다
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel 이 배포 때 자동으로 넣는다
 *   3. 박아둔 기본값
 */
const FALLBACK = "https://hyukforge.vercel.app";

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv && !/localhost|127\.0\.0\.1/.test(fromEnv)) {
    return fromEnv.replace(/\/+$/, "");
  }

  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (fromVercel) return `https://${fromVercel.replace(/\/+$/, "")}`;

  return FALLBACK;
}

/** 검색엔진에 넣지 않는 경로. robots 와 sitemap 이 같은 목록을 본다. */
export const PRIVATE_PATHS = [
  "/admin",
  "/me",
  "/api",
  "/auth",
  // 디자인 확인용 목업이다. 실제 내용이 아니라 색인되면 안 된다.
  "/preview",
] as const;

/**
 * 서버가 자기 자신을 부를 때 쓰는 origin.
 *
 * siteUrl() 과 다르다. 저건 검색엔진에 보여줄 정식 주소라 로컬에서도
 * 프로덕션 주소를 준다. 그 주소로 자기 파일을 받으러 가면 로컬 개발 중에는
 * 아직 배포되지 않은 파일을 받으려다 404 HTML 을 받는다.
 * (OG 폰트를 그렇게 받으려다 "Unsupported OpenType signature <!DO" 를 봤다)
 *
 * 여기서는 지금 돌고 있는 서버의 주소가 필요하다.
 */
export function selfOrigin(): string {
  // Vercel 이 배포마다 넣어준다. 미리보기 배포에서도 자기 주소가 맞다.
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
