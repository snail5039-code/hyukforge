import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { HomeSections } from "@/components/home/HomeSections";
import type { Product, Stats } from "@/lib/queries/products";
import type { ChangelogEntry } from "@/lib/queries/changelog";

/**
 * 디자인 확인용 화면. 개발 중에만 열린다.
 *
 * DB가 비어 있어도 레이아웃을 볼 수 있게 예시 데이터를 넣는다.
 * 이 값은 DB에 들어가지 않고 이 파일 안에만 있다 — 실제 통계나 제품으로 노출되지 않는다.
 * (docs/DESIGN.md "숫자는 진짜만")
 */

export const dynamic = "force-static";

const product = (p: Partial<Product> & { slug: string; name: string }): Product => ({
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

const PRODUCTS: Product[] = [
  product({
    slug: "file-organizer",
    name: "File Organizer Pro",
    tagline: "규칙을 걸어두면 알아서 분류합니다",
    category: "office",
    iconLetter: "F",
    isFeatured: true,
    latest: {
      id: "r1",
      version: "1.2.0",
      platform: "windows",
      assetUrl: "#",
      fileSize: 25_690_112,
      releasedAt: "2026-08-16",
    },
  }),
  product({
    slug: "hyuknote",
    name: "HyukNote",
    tagline: "단축키로 여는 메모장",
    category: "office",
    iconLetter: "N",
    latest: {
      id: "r2",
      version: "1.1.0",
      platform: "windows",
      assetUrl: "#",
      fileSize: 19_084_083,
      releasedAt: "2026-08-10",
    },
  }),
  product({
    slug: "pixel-adventure",
    name: "Pixel Adventure",
    tagline: "2D 액션, 스테이지 24개",
    category: "games",
    iconLetter: "P",
    latest: {
      id: "r3",
      version: "1.0.3",
      platform: "windows",
      assetUrl: "#",
      fileSize: 327_155_712,
      releasedAt: "2026-08-14",
    },
  }),
  product({
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
  product({
    slug: "gesture-os",
    name: "GestureOS Manager",
    tagline: "카메라로 손을 읽어 PC를 조작",
    category: "labs",
    iconLetter: "G",
    publishedAt: "2026-08-10",
  }),
];

const STATS: Stats = {
  productCount: 5,
  monthlyDownloads: 1340,
  totalDownloads: 4820,
  lastUpdated: "2026-08-16",
};

const CHANGELOG: ChangelogEntry[] = [
  {
    id: "c1",
    date: "2026-08-16",
    productSlug: "file-organizer",
    productName: "File Organizer",
    body: "확장자 없는 파일이 전부 기타로 가던 문제를 고쳤습니다.",
  },
  {
    id: "c2",
    date: "2026-08-14",
    productSlug: "pixel-adventure",
    productName: "Pixel Adventure",
    body: "2-4 보스가 너무 어렵다는 말이 많아서 패턴을 하나 줄였습니다.",
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
];

export default async function Preview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 배포본에는 노출하지 않는다.
  if (process.env.NODE_ENV === "production") notFound();

  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <div className="border-b border-edge bg-panel">
        <p className="mx-auto max-w-page px-gutter py-2 font-mono text-label text-dim">
          디자인 확인용 · 아래 내용은 예시이며 DB에 들어 있지 않다
        </p>
      </div>
      <HomeSections products={PRODUCTS} stats={STATS} changelog={CHANGELOG} />
    </>
  );
}
