import type { Stats } from "./products";

/**
 * DB 조회가 실패해도 화면 전체가 죽지 않게 한다.
 *
 * 왜 필요한가
 *  · Supabase 무료 프로젝트는 일정 기간 쓰지 않으면 일시정지된다
 *  · 마이그레이션이 아직 안 올라간 상태로 배포될 수 있다
 *  · 어느 쪽이든 소개 글과 네비게이션까지 같이 죽을 이유는 없다
 *
 * 조회 함수 자체는 그대로 throw 한다. 오류를 삼키는 건 화면 쪽 결정이다.
 * 서버 로그에는 남기므로 조용히 묻히지 않는다.
 */
export function orEmpty<T>(fallback: T, label: string) {
  return (error: unknown): T => {
    console.error(`[query:${label}] 조회 실패 — 빈 값으로 렌더합니다`, error);
    return fallback;
  };
}

export const EMPTY_STATS: Stats = {
  productCount: 0,
  monthlyDownloads: 0,
  totalDownloads: 0,
  lastUpdated: null,
};
