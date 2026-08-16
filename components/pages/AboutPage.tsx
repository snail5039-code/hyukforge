import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Label } from "@/components/ui";

/**
 * 소개.
 *
 * 어두운 방의 개발자 스톡 사진과 기술 스택 로고 그리드를 쓰지 않는다.
 * 둘 다 내용이 0이다. 대신 1인칭 문장과 "지금 만들고 있는 것"을 둔다.
 * (docs/DESIGN.md 1장)
 */
export async function AboutPage({
  wip,
}: {
  wip: { name: string; note: string }[];
}) {
  const t = await getTranslations();

  return (
    <main className="mx-auto max-w-page px-gutter pb-10">
      <header className="pb-10 pt-[68px]">
        {/* 로고는 --color-bg 위에서만 쓴다. panel 위에 올리면 사각형이 드러난다. */}
        <Image
          src="/brand/lockup.trim.png"
          alt="HyukForge — Independent Software Studio"
          width={976}
          height={518}
          className="w-full max-w-[360px]"
        />
      </header>

      <div className="grid gap-16 border-t border-line pt-12 lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)]">
        <div className="space-y-[14px] text-[15px] text-mute">
          <p>
            <strong className="font-semibold text-ink">
              혼자 하는 스튜디오입니다.
            </strong>{" "}
            기획도 개발도 배포도 한 사람이 합니다. 그래서 느리지만, 물어보면
            만든 사람이 직접 답합니다.
          </p>
          <p>
            대단한 걸 만들려던 게 아니라 제가 매일 불편했던 걸 하나씩 고치다
            보니 쌓였습니다. 파일 정리가 귀찮아서 정리 도구를 만들었고, 출퇴근
            기록을 손으로 적기 싫어서 웹앱을 만들었습니다.
          </p>
          <p>
            지금은 전부 무료로 공개합니다. 나중에 유료 제품이 생기더라도 지금
            올라온 것들은 계속 무료입니다.
          </p>
          <p className="pt-2 text-[13px] text-dim">
            버그 제보·기능 제안 ·{" "}
            <a
              href="mailto:snail5039@gmail.com"
              className="font-mono text-amber hover:underline"
            >
              snail5039@gmail.com
            </a>
          </p>
        </div>

        <aside className="border border-edge px-6 py-[22px]">
          <Label>{t("home.wip")}</Label>
          <div className="mt-[14px]">
            {wip.map((w) => (
              <div
                key={w.name}
                className="flex justify-between gap-4 border-b border-line py-[10px] text-[13.5px] last:border-b-0"
              >
                <span className="text-ink">{w.name}</span>
                <span className="font-mono text-[11px] text-dim">{w.note}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
