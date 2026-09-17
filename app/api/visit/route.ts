import { NextResponse, type NextRequest } from "next/server";

/**
 * 방문 집계.
 *
 * 화면에서 직접 Supabase 를 부르지 않고 이 라우트를 거친다.
 * `record_visit()` 실행 권한을 anon 에 주면 브라우저 콘솔에서 반복 호출해
 * 숫자를 올릴 수 있다. 홈에 걸리는 값이라 그건 거짓말이 된다.
 * (docs/DESIGN.md 7장 "숫자는 진짜만")
 *
 * 세는 방법
 *   같은 사람이 하루에 여러 번 와도 방문자는 1 이다. 그 판단을 쿠키 하나로 한다 —
 *   값은 마지막으로 센 KST 날짜뿐이고, 누구인지는 담지 않는다.
 *   쿠키를 지우면 다시 세어진다. IP 나 지문으로 사람을 특정하는 쪽이 더 정확하지만,
 *   방문자 수 하나를 위해 개인을 식별할 값을 남기는 건 값이 맞지 않는다.
 *
 * 알려진 한계
 *   자바스크립트가 꺼진 방문자는 세지 않는다. 봇은 UA 로 거르는데 이름을 숨긴
 *   크롤러는 지나간다. 둘 다 홈 숫자가 실제보다 조금 적거나 많을 수 있다는 뜻이고,
 *   그래도 "사람이 몇 명 왔나"에 가장 가까운 값이다.
 */

// 쿠키를 읽고 쓰므로 캐시하면 안 된다
export const dynamic = "force-dynamic";

const COOKIE = "hf_visit";

/** 이름을 밝히는 크롤러·미리보기·계측 도구. 사람 방문이 아니다. */
const BOT =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|monitor|curl|wget|headless|lighthouse|pingdom|uptime/i;

export async function POST(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  // UA 가 아예 없는 요청도 브라우저가 아니다
  if (!ua || BOT.test(ua)) return done(request, null);

  const today = kstDay();
  const newVisitor = request.cookies.get(COOKIE)?.value !== today;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // 변수가 빠진 것과 숫자가 0 인 것은 다른 문제다. 로그로 구분할 수 있게 남긴다.
    console.error("[visit] 서버 키가 없어 집계를 건너뜁니다");
    return done(request, null);
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/record_visit`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ new_visitor: newVisitor }),
    });

    if (!res.ok) console.error("[visit] 기록 실패", res.status, await res.text());
  } catch (error) {
    // 집계가 실패해도 방문자에게 보일 일은 없다. 화면은 이 응답을 기다리지 않는다.
    console.error("[visit] 기록 실패", error);
  }

  return done(request, today);
}

/**
 * 본문 없이 끝낸다. 화면에 돌려줄 값이 없다 —
 * 홈의 숫자는 다음 재생성 때 서버가 다시 읽는다.
 */
function done(request: NextRequest, day: string | null) {
  const response = new NextResponse(null, { status: 204 });

  if (day) {
    response.cookies.set(COOKIE, day, {
      httpOnly: true,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
      maxAge: secondsUntilKstMidnight(),
    });
  }

  return response;
}

/** 오늘(KST). 사이트의 다른 날짜와 기준을 맞춘다 (lib/format.ts). */
function kstDay(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * 쿠키는 KST 자정에 만료된다.
 * 고정 24시간으로 두면 어제 23시에 온 사람이 오늘 22시까지 새 방문자가 아니게 된다.
 */
function secondsUntilKstMidnight(): number {
  const now = new Date();
  const kstNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
  const midnight = new Date(kstNow);
  midnight.setHours(24, 0, 0, 0);

  return Math.max(60, Math.floor((midnight.getTime() - kstNow.getTime()) / 1000));
}
