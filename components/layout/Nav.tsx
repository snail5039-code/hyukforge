import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { AuthButton } from "./AuthButton";
import { MobileMenu } from "./MobileMenu";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";

export async function Nav() {
  const t = await getTranslations();

  const items = [
    { href: "/products", label: t("nav.products") },
    { href: "/downloads", label: t("nav.downloads") },
    { href: "/notices", label: t("nav.notices") },
    { href: "/board/free", label: t("nav.board") },
    { href: "/changelog", label: t("nav.changelog") },
    { href: "/about", label: t("nav.about") },
    { href: "/search", label: t("nav.search") },
  ];

  return (
    <nav className="sticky top-0 z-30 border-b border-line bg-bg">
      <div className="relative mx-auto flex h-[58px] max-w-page items-center gap-5 px-gutter sm:gap-7">
        {/* 마크는 28px 미만으로 줄이지 않는다 — 사선 디테일이 뭉개진다.
            로고 PNG는 다크 배경 기준 잉크색이라 라이트 테마에서는 안 보인다.
            scripts/brand.mjs가 뽑은 라이트 변형(*.light.png)으로 통째로 바꿔 낀다
            (.brand-set, app/globals.css). */}
        <Link href="/" className="mr-auto flex items-center">
          <span className="brand-set" data-brand-img="dark">
            <Image
              src="/brand/mark.png"
              alt="HyukForge"
              width={458}
              height={331}
              priority
              className="h-7 w-auto"
            />
            <Image
              src="/brand/wordmark.png"
              alt=""
              width={950}
              height={88}
              priority
              className="hidden h-[12px] w-auto sm:block"
            />
          </span>
          <span className="brand-set" data-brand-img="light">
            <Image
              src="/brand/mark.light.png"
              alt="HyukForge"
              width={458}
              height={331}
              priority
              className="h-7 w-auto"
            />
            <Image
              src="/brand/wordmark.light.png"
              alt=""
              width={950}
              height={88}
              priority
              className="hidden h-[12px] w-auto sm:block"
            />
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {items.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                className="text-[13.5px] text-mute transition-colors hover:text-ink"
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>

        <NotificationBell />

        <MobileMenu items={items} />

        <ThemeToggle label={t("nav.toggleTheme")} />

        <LocaleSwitcher />

        <AuthButton />
      </div>
    </nav>
  );
}
