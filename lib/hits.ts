import { classifyAgent } from "./visitors";

/**
 * 페이지 요청 한 건을 기록한다. 사람과 봇을 갈라 날짜별로 쌓는다.
 *
 * 프록시(proxy.ts)에서 부른다 — 봇은 자바스크립트를 돌리지 않아
 * 브라우저가 알리는 /api/visit 에 영영 잡히지 않기 때문이다.
 * 서버가 받은 자리에서 세야 "오늘 온 것 중 몇이 크롤러였나"를 알 수 있다.
 *
 * 응답을 기다리지 않는다. 부르는 쪽이 next/server 의 after() 로 감싸서
 * 응답이 나간 뒤에 돌린다 — 통계 때문에 화면이 늦어지면 안 된다.
 */

/**
 * 요청마다 로그를 찍으면 로그가 못 쓰게 된다. 같은 이유는 한 번만 알린다.
 *
 * 특히 마이그레이션을 아직 안 올렸을 때가 그렇다 — record_hit() 이 없어
 * 모든 페이지 요청이 404 를 하나씩 남긴다. 그걸 다 찍으면 정작 봐야 할
 * 오류가 묻힌다.
 */
const warned = new Set<string>();

function warnOnce(key: string, ...message: unknown[]) {
  if (warned.has(key)) return;
  warned.add(key);
  console.error(...message);
}

export async function recordHit(userAgent: string | null): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    warnOnce("key", "[hit] 서버 키가 없어 요청 집계를 건너뜁니다");
    return;
  }

  const { isBot, label } = classifyAgent(userAgent);

  try {
    const res = await fetch(`${url}/rest/v1/rpc/record_hit`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_is_bot: isBot, p_agent: label }),
    });

    if (!res.ok) {
      warnOnce(`http:${res.status}`, "[hit] 기록 실패", res.status, await res.text());
    }
  } catch (error) {
    // 집계가 실패해도 방문자에게 보일 일은 없다. 응답은 이미 나갔다.
    warnOnce("throw", "[hit] 기록 실패", error);
  }
}

/**
 * 셀 만한 요청인가.
 *
 *  · 관리자 화면과 목업(/preview)은 내가 보는 것이다. 세면 숫자가 거짓이 된다.
 *  · 문서 요청만 센다. Next 는 화면 안에서 옮겨 다닐 때 RSC 요청을 따로 보내고
 *    링크에 마우스만 올려도 미리 받아온다. 그걸 다 세면 사람 쪽만 몇 배로 부푼다.
 *    봇은 sec-fetch-dest 를 보내지 않으므로 헤더가 없으면 통과시킨다.
 */
export function countableHit(pathname: string, secFetchDest: string | null): boolean {
  if (/\/(admin|preview)(\/|$)/.test(pathname)) return false;
  if (secFetchDest && secFetchDest !== "document") return false;
  return true;
}
