import { setRequestLocale } from "next-intl/server";
import { HomeSections } from "@/components/home/HomeSections";
import { listProducts, getStats } from "@/lib/queries/products";
import { listChangelog } from "@/lib/queries/changelog";

// 제품 정보는 자주 바뀌지 않는다. 관리자가 저장하면 revalidatePath로 무효화한다.
export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [products, stats, changelog] = await Promise.all([
    listProducts(locale, { limit: 8 }),
    getStats(),
    listChangelog(locale, 5),
  ]);

  return (
    <HomeSections products={products} stats={stats} changelog={changelog} />
  );
}
