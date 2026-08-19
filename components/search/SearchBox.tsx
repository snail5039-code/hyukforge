"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

/**
 * 사이트 전체 검색 입력창.
 *
 * 게시판 검색(components/board/BoardSearch.tsx)과 같은 방식이다 —
 * form 으로 내고 엔터 한 번에 간다. 타이핑마다 서버를 때리면 결과가 깜빡이고,
 * 열 글자를 치는 동안 조회가 열 번 나간다.
 */
export function SearchBox({ initial }: { initial: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [value, setValue] = useState(initial);

  function go(term: string) {
    const q = term.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go(value);
      }}
      className="flex flex-wrap items-center gap-2"
      role="search"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("search.placeholder")}
        aria-label={t("search.title")}
        // 검색 화면의 주인공이라 게시판 검색창보다 넓게 둔다
        className="min-w-0 flex-1 border border-edge bg-panel px-4 py-[10px] text-[14px] text-ink placeholder:text-dim focus:border-amber focus:outline-none sm:max-w-[420px]"
        autoFocus
      />
      {/* 색과 굵기는 ui.tsx 의 Btn primary 와 같게 맞춘다 */}
      <button
        type="submit"
        className="border border-amber bg-amber px-5 py-[11px] font-mono text-[12px] font-semibold tracking-btn text-on-amber transition-colors hover:border-amber-hi hover:bg-amber-hi"
      >
        {t("search.title")}
      </button>
      {initial && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            go("");
          }}
          className="font-mono text-[12px] text-dim transition-colors hover:text-ink"
        >
          {t("search.clear")}
        </button>
      )}
    </form>
  );
}
