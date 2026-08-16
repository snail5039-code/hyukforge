import { setRequestLocale } from "next-intl/server";
import { ProductDetail } from "@/components/product/ProductDetail";
import { CHANGELOG, FEATURED } from "@/lib/fixtures";

export default async function PreviewProduct({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);
  const history = CHANGELOG.filter((c) => c.productSlug === FEATURED.slug);
  return <ProductDetail product={FEATURED} history={history} />;
}
