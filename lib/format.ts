/** 파일 크기. 표에 들어가므로 자릿수를 일정하게 유지한다. */
export function fileSize(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const mb = bytes / 1_048_576;
  if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

/** 2026.08.16 — 모노스페이스로 찍히므로 구분자를 점으로 통일한다. */
export function shortDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

/** 08.16 — 통계 칸처럼 좁은 자리에서 쓴다. */
export function monthDay(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

export function platformLabel(platforms: string[]): string {
  if (!platforms.length) return "—";
  const names: Record<string, string> = {
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    android: "Android",
    ios: "iOS",
  };
  return platforms.map((p) => names[p] ?? p).join(" · ");
}

/** 분류색은 태그 테두리·글자에만 쓴다. 배경으로 칠하지 않는다. (docs/DESIGN.md) */
export const categoryVar: Record<string, string> = {
  office: "--color-office",
  games: "--color-games",
  utilities: "--color-utils",
  webapps: "--color-webapp",
  labs: "--color-labs",
};
