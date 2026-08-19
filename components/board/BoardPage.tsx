import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Btn, Label } from "@/components/ui";
import { shortDate } from "@/lib/format";
import { BOARDS, STATE_KEY, type BoardSlug, type Post } from "@/lib/board";

/**
 * 게시판 목록.
 *
 * 카드 그리드를 쓰지 않는다 — 균등한 카드 반복은 위계를 없앤다.
 * 제품 목록과 같은 표를 쓰고, 오른쪽에 댓글·공감 수를 모노스페이스로 붙인다.
 * (docs/DESIGN.md 1장)
 */
export async function BoardPage({
  board,
  posts,
}: {
  board: BoardSlug;
  posts: Post[];
}) {
  const t = await getTranslations();
  const isRequest = board === "request";

  return (
    <main className="mx-auto max-w-page px-gutter pb-10">
      <header className="border-b border-line pb-7 pt-[68px]">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">
          {t(`board.${board}`)}
        </h1>
        <p className="mt-3 max-w-[62ch] text-[14px] text-mute">
          {t(isRequest ? "board.requestLead" : "board.freeLead")}
        </p>
      </header>

      {/* 게시판 전환 + 글쓰기 */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line py-4">
        <ul className="flex items-center gap-5">
          {BOARDS.map((b) => (
            <li key={b}>
              <Link
                href={`/board/${b}`}
                className={
                  b === board
                    ? "font-mono text-[12px] tracking-tag text-amber"
                    : "font-mono text-[12px] tracking-tag text-dim transition-colors hover:text-ink"
                }
              >
                {t(`board.${b}`)}
              </Link>
            </li>
          ))}
        </ul>

        <span className="ml-auto">
          <Btn href={`/board/${board}/new`}>{t("board.write")}</Btn>
        </span>
      </div>

      {posts.length === 0 ? (
        <p className="border-b border-line py-16 text-center text-[13.5px] text-dim">
          {t("board.empty")}
        </p>
      ) : (
        <ul>
          {posts.map((p) => (
            <li key={p.id} className="group border-b border-line">
              <Link
                href={`/board/${board}/${p.id}`}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-2 py-[15px] transition-colors group-hover:bg-panel"
              >
                {p.isPinned && (
                  <span className="font-mono text-tag tracking-tag text-amber">
                    {t("board.pinned")}
                  </span>
                )}

                {isRequest && p.requestState && (
                  <span className="border border-edge px-2 py-[2px] font-mono text-tag tracking-tag text-mute">
                    {t(`board.state.${STATE_KEY[p.requestState]}`)}
                  </span>
                )}

                <span className="text-[14.5px] text-ink">{p.title}</span>

                {p.commentCount > 0 && (
                  <span className="font-mono text-[12px] text-amber">
                    {p.commentCount}
                  </span>
                )}

                {p.status === "hidden" && (
                  <span className="font-mono text-tag tracking-tag text-dim">
                    비공개
                  </span>
                )}

                <span className="ml-auto flex items-baseline gap-4 font-mono text-[12px] text-dim">
                  {isRequest && (
                    <span>
                      {t("board.votes")} {p.voteCount}
                    </span>
                  )}
                  <span className={p.isMine ? "text-mute" : undefined}>
                    {p.isMine ? t("board.mine") : p.author}
                  </span>
                  <time dateTime={p.createdAt}>{shortDate(p.createdAt)}</time>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="pt-6">
        <Label>
          {posts.length} · {t(`board.${board}`)}
        </Label>
      </p>
    </main>
  );
}
