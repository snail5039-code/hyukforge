"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isNicknameShape } from "@/lib/board";
import { locales } from "@/i18n/routing";

/**
 * 닉네임 저장.
 *
 * 게시판에 이 이름으로 보인다. 비우면 지워지고 `#a3f19c` 형태로 돌아간다.
 * display_name(구글 실명)은 건드리지 않는다 — 그건 본인 확인용이고 공개되지 않는다.
 *
 * 오류는 코드로 돌려준다. 서버 액션은 요청 언어를 모른다.
 * (app/[locale]/board/actions.ts 와 같은 규칙)
 */
export type NicknameResult =
  | { ok: true; nickname: string | null }
  | { ok: false; code: "loginRequired" | "invalid" | "taken" | "failed" };

export async function setNickname(raw: string): Promise<NicknameResult> {
  const value = raw.trim();
  const next = value === "" ? null : value;

  if (next !== null && !isNicknameShape(next)) {
    return { ok: false, code: "invalid" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, code: "loginRequired" };

  const { data, error } = await supabase
    .from("profiles")
    .update({ nickname: next })
    .eq("id", user.id)
    .select("nickname")
    .maybeSingle();

  if (error) {
    // profiles_nickname_unique — 이미 쓰는 사람이 있다
    if (error.code === "23505" || error.message.includes("profiles_nickname_unique")) {
      return { ok: false, code: "taken" };
    }
    if (error.message.includes("profiles_nickname_shape")) {
      return { ok: false, code: "invalid" };
    }
    return { ok: false, code: "failed" };
  }

  // 쓰고 나서 읽어본다 — PostgREST 는 트리거가 값을 되돌려도 200 을 준다.
  // (docs/HANDOFF.md "쓰기는 쓰고 나서 읽어본다")
  const saved = (data as { nickname: string | null } | null)?.nickname ?? null;
  if (saved !== next) return { ok: false, code: "failed" };

  for (const l of locales) {
    revalidatePath(`/${l}/me`);
    revalidatePath(`/${l}/board/free`);
    revalidatePath(`/${l}/board/request`);
  }
  return { ok: true, nickname: saved };
}
