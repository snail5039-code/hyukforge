import { setRequestLocale } from "next-intl/server";
import { HomeSections } from "@/components/home/HomeSections";
import { listProducts, getStats } from "@/lib/queries/products";
import { listChangelog } from "@/lib/queries/changelog";
import { EMPTY_STATS, orEmpty } from "@/lib/queries/safe";

// 제품 정보는 자주 바뀌지 않는다. 관리자가 저장하면 revalidatePath로 무효화한다.
export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // DB가 잠들어 있거나 마이그레이션이 덜 올라갔어도 화면은 뜬다.
  // 실패는 서버 로그에 남는다.
  const [products, stats, changelog] = await Promise.all([
    listProducts(locale, { limit: 8 }).catch(orEmpty([], "products")),
    getStats().catch(orEmpty(EMPTY_STATS, "stats")),
    listChangelog(locale, 5).catch(orEmpty([], "changelog")),
  ]);

  return (
    <HomeSections products={products} stats={stats} changelog={changelog} />
  );
}
