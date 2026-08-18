import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductDraft, listCategories } from "@/lib/queries/admin";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const [draft, categories] = await Promise.all([
    getProductDraft(id),
    listCategories(),
  ]);

  if (!draft) notFound();

  return <ProductForm initial={draft} categories={categories} locale={locale} />;
}
