import { getTranslations } from "next-intl/server";
import { Label } from "@/components/ui";
import { monthDay } from "@/lib/format";
import type { Stats as StatsData } from "@/lib/queries/products";

/**
 * 홈 상단 통계 4칸.
 * 진짜 값만 쓴다 — 0이면 0을 보여준다. (docs/DESIGN.md "글쓰기 규칙")
 */
export async function Stats({ data }: { data: StatsData }) {
  const t = await getTranslations();

  const cells = [
    { label: t("stats.products"), value: String(data.productCount) },
    {
      label: t("stats.downloads"),
      value: data.monthlyDownloads.toLocaleString(),
    },
    { label: t("stats.updated"), value: monthDay(data.lastUpdated) },
    // 무료라는 사실은 히어로 설명과 고정 공지에 이미 있다. 이 칸은 값이 변하는 것을 쓴다.
    { label: t("stats.visitors"), value: data.totalVisitors.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 border-y border-line sm:grid-cols-4">
      {cells.map((c, i) => (
        <div
          key={c.label}
          className={`py-5 sm:border-l sm:border-line sm:pl-6 ${
            i === 0 ? "sm:border-l-0 sm:pl-0" : ""
          } ${i >= 2 ? "border-t border-line sm:border-t-0" : ""}`}
        >
          <Label>{c.label}</Label>
          <b className="mt-[6px] block font-mono text-[23px] font-medium tracking-[-0.01em] text-ink">
            {c.value}
          </b>
        </div>
      ))}
    </div>
  );
}
