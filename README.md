# HyukForge

> 혼자 만들고 혼자 고칩니다.

박의혁(snail5039-code) 1인 소프트웨어 스튜디오의 제품 배포 사이트입니다.
사무용 도구, 작은 게임, 유틸리티, 실험적인 웹앱을 한곳에 모아 배포합니다.

**1단계 목표: 무료 배포 스토어.** 결제·사업자등록은 다음 단계로 미룹니다.

---

## 문서

| 문서 | 내용 |
| --- | --- |
| [docs/PRD.md](./docs/PRD.md) | 무엇을 왜 만드는가 — 범위, 기능 명세, 단계별 계획 |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 기술 스택, DB 스키마, 다운로드 흐름, 다국어 전략 |
| [docs/DESIGN.md](./docs/DESIGN.md) | 디자인 시스템 — 워크벤치 톤, 토큰, 컴포넌트 규칙 |
| [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) | 커밋 메시지 규칙 (Conventional Commits) |

## 기술 스택

| 영역 | 선택 |
| --- | --- |
| 프레임워크 | Next.js 15 (App Router) · React 19 · TypeScript |
| 스타일 | Tailwind CSS 4 |
| 데이터·인증 | Supabase (Postgres · Auth · Storage) |
| 파일 배포 | GitHub Releases |
| 다국어 | next-intl (10개 언어) |
| 배포 | Vercel |

## 확정된 결정

- **결제 없음.** 1단계는 전부 무료 배포. 스키마만 유료 전환에 대비해 열어둔다.
- **다운로드는 로그인 필수.** 누가 무엇을 받았는지 기록하고 업데이트 알림을 보내기 위함.
- **설치파일은 GitHub Releases에 호스팅.** 용량·대역폭 무료, 파일당 2GB.
- **제품 등록은 관리자 페이지에서.** 제품 추가에 재배포가 필요 없도록.
- **10개 언어 지원.** 한국어 기본, 미번역 언어는 영어로 폴백.
- **디자인은 워크벤치 톤.** 검정 바탕 · 앰버 단일 강조색 · 모노스페이스 라벨. 그라데이션과 글로우 금지.

## 시작하기

```bash
npm install
cp .env.example .env.local   # Supabase 키 입력
npm run dev
```
