"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * 로그인 폼.
 *
 * 비밀번호 칸이 없는 게 의도다. 매직 링크와 Google만 받는다.
 * 비밀번호를 받지 않으면 유출될 비밀번호도 없고, 재설정 흐름도 만들 필요가 없다.
 *
 * Google 버튼은 NEXT_PUBLIC_GOOGLE_AUTH=on 일 때만 보인다.
 * Supabase에 OAuth 클라이언트를 등록하기 전에 눌리면 무슨 소린지 모를
 * 오류만 나오기 때문이다.
 */
export function LoginForm() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  // 콜백이 실패해서 되돌아온 경우
  const callbackError = params.get("error");
  const next = params.get("next") ?? `/${locale}`;
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "on";

  function callbackUrl() {
    const url = new URL("/auth/callback", window.location.origin);
    url.searchParams.set("next", next);
    url.searchParams.set("locale", locale);
    return url.toString();
  }

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: callbackUrl() },
    });

    setState(error ? "error" : "sent");
  }

  async function withGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
  }

  if (state === "sent") {
    return (
      <div className="border border-amber px-5 py-6">
        <p className="text-[14.5px] text-ink">{t("auth.linkSent")}</p>
        <p className="mt-3 font-mono text-data text-dim">{email}</p>
      </div>
    );
  }

  return (
    <>
      {callbackError && (
        <p className="mb-6 border border-games px-4 py-3 text-[13px] text-ink">
          {t("auth.linkExpired")}
        </p>
      )}

      {googleEnabled && (
        <>
          <button
            type="button"
            onClick={withGoogle}
            className="w-full border border-edge py-[13px] font-mono text-[12px] tracking-btn text-ink transition-colors hover:border-ink"
          >
            {t("auth.withGoogle")}
          </button>

          <div className="my-7 flex items-center gap-4">
            <span className="flex-1 border-t border-line" />
            <span className="u-label">{t("auth.or")}</span>
            <span className="flex-1 border-t border-line" />
          </div>
        </>
      )}

      <form onSubmit={sendLink} className="space-y-[10px]">
        <label className="block">
          <span className="u-label">{t("auth.emailPlaceholder")}</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full border border-edge bg-panel px-4 py-[12px] font-mono text-[13px] text-ink placeholder:text-dim focus:border-amber focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={state === "sending"}
          className="w-full border border-amber bg-amber py-[13px] font-mono text-[12px] font-semibold tracking-btn text-on-amber transition-colors hover:bg-amber-hi disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === "sending" ? t("auth.sending") : t("auth.sendLink")}
        </button>
      </form>

      {state === "error" && (
        <p className="mt-4 text-[13px] text-games">{t("auth.failed")}</p>
      )}
    </>
  );
}
