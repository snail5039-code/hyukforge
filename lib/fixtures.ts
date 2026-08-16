import type { Product, Stats } from "@/lib/queries/products";
import type { ChangelogEntry } from "@/lib/queries/changelog";

/**
 * 디자인 확인용 예시 데이터.
 *
 * DB에 들어가지 않는다. /preview 화면에서만 쓴다.
 * 실제 제품·통계로 노출되지 않게, 이 값을 실제 라우트에서 부르지 않는다.
 * (docs/DESIGN.md "숫자는 진짜만")
 */

const make = (
  p: Partial<Product> & { slug: string; name: string },
): Product => ({
  id: p.slug,
  kind: "download",
  category: "utilities",
  iconLetter: p.name[0],
  platforms: ["windows"],
  isFree: true,
  externalUrl: null,
  downloadCount: 0,
  publishedAt: "2026-08-16",
  isFeatured: false,
  tagline: null,
  description: null,
  requirements: null,
  latest: null,
  ...p,
});

export const PRODUCTS: Product[] = [
  make({
    slug: "file-organizer",
    name: "File Organizer Pro",
    tagline: "규칙을 걸어두면 알아서 분류합니다",
    category: "office",
    iconLetter: "F",
    isFeatured: true,
    downloadCount: 1284,
    description: `다운로드 폴더가 감당이 안 돼서 만들었습니다.

규칙을 한 번 걸어두면 새로 들어온 파일을 알아서 분류합니다. 이름만 다른 중복 파일을 찾아 주는데, 지우기 전에 무엇을 지울지 먼저 보여줍니다.

WebP 변환이 느린 건 알고 있고 다음 버전에서 고칩니다.`,
    requirements: `Windows 10 이상 · 64비트
메모리 4GB 이상
설치 공간 60MB`,
    latest: {
      id: "r1",
      version: "1.2.0",
      platform: "windows",
      assetUrl: "#",
      fileSize: 25_690_112,
      releasedAt: "2026-08-16",
    },
  }),
  make({
    slug: "hyuknote",
    name: "HyukNote",
    tagline: "단축키로 여는 메모장",
    category: "office",
    iconLetter: "N",
    downloadCount: 612,
    latest: {
      id: "r2",
      version: "1.1.0",
      platform: "windows",
      assetUrl: "#",
      fileSize: 19_084_083,
      releasedAt: "2026-08-10",
    },
  }),
  make({
    slug: "pixel-adventure",
    name: "Pixel Adventure",
    tagline: "2D 액션, 스테이지 24개",
    category: "games",
    iconLetter: "P",
    downloadCount: 2140,
    latest: {
      id: "r3",
      version: "1.0.3",
      platform: "windows",
      assetUrl: "#",
      fileSize: 327_155_712,
      releasedAt: "2026-08-14",
    },
  }),
  make({
    slug: "image-converter",
    name: "Image Converter",
    tagline: "끌어다 놓으면 한번에 변환·압축",
    category: "utilities",
    iconLetter: "I",
    downloadCount: 431,
    latest: {
      id: "r4",
      version: "1.0.0",
      platform: "windows",
      assetUrl: "#",
      fileSize: 16_462_643,
      releasedAt: "2026-07-28",
    },
  }),
  make({
    slug: "commute-battle",
    name: "출퇴근 생존일지",
    tagline: "출퇴근 기록과 경로 안내를 한곳에서",
    kind: "webapp",
    category: "webapps",
    iconLetter: "출",
    platforms: [],
    externalUrl: "https://commute-battle.vercel.app",
    publishedAt: "2026-08-02",
  }),
  make({
    slug: "my-little-restaurant",
    name: "나만의 작은 맛집",
    tagline: "가본 곳을 기록하고 다시 찾기",
    kind: "webapp",
    category: "webapps",
    iconLetter: "맛",
    platforms: [],
    externalUrl: "https://my-little-restaurant.vercel.app",
    publishedAt: "2026-06-19",
  }),
  make({
    slug: "gesture-os",
    name: "GestureOS Manager",
    tagline: "카메라로 손을 읽어 PC를 조작",
    category: "labs",
    iconLetter: "G",
    publishedAt: "2026-08-10",
  }),
];

export const FEATURED = PRODUCTS[0];

export const STATS: Stats = {
  productCount: 7,
  monthlyDownloads: 1340,
  totalDownloads: 4467,
  lastUpdated: "2026-08-16",
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: "c1",
    date: "2026-08-16",
    productSlug: "file-organizer",
    productName: "File Organizer Pro",
    body: "확장자 없는 파일이 전부 기타로 가던 문제를 고쳤습니다.",
  },
  {
    id: "c2",
    date: "2026-08-14",
    productSlug: "pixel-adventure",
    productName: "Pixel Adventure",
    body: "스테이지 3개를 넣었습니다. 2-4 보스가 너무 어렵다는 말이 많아서 패턴을 하나 줄였습니다.",
  },
  {
    id: "c3",
    date: "2026-08-10",
    productSlug: "hyuknote",
    productName: "HyukNote",
    body: "다크 모드와 전역 단축키 Ctrl+Shift+N을 넣었습니다.",
  },
  {
    id: "c4",
    date: "2026-08-02",
    productSlug: "commute-battle",
    productName: "출퇴근 생존일지",
    body: "회원 탈퇴 기능과 채팅 알림을 반영했습니다.",
  },
  {
    id: "c5",
    date: "2026-07-28",
    productSlug: "image-converter",
    productName: "Image Converter",
    body: "첫 공개입니다. WebP 변환이 느린 건 알고 있고 다음 버전에서 고칩니다.",
  },
];

/** 소개 화면의 "지금 만들고 있는 것" */
export const WIP: { name: string; note: string }[] = [
  { name: "클립보드 기록 관리 도구", note: "10월 예정" },
  { name: "Pixel Adventure 챕터 2", note: "작업 중" },
  { name: "macOS 빌드", note: "검토 중" },
  { name: "라이선스 키 발급", note: "보류" },
];
