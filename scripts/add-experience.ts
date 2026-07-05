// Adds a new entry to src/data/experience.json and fetches the company's
// favicon from Google's favicon service into public/logos/.
//
// Usage:
//   bun run add-experience -- --title "Staff Engineer" --company "Acme Inc" --tenure "Jan 2027 — Present"
//   bun run add-experience -- --title "..." --company "..." --tenure "..." --domain "acme.io"
//
// --domain is optional. Without it, the domain is guessed from --company:
// a company name that already looks like a domain (contains a dot) is used
// as-is; otherwise ".com" is appended. Pass --domain explicitly when the
// guess would be wrong (e.g. a company whose real domain isn't ".com").

const EXPERIENCE_PATH = new URL("../src/data/experience.json", import.meta.url);
const LOGOS_DIR = new URL("../public/logos/", import.meta.url);

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for --${key}`);
      }
      args[key] = value;
      i++;
    }
  }
  return args;
}

function guessDomain(company: string): string {
  const slug = company.toLowerCase().replace(/\s+/g, "");
  return slug.includes(".") ? slug : `${slug}.com`;
}

function domainToSlug(domain: string): string {
  return domain.split(".")[0].replace(/[^a-z0-9-]/gi, "");
}

async function fetchFavicon(domain: string, slug: string): Promise<string> {
  const url = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);

  const buffer = await res.arrayBuffer();
  const logoPath = new URL(`${slug}.png`, LOGOS_DIR);
  await Bun.write(logoPath, buffer);

  return `/logos/${slug}.png`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { title, company, tenure } = args;

  if (!title || !company || !tenure) {
    console.error("Usage: bun run add-experience -- --title <title> --company <company> --tenure <tenure> [--domain <domain>]");
    process.exit(1);
  }

  const domain = args.domain ?? guessDomain(company);
  const slug = domainToSlug(domain);

  console.log(`Fetching favicon for ${company} (${domain})...`);
  const logo = await fetchFavicon(domain, slug);
  console.log(`  saved to public${logo}`);

  const file = Bun.file(EXPERIENCE_PATH);
  const experience = await file.json();

  experience.unshift({ position: title, company, tenure, logo });

  await Bun.write(EXPERIENCE_PATH, JSON.stringify(experience, null, 2) + "\n");
  console.log(`\nAdded "${title}, ${company}" to the top of experience.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
