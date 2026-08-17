import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Label } from "@/components/ui";

/**
 * 개인정보처리방침 · 이용약관.
 *
 * 아직 초안이 아니라 '없는 상태'다. 법적 효력이 있는 문서라
 * 그럴듯한 문장으로 채워두는 건 오히려 위험하다.
 * 대신 지금 확실히 말할 수 있는 것만 적고, 준비 중임을 밝힌다.
 *
 * 서비스를 공개하기 전에 반드시 채워야 한다. 특히 회원을 받는 순간부터는
 * 개인정보처리방침이 법적으로 요구된다.
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

  return (
    <main className="mx-auto max-w-page px-gutter pb-10">
      <header className="border-b border-line pb-7 pt-[68px]">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">{title}</h1>
      </header>

      <div className="max-w-[62ch] pt-9">
        <div className="border border-edge px-5 py-4">
          <Label>준비 중</Label>
          <p className="mt-2 text-[14px] text-mute">
            아직 작성하지 않았습니다. 회원 가입을 받기 전에 올립니다.
          </p>
        </div>

        <section className="pt-9">
          <h2 className="text-[15px] font-semibold">
            그동안 확실한 것만 적어둡니다
          </h2>
          <ul className="mt-4 space-y-3 text-[14.5px] text-mute">
            <li className="border-l border-edge pl-3">
              계정은 <strong className="text-ink">다운로드 기록과 업데이트 알림</strong>에만
              씁니다.
            </li>
            <li className="border-l border-edge pl-3">
              <strong className="text-ink">비밀번호를 받지 않습니다.</strong> Google 로그인과
              이메일 링크만 씁니다.
            </li>
            <li className="border-l border-edge pl-3">
              광고 메일을 보내지 않고, 제3자에게 정보를 넘기지 않습니다.
            </li>
            <li className="border-l border-edge pl-3">
              지금 올라온 제품은 전부 무료입니다. 결제 정보를 받지 않습니다.
            </li>
          </ul>

          <p className="mt-8 text-[13px] text-dim">
            문의 ·{" "}
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
