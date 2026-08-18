import { setRequestLocale } from "next-intl/server";
import { ProductsPage } from "@/components/product/ProductsPage";
import { PRODUCTS } from "@/lib/fixtures";
import type { CategorySlug } from "@/lib/queries/products";

export default async function PreviewProducts({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category } = await searchParams;
  return (
    <ProductsPage
      products={PRODUCTS}
      active={category as CategorySlug | undefined}
      basePath="/preview/products"
      locale={locale}
    />
  );
}
