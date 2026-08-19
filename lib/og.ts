import { selfOrigin } from "@/lib/site";

/**
 * OG 이미지 공통.
 *
 * 폰트는 지금 돌고 있는 서버의 public 에서 받아온다 (selfOrigin). satori 는 woff2 를 못 읽어서
 * 동적 서브셋(92조각)을 쓸 수 없고, 통짜 OTF 두 벌을 scripts/fonts.mjs 가
 * 따로 복사해 둔다. node_modules 에서 직접 읽지 않는 이유는 배포 번들에
 * 들어간다는 보장이 없어서다.
 *
 * OG 이미지는 만들고 나면 캐시되므로 1.5MB 두 벌을 받는 비용은 처음 한 번뿐이다.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** docs/DESIGN.md 의 값 그대로. 화면과 카드가 달라 보이면 안 된다. */
export const OG_COLORS = {
  bg: "#060606",
  ink: "#EDEAE4",
  mute: "#A8A29A",
  dim: "#837E75",
  line: "#2A2723",
  amber: "#E29B2E",
};

export async function ogFonts() {
  const base = selfOrigin();
  const [regular, bold] = await Promise.all([
    fetch(`${base}/fonts/pretendard/og/Pretendard-Regular.otf`).then((r) => r.arrayBuffer()),
    fetch(`${base}/fonts/pretendard/og/Pretendard-Bold.otf`).then((r) => r.arrayBuffer()),
  ]);

  return [
    { name: "Pretendard", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Pretendard", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}
