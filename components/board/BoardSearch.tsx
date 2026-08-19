"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { BoardSlug } from "@/lib/board";

/**
 * 게시판 검색.
 *
 * form 으로 낸다. 타이핑할 때마다 서버를 때리지 않고, 엔터 한 번에 간다.
 * 검색하면 언제나 1쪽부터다 — 3쪽을 보다가 검색했는데 3쪽으로 가면
 * 결과가 두 쪽뿐일 때 빈 화면이 나온다.
 */
export function BoardSearch({
  board,
  initial,
}: {
  board: BoardSlug;
  initial: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [value, setValue] = useState(initial);

  function go(term: string) {
    const q = term.trim();
    router.push(q ? `/board/${board}?q=${encodeURIComponent(q)}` : `/board/${board}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go(value);
      }}
      className="flex items-center gap-2"
      role="search"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("board.search")}
        aria-label={t("board.search")}
        className="w-[150px] border border-edge bg-panel px-3 py-[7px] font-mono text-[12px] text-ink placeholder:text-dim focus:border-amber focus:outline-none sm:w-[200px]"
      />
      {initial && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            go("");
          }}
          className="font-mono text-[12px] text-dim transition-colors hover:text-ink"
        >
          {t("board.searchClear")}
        </button>
      )}
    </form>
  );
}
