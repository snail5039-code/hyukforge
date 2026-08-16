/**
 * 디자인 토큰 확인용 임시 페이지.
 * 실제 홈 화면으로 교체될 자리다. (기준: docs/mockup.html)
 * 지금 확인하려는 것 — Pretendard·JetBrains Mono가 실제로 로드되는가,
 * 토큰이 Tailwind 유틸리티로 나오는가.
 */

import Image from "next/image";

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

const categories = [
  ["office", "사무용"],
  ["games", "게임"],
  ["utils", "유틸리티"],
  ["webapp", "웹앱"],
  ["labs", "실험실"],
];

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

export default function TokenCheck() {
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
        <span className="u-label ml-auto">디자인 토큰 확인 · 임시</span>
      </div>

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

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(([key, label]) => (
            <span
              key={key}
              className="border px-2 py-[3px] font-mono text-tag tracking-tag"
              style={{
                color: `var(--color-${key})`,
                borderColor: `var(--color-${key})`,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </Section>

      <Section title="글자">
        <h1 className="text-[clamp(30px,4.2vw,50px)] font-bold leading-[1.18] tracking-[-0.03em]">
          필요해서 만들었고,
          <br />
          필요하면 <em className="not-italic text-amber">가져가세요</em>.
        </h1>
        <p className="mt-5 max-w-[34ch] text-mute">
          혼자 만들고 혼자 고칩니다. 사무용 도구, 작은 게임, 잡다한 유틸리티.
          이 문장이 각지지 않고 부드럽게 보이면 Pretendard가 정상 로드된 것이다.
        </p>

        <div className="mt-8 border-t border-line">
          {[
            ["버전", "v1.2.0"],
            ["용량", "24.5 MB"],
            ["환경", "Windows 10 / 11"],
            ["업데이트", "2026.08.16"],
          ].map(([k, v]) => (
            <dl
              key={k}
              className="grid grid-cols-[82px_1fr] border-b border-line py-2 font-mono text-data"
            >
              <dt className="text-dim">{k}</dt>
              <dd className="text-mute">{v}</dd>
            </dl>
          ))}
          <p className="u-label mt-3">
            위 숫자가 폭이 일정하게 정렬되면 JetBrains Mono가 정상 로드된 것이다
          </p>
        </div>
      </Section>

      <Section title="버튼">
        <div className="flex flex-wrap gap-[10px]">
          <button className="border border-amber bg-amber px-5 py-[11px] font-mono text-[12px] font-semibold tracking-btn text-on-amber transition-colors hover:bg-amber-hi hover:border-amber-hi">
            받기
          </button>
          <button className="border border-edge px-5 py-[11px] font-mono text-[12px] tracking-btn text-ink transition-colors hover:border-ink">
            변경 내역
          </button>
        </div>
      </Section>

      <Section title="로고">
        {/* 위: 바탕 위 — 이음매가 보이면 안 된다.
            아래: panel 위 — 검정 사각형이 드러나는 게 정상이다. 그래서 panel 위엔 쓰지 않는다. */}
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
    </main>
  );
}
