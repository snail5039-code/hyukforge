import { setRequestLocale } from "next-intl/server";
import { DownloadsPage } from "@/components/pages/DownloadsPage";
import { listProducts } from "@/lib/queries/products";
import { orEmpty } from "@/lib/queries/safe";

export const revalidate = 300;

export default async function Downloads({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await listProducts(locale).catch(orEmpty([], "products"));
  return <DownloadsPage products={products} />;
}
