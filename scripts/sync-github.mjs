import { createClient } from "@supabase/supabase-js";

const supabaseUrl = required("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY");
const githubToken = process.env.GITHUB_TOKEN?.trim();
const bootstrap = process.argv.includes("--bootstrap");

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const { data: products, error: productError } = await supabase
  .from("products")
  .select("id, slug, github_repo")
  .eq("status", "published")
  .not("github_repo", "is", null);

if (productError) fail(productError.message);

let totalEntries = 0;
// 화면에 영어로 나가는 기록. 커밋 제목을 그대로 쓰기 때문에 생긴다.
// 자동으로 옮길 방법이 없으니 모아서 맨 끝에 한 번에 알린다.
const untranslated = [];

for (const product of products) {
  const repository = normalizeRepo(product.github_repo);
  const repo = await github(`/repos/${repository}`);
  const head = await github(
    `/repos/${repository}/commits/${encodeURIComponent(repo.default_branch)}`,
  );
  const releases = await github(`/repos/${repository}/releases?per_page=20`);
  const latestRelease = releases.find((release) => !release.draft) ?? null;

  const { data: state, error: stateError } = await supabase
    .from("github_sync_state")
    .select("last_commit_sha, last_release_id")
    .eq("product_id", product.id)
    .maybeSingle();

  if (stateError) fail(`${product.slug}: ${stateError.message}`);

  // 첫 실행은 과거 기록을 다시 쏟아 넣지 않고 현재 HEAD만 기준점으로 잡는다.
  if (!state || bootstrap) {
    await saveState(product, repository, head.sha, latestRelease?.id ?? null);
    console.log(`${product.slug}: 기준점 ${head.sha.slice(0, 7)}`);
    continue;
  }

  let lastSha = state.last_commit_sha;

  if (lastSha !== head.sha) {
    const comparison = await github(
      `/repos/${repository}/compare/${lastSha}...${head.sha}?per_page=100`,
    );
    const commits = comparison.commits ?? [];

    if (comparison.status === "diverged" || commits.length === 0) {
      // force-push 또는 오래된 기준점은 과거를 재등록하지 않고 새 HEAD부터 이어 간다.
      console.log(`${product.slug}: 이력이 갈라져 HEAD를 새 기준점으로 사용`);
      lastSha = head.sha;
    } else {
      const groups = groupMeaningfulCommits(commits);

      for (const group of groups) {
        await addChangelog(product.id, group.date, group.body);
        totalEntries += 1;
        console.log(`${product.slug}: ${group.date} ${group.body}`);

        for (const item of group.items) {
          if (!HANGUL.test(item)) {
            untranslated.push(`${product.slug} ${group.date} — ${item}`);
          }
        }

        // 날짜 묶음 하나를 저장할 때마다 기준점을 전진시켜 중간 실패 시 중복을 줄인다.
        lastSha = group.lastSha;
        await saveState(
          product,
          repository,
          lastSha,
          state.last_release_id,
        );
      }

      // 기록 대상이 아닌 문서·정리 커밋만 있어도 다음 실행에서 다시 읽지 않는다.
      lastSha = head.sha;
    }
  }

  let lastReleaseId = state.last_release_id;
  if (latestRelease && latestRelease.id !== state.last_release_id) {
    const date = kstDate(latestRelease.published_at ?? latestRelease.created_at);
    const label = latestRelease.name?.trim() || latestRelease.tag_name;
    await addChangelog(product.id, date, `${label} 릴리스를 공개했습니다.`);
    totalEntries += 1;
    lastReleaseId = latestRelease.id;
    console.log(`${product.slug}: 릴리스 ${label}`);
  }

  await saveState(product, repository, lastSha, lastReleaseId);
}

console.log(`동기화 완료: 새 개발 기록 ${totalEntries}건`);

/**
 * 개발 기록은 커밋 제목을 그대로 쓴다. 저장소 커밋이 영어면 화면에도 영어로 나간다.
 * 사이트 글은 한국어로 쓰기로 했는데(CLAUDE.md) 여기만 새는 길이라, 지우거나
 * 멋대로 옮기지 않고 눈에 띄게 알린다 — 빼면 그 변경이 통째로 사라지고,
 * 기계로 옮기면 무슨 일을 했는지가 뭉개진다.
 *
 * 실제로 2026-09-14 살려줌 기록 18개 중 9개가 영어로 나갔고 손으로 옮겼다.
 * 가장 싼 예방은 저장소 쪽 커밋 제목을 한국어로 쓰는 것이다.
 */
if (untranslated.length) {
  console.log(`
한국어로 옮겨야 할 기록 ${untranslated.length}건 — 지금 화면에 영어로 나갑니다:`);
  for (const line of untranslated) console.log(`  · ${line}`);
  console.log("  관리자 화면의 개발 기록에서 고칩니다.");
}

function groupMeaningfulCommits(commits) {
  const groups = new Map();

  for (const commit of commits) {
    const subject = commit.commit.message.split("\n", 1)[0].trim();
    if (!isMeaningful(subject) || commit.parents?.length > 1) continue;

    const date = kstDate(
      commit.commit.author?.date ?? commit.commit.committer?.date,
    );
    const clean = subject
      .replace(/^(feat|fix|perf|refactor|release)(\([^)]*\))?!?:\s*/i, "")
      .replace(/[.。]+$/, "");

    const current = groups.get(date) ?? { date, items: [], lastSha: commit.sha };
    if (!current.items.includes(clean)) current.items.push(clean);
    current.lastSha = commit.sha;
    groups.set(date, current);
  }

  return [...groups.values()].map((group) => ({
    date: group.date,
    lastSha: group.lastSha,
    items: group.items,
    body: `${group.items.join(" · ")}.`,
  }));
}

/** 한글이 한 글자라도 있으면 한국어로 쓴 것으로 본다. */
const HANGUL = /[가-힣]/;

function isMeaningful(subject) {
  if (/^(docs|chore|test|style|ci|build)(\([^)]*\))?:/i.test(subject)) return false;
  if (/^(readme|update|merge|wip|test|[a-z]|\d+)$/i.test(subject.trim())) return false;
  return /^(feat|fix|perf|refactor|release)(\([^)]*\))?!?:/i.test(subject)
    || /(기능|추가|수정|개선|개편|배포|완성|보안|오류|버그|안정)/.test(subject);
}

async function addChangelog(productId, entryDate, body) {
  const { data: entry, error: entryError } = await supabase
    .from("changelog_entries")
    .insert({ product_id: productId, entry_date: entryDate })
    .select("id")
    .single();
  if (entryError) fail(entryError.message);

  const { error: translationError } = await supabase
    .from("changelog_translations")
    .insert({ entry_id: entry.id, locale: "ko", body });
  if (translationError) {
    await supabase.from("changelog_entries").delete().eq("id", entry.id);
    fail(translationError.message);
  }
  return entry.id;
}

async function saveState(product, repository, commitSha, releaseId) {
  const { error } = await supabase.from("github_sync_state").upsert(
    {
      product_id: product.id,
      repository,
      last_commit_sha: commitSha,
      last_release_id: releaseId,
      synced_at: new Date().toISOString(),
    },
    { onConflict: "product_id" },
  );
  if (error) fail(`${product.slug}: ${error.message}`);
}

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "hyukforge-github-sync",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
    },
  });
  if (!response.ok) fail(`GitHub ${response.status}: ${await response.text()}`);
  return response.json();
}

function normalizeRepo(value) {
  return value
    .trim()
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/\.git$/, "")
    .replace(/^\/+|\/+$/g, "");
}

function kstDate(value) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) fail(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

