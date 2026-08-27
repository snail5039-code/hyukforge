import { getTranslations } from "next-intl/server";
import { ChangelogList } from "@/components/home/ChangelogList";
import { Pager } from "@/components/Pager";
import type { ChangelogEntry } from "@/lib/queries/changelog";

/**
 * 개발 기록 전체.
 *
 * 월별로 묶어서 낸다. 한 줄씩 이어 붙이면 얼마나 자주 손보는지가 안 보이는데,
 * 1인 스튜디오에서 그건 신뢰의 근거라 드러나야 한다.
 *
 * 달마다 한 화면씩 보여준다 — 쌓일수록 아래로 끝없이 늘어지는 대신
 * 화살표로 한 달씩 넘긴다. 기본은 최신 달이다
 * (listChangelog가 최신순으로 주므로 첫 항목이 곧 최신 달).
 */
export async function ChangelogPage({
  entries,
}: {
  entries: ChangelogEntry[];
}) {
  const t = await getTranslations();

  const months = new Map<string, ChangelogEntry[]>();
  for (const e of entries) {
    const key = e.date.slice(0, 7); // 2026-08
    if (!months.has(key)) months.set(key, []);
    months.get(key)!.push(e);
  }
  const sections = [...months];

  return (
    <main className="mx-auto max-w-page px-gutter pb-10">
      <header className="border-b border-line pb-7 pt-[68px]">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">
          {t("section.changelog")}
        </h1>
        <p className="mt-2 max-w-[52ch] text-[14px] text-mute">
          {t("changelog.lead")}
        </p>
      </header>

      {sections.length === 0 ? (
        <p className="border-b border-line py-16 text-center text-[13.5px] text-dim">
          {t("common.empty")}
        </p>
      ) : (
        <Pager
          index={sections.map(([month]) => month.replace("-", "."))}
          labels={{ prev: t("changelog.prevMonth"), next: t("changelog.nextMonth") }}
        >
          {sections.map(([month, list]) => (
            <section key={month} className="pt-12">
              <div className="mb-5 flex items-baseline gap-4">
                <h2 className="font-mono text-[13px] text-amber">
                  {month.replace("-", ".")}
                </h2>
                <span className="-translate-y-[3px] flex-1 border-t border-line" />
                <span className="u-label">{t("changelog.count", { count: list.length })}</span>
              </div>
              <ChangelogList entries={list} />
            </section>
          ))}
        </Pager>
      )}
    </main>
  );
}
