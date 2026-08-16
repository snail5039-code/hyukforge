import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeNames, locales } from "@/i18n/routing";

/**
 * 디자인 토큰 + 다국어 확인용 임시 페이지.
 * 실제 홈 화면으로 교체될 자리다. (기준: docs/mockup.html)
 */

const colors = [
  ["bg", "#060606", "바탕 · 로고와 동일"],
  ["panel", "#0B0B0A", "카드 안쪽"],
  ["ink", "#EDEAE4", "본문"],
  ["mute", "#8A857D", "보조"],
  ["dim", "#5B574F", "라벨"],
  ["line", "#1E1C19", "구분선"],
  ["edge", "#2A2723", "테두리"],
  ["amber", "#E29B2E", "강조 · 로고에서 추출"],
];

const categoryKeys = ["office", "games", "utilities", "webapps", "labs"] as const;
const categoryColor = {
  office: "office",
  games: "games",
  utilities: "utils",
  webapps: "webapp",
  labs: "labs",
} as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-16">
      <div className="mb-6 flex items-baseline gap-4">
        <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{title}</h2>
        <span className="-translate-y-[3px] flex-1 border-t border-line" />
      </div>
      {children}
    </section>
  );
}

export default async function TokenCheck({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="mx-auto max-w-page px-gutter pb-24">
      <div className="flex items-center gap-3 border-b border-line py-5">
        {/* 마크는 28px 미만으로 줄이지 않는다 — 사선 디테일이 뭉개진다 */}
        <Image
          src="/brand/mark.png"
          alt="HyukForge"
          width={458}
          height={331}
          priority
          className="h-7 w-auto"
        />
        <Image
          src="/brand/wordmark.png"
          alt=""
          width={950}
          height={88}
          priority
          className="hidden h-[13px] w-auto sm:block"
        />
        <span className="u-label ml-auto">토큰·다국어 확인 · 임시</span>
      </div>

      {/* ── 언어 전환 ─────────────────────────────────── */}
      <Section title={t("common.language")}>
        <div className="flex flex-wrap gap-px bg-line">
          {locales.map((l) => (
            <Link
              key={l}
              href="/"
              locale={l}
              className={`bg-bg px-4 py-[9px] font-mono text-data transition-colors hover:text-ink ${
                l === locale ? "text-amber" : "text-dim"
              }`}
            >
              {localeNames[l]}
              <span className="ml-2 text-[9px] text-dim">{l}</span>
            </Link>
          ))}
        </div>
        <p className="u-label mt-4">
          현재 {locale} · 번역이 비어 있으면 en → ko 순으로 폴백된다
        </p>
      </Section>

      {/* ── 번역 확인 ─────────────────────────────────── */}
      <Section title={t("section.about")}>
        <span className="u-label">{t("home.eyebrow")}</span>
        <h1 className="mt-4 text-[clamp(30px,4.2vw,50px)] font-bold leading-[1.18] tracking-[-0.03em]">
          {t.rich("home.headline", {
            br: () => <br />,
            accent: (chunks) => (
              <em className="not-italic text-amber">{chunks}</em>
            ),
          })}
        </h1>
        <p className="mt-5 max-w-[46ch] text-mute">{t("home.lead")}</p>

        <div className="mt-8 flex flex-wrap gap-[10px]">
          <button className="border border-amber bg-amber px-5 py-[11px] font-mono text-[12px] font-semibold tracking-btn text-on-amber transition-colors hover:border-amber-hi hover:bg-amber-hi">
            {t("home.ctaProducts")}
          </button>
          <button className="border border-edge px-5 py-[11px] font-mono text-[12px] tracking-btn text-ink transition-colors hover:border-ink">
            {t("home.ctaChangelog")}
          </button>
        </div>

        <p className="mt-6 border-l border-edge pl-3 text-[12.5px] text-dim">
          {t("home.privacyNote")}
        </p>
      </Section>

      {/* ── 분류 태그 ─────────────────────────────────── */}
      <Section title={t("product.category")}>
        <div className="flex flex-wrap gap-2">
          {categoryKeys.map((key) => (
            <span
              key={key}
              className="border px-2 py-[3px] font-mono text-tag tracking-tag"
              style={{
                color: `var(--color-${categoryColor[key]})`,
                borderColor: `var(--color-${categoryColor[key]})`,
              }}
            >
              {t(`category.${key}`)}
            </span>
          ))}
        </div>
      </Section>

      {/* ── 사양표 ────────────────────────────────────── */}
      <Section title={t("product.requirements")}>
        <div className="border-t border-line">
          {[
            [t("product.version"), "1.2.0"],
            [t("product.size"), "24.5 MB"],
            [t("product.platform"), "Windows 10 / 11"],
            [t("product.updated"), "2026.08.16"],
            [t("product.price"), t("product.free")],
          ].map(([k, v]) => (
            <dl
              key={k}
              className="grid grid-cols-[130px_1fr] border-b border-line py-2 font-mono text-data"
            >
              <dt className="text-dim">{k}</dt>
              <dd className="text-mute">{v}</dd>
            </dl>
          ))}
          <p className="u-label mt-3">
            숫자 폭이 일정하게 정렬되면 JetBrains Mono가 정상 로드된 것이다
          </p>
        </div>
      </Section>

      {/* ── 색 ────────────────────────────────────────── */}
      <Section title="색">
        <div className="grid grid-cols-2 gap-px border border-edge bg-line sm:grid-cols-4">
          {colors.map(([name, hex, use]) => (
            <div key={name} className="bg-bg p-4">
              <div
                className="mb-3 h-12 border border-line"
                style={{ background: hex }}
              />
              <div className="font-mono text-data text-ink">{name}</div>
              <div className="u-label mt-1">{hex}</div>
              <div className="mt-1 text-[12px] text-mute">{use}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 로고 ──────────────────────────────────────── */}
      <Section title="로고">
        <div className="py-10">
          <Image
            src="/brand/lockup.trim.png"
            alt="HyukForge — Independent Software Studio"
            width={976}
            height={518}
            className="w-full max-w-[420px]"
          />
          <p className="u-label mt-4">
            바탕(--color-bg) 위 · 테두리가 보이면 색이 어긋난 것
          </p>
        </div>

        <div className="bg-panel p-10">
          <Image
            src="/brand/lockup.trim.png"
            alt=""
            width={976}
            height={518}
            className="w-full max-w-[420px]"
          />
          <p className="u-label mt-4">
            panel 위 · 사각형이 드러난다 — 그래서 여기엔 쓰지 않는다
          </p>
        </div>
      </Section>

      <footer className="mt-20 border-t border-line pt-8 font-mono text-[11px] text-dim">
        {t("footer.rights", { year: 2026 })}
      </footer>
    </main>
  );
}
