# 이어서 작업하기

마지막 갱신: 2026-08-19

다음 세션에서 이 문서부터 읽는다. 무엇이 되고 무엇이 안 되는지, 왜 그렇게 만들었는지가 여기 있다.

---

## 지금 어디까지 됐나

| 영역 | 상태 |
| --- | --- |
| 화면 | 홈·제품 목록·제품 상세·다운로드·공지·개발 기록·소개·로그인·약관 **전부 있음** |
| 다국어 | 10개 언어, 화면 문구 133개 키 전부 일치. 폴백 `요청 → en → ko` |
| DB | 테이블 14개 + `public_profiles` 뷰, RLS 전부 적용. 마이그레이션 12개 원격 적용 완료 |
| 로그인 | **Google OAuth 동작 확인.** 관리자 1명 지정됨 |
| 관리자 | 제품 등록·수정, 릴리스 등록(GitHub 자동 가져오기) |
| 배포 | **Vercel 배포 완료. 환경 변수 반영 확인** |
| 제품 | `commute-battle` 1개 발행. 릴리스 v0.1.0 (Windows, 217.9MB) 최신 등록 |
| 다운로드 | **끝까지 검증됨** — 로그인 → 302 → GitHub 자산, 기록·카운터·`/ko/me` 확인 |
| 게시판 | 자유·요청 **목록·상세·작성·댓글·공감 동작.** 관리자 상태/고정/숨김도 있음 |
| 글쓴이 이름 | 닉네임(`/ko/me` 에서 지정). 안 정하면 `#a3f19c`. 구글 실명은 공개되지 않는다 |
| 개발 기록 | 출퇴근 전쟁일기 5건 (저장소 마이그레이션 날짜 기준) |
| 홈 통계 | "최근 업데이트"가 제품 발행일·릴리스·개발 기록 중 가장 나중을 쓴다 |

### 아직 없는 것

- 공지·개발 기록 **작성 화면** (관리자 메뉴에 링크만 있고 페이지 없음)
- 스크린샷 업로드 (Supabase Storage 버킷 `product-media` 미생성)
- 약관·개인정보처리방침 본문 (틀만 있고 "준비 중" 상태)
- 모바일 네비게이션 정리 (좁은 화면에서 접힘)
- `/ko/me` 가 제품 이름 대신 slug 를 보여준다 —
  조회가 `products ( slug )` 만 가져온다 (`app/[locale]/me/page.tsx`).
  `product_translations` 를 함께 읽어 요청 언어로 보여줘야 한다

---

## 다음에 할 일 (우선순위)

1. **공지·개발 기록 작성 화면** — 관리자 메뉴에 링크만 있다
2. **Storage 버킷 `product-media`** — 스크린샷 업로드
3. **약관·개인정보처리방침 본문** — 회원을 받고 있으므로 법적으로 필요하다
4. 모바일 네비게이션, `next/font/local` 전환 (lint 경고 1건)

---

## 계정과 주소

| 항목 | 값 |
| --- | --- |
| 레포 | https://github.com/snail5039-code/hyukforge |
| 배포 | https://hyukforge.vercel.app |
| Vercel 프로젝트 | `snail5039-aiagent/hyukforge` |
| Supabase ref | `vqogaaqgtgpfofqqksit` (서울, `snail2483` 계정) |
| 관리자 | `snail5039@gmail.com` (Google 로그인, `profiles.role = 'admin'`) |

**Supabase 계정이 두 개다.** 원래 계정(`snail5039`)은 무료 프로젝트 2개 한도가 차서
새 계정(`snail2483`)으로 이 프로젝트를 만들었다.
그래서 **Supabase MCP 도구는 이 프로젝트에 접근할 수 없다** — MCP 는 원래 계정에 OAuth 로 붙어 있고
세션 안에서 계정을 바꿀 수 없다. 마이그레이션은 CLI, 검증은 스크립트로 한다.

---

## 작업 흐름

### 마이그레이션 올리기

사용자가 직접 실행해야 한다 (토큰이 필요하다).

```bash
cd "C:\Users\snail\OneDrive\바탕 화면\hyukforge"
npx supabase db push
```

`SUPABASE_DB_PASSWORD` 는 `setx` 로 저장돼 있어서, 프로젝트가 링크된 상태면
에이전트가 실행해도 붙는다 (`SUPABASE_ACCESS_TOKEN` 은 없어도 `db push` 는 된다 —
그건 API 작업에 필요한 값이다).
PowerShell 을 새로 열면 작업 폴더가 `system32` 로 돌아가므로 `cd` 가 반드시 필요하다 —
이걸 세 번 놓쳤다. `Cannot find project ref` 오류가 나면 폴더를 확인한다.

### 검증 명령

```bash
npx tsc --noEmit              # 타입
npm run i18n:check            # 번역 키 10개 언어 일치 (빌드에 걸려 있음)
node scripts/db-check.mjs     # 원격 스키마와 접근 제어
npm run test:role-guard       # 자가 승격이 막히는지 실제로 시도
npm run build                 # 정적/동적 분포까지 확인
```

**RLS 를 건드렸으면 `db-check` 를 반드시 돌린다.** 화면을 만든 뒤에 발견하면 원인 찾기가 훨씬 어렵다.

### 로그인이 필요한 화면을 도구로 검증하기

Google 로그인은 사람이 눌러야 한다. 로그인 뒤 동작(`받기`, `/ko/me`)을
자동으로 확인해야 할 때는 service_role 키로 매직링크를 만들어 세션을 얻는다.

```
POST {SUPABASE_URL}/auth/v1/admin/generate_link
  { "type": "magiclink", "email": "snail5039@gmail.com",
    "redirect_to": "http://localhost:3000/auth/callback" }
→ 응답의 hashed_token 을
POST {SUPABASE_URL}/auth/v1/verify   { "type":"magiclink", "token_hash": ... }
→ access_token / refresh_token
```

두 가지를 놓치기 쉽다.

- `redirect_to` 는 **최상위**에 넣는다. JS 클라이언트처럼 `options` 안에 넣으면
  조용히 무시되고 Site URL 로 대체된다 — 허용 목록 문제로 잘못 진단하기 딱 좋다.
- 허용 목록은 **정확히 일치**해야 한다. `?next=...` 를 붙이면 거부된다.

쿠키는 직접 만들지 말고 `@supabase/ssr` 의 `createServerClient` 에
메모리 쿠키 어댑터를 물린 뒤 `auth.setSession()` 을 불러서 받아온다
(청크 분할·`base64-` 접두사를 알아서 처리한다). 끝나면
`POST /auth/v1/logout?scope=global` 로 세션을 폐기한다.

### 배포 환경 변수 확인

`NEXT_PUBLIC_` 값이 빌드에 박혔는지 보는 방법.
**청크 경로는 `/_next/static/immutable/chunks/` 다** (`/_next/static/chunks/` 가 아니다).
이걸 틀려서 "환경 변수가 없다"고 두 번 잘못 진단했다.

```bash
curl -s https://hyukforge.vercel.app/ko/login -o /tmp/d.html
for u in $(grep -oE '/_next/static/immutable/chunks/[^"]+[.]js' /tmp/d.html | sort -u); do
  curl -s "https://hyukforge.vercel.app$u" | grep -q vqogaaqgtgpfofqqksit && echo "박힘: $u"
done
```

브라우저로 볼 때는 콘솔 오류를 확인한다. 값이 없으면 `supabaseUrl is required` 가 뜬다.

---

## 반복해서 걸린 함정

같은 실수를 두 번 하지 않기 위해 적어둔다. 자세한 설명은 `docs/ARCHITECTURE.md` 에 있다.

**함수 실행 권한** — Postgres 는 함수를 만들 때 `EXECUTE` 를 `PUBLIC` 에 자동으로 준다.
`revoke ... from anon` 만으로는 아무 효과가 없고 `revoke ... from public` 부터 해야 한다.
그런데 전부 잠그면 안 된다 — `is_admin()` 은 RLS 정책 자신이 부르므로 `anon` 에게도 권한이 필요하다.
이걸 잠갔다가 공개 제품 조회가 통째로 막혔다.

**`SECURITY DEFINER` 와 `current_user`** — `SECURITY DEFINER` 함수 안에서는 `current_user` 가
함수 소유자로 바뀐다. 접근 주체를 판단하는 트리거에서는 쓰지 않는다.
이 때문에 첫 관리자를 만들 수 없는 상태였다.

**쿠키를 읽으면 정적 생성이 깨진다** — 공개 화면 조회에는 `lib/supabase/public.ts`(쿠키 없음)를 쓴다.
`lib/supabase/server.ts`(세션 읽음)를 공개 화면에서 쓰면 홈까지 요청마다 렌더된다.
네비게이션의 로그인 상태(`AuthButton`)와 관리자 버튼(`AdminOnly`)을
클라이언트에서 판단하는 이유도 같다.

**쓰기는 쓰고 나서 읽어본다** — PostgREST 는 트리거가 값을 되돌려도 200 을 준다.
`make-admin` 스크립트가 실패를 성공으로 보고한 적이 있다. 이제 되읽어서 확인한다.

**안전망이 문제를 가린다** — `orEmpty` 로 조회 실패를 삼키게 해뒀는데,
빌드 때 조회가 실패하는 걸 그게 가려서 빈 화면이 배포됐다. 서버 로그를 꼭 본다.

**언어 접두사와 API 라우트** — next-intl 의 `Link` 는 내부 주소로 보이면 전부 접두사를 붙인다.
`/api/download/...` 가 `/ko/api/download/...` 가 되어 받기 버튼이 404 였다.
라우트를 직접 curl 하면 302 라서 통과한다 — **화면이 실제로 거는 주소를 봐야 드러난다.**
`[locale]` 밖의 주소에는 `Btn` 의 `unlocalized` 를 쓰거나 평범한 `a` 를 쓴다.

**클라이언트 번들에 서버 모듈이 딸려간다** — 클라이언트 컴포넌트가 값(타입 아님)을 가져오는 모듈이
`lib/supabase/server.ts` 를 import 하면 `next/headers` 가 클라이언트로 끌려가 500 이 난다.
그래서 게시판은 순수 타입·상수를 `lib/board.ts` 로 빼고 조회만 `lib/queries/board.ts` 에 뒀다.

**어두운 바탕에서는 대비를 재고 정한다** — `--color-dim` 이 2.8:1 이라 라벨이 안 보였다.
눈으로 "좀 어둡네" 하고 넘어갔던 값이다. 색을 바꿀 때는 계산해서 4.5:1 을 넘기고 바꾼다.

**진단할 때** — 화면이 200이라고 정상이 아니다. 정적 파일만 200이고 페이지가 500이면
proxy 를 타는 경로만 죽은 것이고, 그 차이가 원인을 가리킨다.
그리고 "없다"는 결론을 내리기 전에 찾는 방법이 맞는지 먼저 확인한다.

---

## 설계 원칙 (바꾸기 전에 읽기)

- **설치파일은 사이트에 올리지 않는다.** GitHub Releases 에 두고 주소만 저장한다.
  Supabase 무료 대역폭이 5GB/월인데 설치파일 하나가 217MB 다.
  받기 버튼은 파일을 프록시하지 않고 302 로 넘긴다.
- **사용자 글은 번역하지 않는다.** 그래서 `notices`(내가 씀, 10개 언어)와
  `posts`(사용자가 씀, 작성 언어 그대로)를 분리했다.
- **관리자 화면 문구는 한국어로 박아둔다.** 쓰는 사람이 한 명이라 번역이 낭비다.
  사용자에게 보이는 화면은 전부 `messages/*.json` 을 쓴다.
- **숫자는 진짜만.** 0이면 0을 보여준다. 예시 데이터는 `/preview` 화면에만 쓰고 DB 에 넣지 않는다.
- **디자인 금지 목록이 `docs/DESIGN.md` 1장에 있다.** 화면을 추가할 때 먼저 읽는다.
  3D 렌더·보라 그라데이션·이모지 타일·균등 카드 그리드·스톡 사진은 쓰지 않는다.
- **결제는 아직 없다.** 스키마에 `is_free`·`price_krw`·`checkout_url`·`entitlements` 가
  이미 있으니 유료 전환 시 값만 채우면 된다. 사업자등록은 매출이 생긴 뒤에 검토한다.
