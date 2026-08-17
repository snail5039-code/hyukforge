import { setRequestLocale } from "next-intl/server";
import { ProductsPage } from "@/components/product/ProductsPage";
import { listProducts, type CategorySlug } from "@/lib/queries/products";
import { orEmpty } from "@/lib/queries/safe";

export const revalidate = 300;

export default async function Products({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category } = await searchParams;

  // 분류 필터는 클라이언트에서 걸러도 되는 양이라 전체를 한 번에 가져온다
  const products = await listProducts(locale).catch(orEmpty([], "products"));

  return (
    <ProductsPage
      products={products}
      active={category as CategorySlug | undefined}
    />
  );
}
