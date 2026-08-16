import { getTranslations } from "next-intl/server";
import { Section, SectionLink } from "@/components/ui";
import { Featured } from "@/components/product/Featured";
import { ProductTable } from "@/components/product/ProductTable";
import { ChangelogList } from "./ChangelogList";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import type { Product, Stats as StatsData } from "@/lib/queries/products";
import type { ChangelogEntry } from "@/lib/queries/changelog";

/**
 * 홈 화면 본문.
 *
 * 데이터를 인자로 받는다. 그래야 실제 DB(app/[locale]/page.tsx)와
 * 디자인 확인용 예시(app/[locale]/preview)가 같은 화면을 공유한다.
 */
export async function HomeSections({
  products,
  stats,
  changelog,
}: {
  products: Product[];
  stats: StatsData;
  changelog: ChangelogEntry[];
}) {
  const t = await getTranslations();

  // 대표 제품 하나를 크게 띄우고 나머지는 표로. 지정된 게 없으면 첫 번째를 쓴다.
  const featured = products.find((p) => p.isFeatured) ?? products[0] ?? null;
  const rest = featured ? products.filter((p) => p.id !== featured.id) : products;

  return (
    <main className="mx-auto max-w-page px-gutter">
      <Hero />
      <Stats data={stats} />

      <Section
        title={t("section.products")}
        action={
          <SectionLink href="/products">
            {t("common.viewAll")} {products.length > 0 && `(${products.length})`}
          </SectionLink>
        }
      >
        {featured && <Featured product={featured} />}
        <ProductTable products={rest} />
      </Section>

      <Section
        title={t("section.changelog")}
        action={
          <SectionLink href="/changelog">{t("common.viewAll")}</SectionLink>
        }
      >
        <ChangelogList entries={changelog} />
      </Section>
    </main>
  );
}
