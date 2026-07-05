import { OSS_PROJECT_CONFIG } from "../src/data/oss-projects.config";

const STATS_PATH = new URL("../src/data/oss-stats.generated.json", import.meta.url);
const MAX_WINDOW_DAYS = 364; // npm's downloads/range endpoint caps a single query at ~18 months

const formatNumber = (n: number) => n.toLocaleString("en-US");

async function fetchJSON(url: string): Promise<any> {
  const res = await fetch(url, { headers: { "User-Agent": "oss-stats-script" } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function weeklyDownloads(pkg: string): Promise<number> {
  const data = await fetchJSON(`https://api.npmjs.org/downloads/point/last-week/${pkg}`);
  return data.downloads ?? 0;
}

async function totalDownloads(pkg: string): Promise<number> {
  const registry = await fetchJSON(`https://registry.npmjs.org/${pkg}`);
  const created = new Date(registry.time.created);
  const now = new Date();

  let total = 0;
  let windowStart = created;

  while (windowStart < now) {
    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowEnd.getDate() + MAX_WINDOW_DAYS);
    const end = windowEnd > now ? now : windowEnd;

    const start = windowStart.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);
    const data = await fetchJSON(`https://api.npmjs.org/downloads/range/${start}:${endStr}/${pkg}`);
    for (const day of data.downloads ?? []) total += day.downloads;

    windowStart = new Date(end);
    windowStart.setDate(windowStart.getDate() + 1);
  }

  return total;
}

async function githubStars(repo: string): Promise<number> {
  const headers: Record<string, string> = { "User-Agent": "oss-stats-script" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (!res.ok) throw new Error(`https://api.github.com/repos/${repo} -> HTTP ${res.status}`);
  const data = await res.json();
  return data.stargazers_count ?? 0;
}

async function main() {
  const stats: Record<
    string,
    { weekly_downloads: string; downloads_till_date: string; github_stars: string; updated_at: string }
  > = {};

  for (const project of OSS_PROJECT_CONFIG) {
    console.log(`Updating stats for ${project.npm_package}...`);

    const [weekly, total, stars] = await Promise.all([
      weeklyDownloads(project.npm_package),
      totalDownloads(project.npm_package),
      githubStars(project.github_repo),
    ]);

    stats[project.npm_package] = {
      weekly_downloads: formatNumber(weekly),
      downloads_till_date: formatNumber(total),
      github_stars: formatNumber(stars),
      updated_at: new Date().toISOString(),
    };

    console.log(`  weekly downloads:    ${stats[project.npm_package].weekly_downloads}`);
    console.log(`  downloads till date: ${stats[project.npm_package].downloads_till_date}`);
    console.log(`  github stars:        ${stats[project.npm_package].github_stars}`);
  }

  await Bun.write(STATS_PATH, JSON.stringify(stats, null, 2) + "\n");
  console.log(`\nWrote stats to ${STATS_PATH.pathname}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
