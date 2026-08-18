import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ReleaseManager } from "@/components/admin/ReleaseManager";
import { getProductDraft, listCategories, listReleases } from "@/lib/queries/admin";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const [draft, categories, releases] = await Promise.all([
    getProductDraft(id),
    listCategories(),
    listReleases(id),
  ]);

  if (!draft) notFound();

  return (
    <>
      <ProductForm initial={draft} categories={categories} locale={locale} />
      {/* 웹앱은 받을 파일이 없다 — 주소를 여는 것이라 릴리스가 필요 없다 */}
      {draft.kind !== "webapp" && (
        <ReleaseManager
          productId={id}
          githubRepo={draft.githubRepo}
          releases={releases}
        />
      )}
    </>
  );
}
