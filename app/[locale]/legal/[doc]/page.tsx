import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Label } from "@/components/ui";

/**
 * 개인정보처리방침 · 이용약관.
 *
 * 아직 '초안'이 아니라 '없는 상태'다. 법적 효력이 있는 문서라
 * 그럴듯한 문장으로 채워두는 건 오히려 위험하다.
 * 대신 지금 확실히 말할 수 있는 것만 적고, 준비 중임을 밝힌다.
 *
 * 회원 가입을 받기 시작하는 순간부터 개인정보처리방침은 법적으로 요구된다.
 * 공개 전에 반드시 채워야 한다.
 */

const DOCS = ["privacy", "terms"] as const;
type Doc = (typeof DOCS)[number];

export function generateStaticParams() {
  return DOCS.map((doc) => ({ doc }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  if (!DOCS.includes(doc as Doc)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations();

  const title = doc === "privacy" ? t("footer.privacy") : t("footer.terms");
  const points = [
    t("legal.point1"),
    t("legal.point2"),
    t("legal.point3"),
    t("legal.point4"),
  ];

  return (
    <main className="mx-auto max-w-page px-gutter pb-10">
      <header className="border-b border-line pb-7 pt-[68px]">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">{title}</h1>
      </header>

      <div className="max-w-[62ch] pt-9">
        <div className="border border-edge px-5 py-4">
          <Label>{t("legal.pending")}</Label>
          <p className="mt-2 text-[14px] text-mute">{t("legal.pendingBody")}</p>
        </div>

        <section className="pt-9">
          <h2 className="text-[15px] font-semibold">
            {t("legal.certainHeading")}
          </h2>
          <ul className="mt-4 space-y-3 text-[14.5px] text-mute">
            {points.map((p) => (
              <li key={p} className="border-l border-edge pl-3">
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[13px] text-dim">
            {t("footer.contact")} ·{" "}
            <a
              href="mailto:snail5039@gmail.com"
              className="font-mono text-amber hover:underline"
            >
              snail5039@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
