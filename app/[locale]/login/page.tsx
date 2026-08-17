import { setRequestLocale } from "next-intl/server";
import { LoginPage } from "@/components/pages/LoginPage";

export default async function Login({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);
  return <LoginPage />;
}
