// Generates PNG favicons and home-screen icons (apple-touch-icon, Android
// icons) from an "AU" initials mark, plus a web manifest, so the site shows
// the initials logo when added to a phone's home screen.
//
// Usage:
//   bun run generate-favicons

import sharp from "sharp";

const PUBLIC_DIR = new URL("../public/", import.meta.url);

const BG = "#ffffff";
const FG = "#0b0b0b";
const INITIALS = "AU";
const FONT_FAMILY = "Georgia, 'Times New Roman', serif";

function iconSvg(size: number, cornerRatio: number): string {
  const rx = size * cornerRatio;
  const fontSize = size * 0.47;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${BG}"/>
  <text x="${size / 2}" y="${size / 2 + fontSize * 0.34}" text-anchor="middle" font-family="${FONT_FAMILY}" font-size="${fontSize}" fill="${FG}">${INITIALS}</text>
</svg>`;
}

// Apple applies its own corner mask on the home screen, so its icon ships
// as a full-bleed square (no rounding baked in).
const TARGETS = [
  { name: "favicon-16x16.png", size: 16, cornerRatio: 0.25 },
  { name: "favicon-32x32.png", size: 32, cornerRatio: 0.25 },
  { name: "apple-touch-icon.png", size: 180, cornerRatio: 0 },
  { name: "icon-192.png", size: 192, cornerRatio: 0.25 },
  { name: "icon-512.png", size: 512, cornerRatio: 0.25 },
] as const;

async function main() {
  for (const { name, size, cornerRatio } of TARGETS) {
    const svg = iconSvg(size, cornerRatio);
    const outPath = new URL(name, PUBLIC_DIR);
    await sharp(Buffer.from(svg)).png().toFile(outPath.pathname);
    console.log(`Wrote ${outPath.pathname}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
