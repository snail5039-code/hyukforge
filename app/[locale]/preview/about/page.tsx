import { setRequestLocale } from "next-intl/server";
import { AboutPage } from "@/components/pages/AboutPage";
import { WIP } from "@/lib/fixtures";

export default async function PreviewAbout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);
  return <AboutPage wip={WIP} />;
}
