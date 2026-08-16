import { getTranslations } from "next-intl/server";

/**
 * 로그인 화면 — 지금은 모양만이다. 실제 인증은 아직 붙이지 않았다.
 *
 * 비밀번호 칸이 없는 게 의도다. Google과 매직 링크만 받는다.
 * 비밀번호를 안 받으면 유출될 비밀번호도 없다.
 */
export async function LoginPage() {
  const t = await getTranslations();

  return (
    <main className="mx-auto flex max-w-page justify-center px-gutter pb-24 pt-[92px]">
      <div className="w-full max-w-[380px]">
        <h1 className="text-[24px] font-bold tracking-[-0.02em]">
          {t("auth.signIn")}
        </h1>
        <p className="mt-3 text-[13.5px] text-mute">{t("home.privacyNote")}</p>

        <div className="mt-8 space-y-[10px]">
          <button
            type="button"
            disabled
            className="w-full border border-edge py-[13px] font-mono text-[12px] tracking-btn text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("auth.withGoogle")}
          </button>
        </div>

        <div className="my-7 flex items-center gap-4">
          <span className="flex-1 border-t border-line" />
          <span className="u-label">또는</span>
          <span className="flex-1 border-t border-line" />
        </div>

        <form className="space-y-[10px]">
          <label className="block">
            <span className="u-label">{t("auth.emailPlaceholder")}</span>
            <input
              type="email"
              disabled
              placeholder="you@example.com"
              className="mt-2 w-full border border-edge bg-panel px-4 py-[12px] font-mono text-[13px] text-ink placeholder:text-dim focus:border-amber focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            />
          </label>
          <button
            type="submit"
            disabled
            className="w-full border border-amber bg-amber py-[13px] font-mono text-[12px] font-semibold tracking-btn text-on-amber transition-colors hover:bg-amber-hi disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("auth.sendLink")}
          </button>
        </form>

        <p className="mt-6 border-l border-edge pl-3 text-[12.5px] text-dim">
          {t("auth.noPassword")}
        </p>

        <p className="mt-8 border border-edge px-4 py-3 font-mono text-label text-dim">
          화면만 만든 상태 · 인증은 아직 연결하지 않았다
        </p>
      </div>
    </main>
  );
}
