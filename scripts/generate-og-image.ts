// Generates public/og-image.svg and public/og-image.png from the live site
// data: a white card with black text — title, subtitle (SITE_DESCRIPTION), a
// divider, and the domain, all center-aligned. The PNG is rasterized from the
// SVG since most link-preview crawlers (Twitter, Facebook, Slack, ...) don't
// render SVG og:image tags.
//
// Usage:
//   bun run generate-og-image

import sharp from "sharp";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "../src/data/site";

const SVG_OUTPUT_PATH = new URL("../public/og-image.svg", import.meta.url);
const PNG_OUTPUT_PATH = new URL("../public/og-image.png", import.meta.url);

const WIDTH = 1200;
const HEIGHT = 630;
const CENTER_X = WIDTH / 2;

const FONT_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_MONO = "Courier New, monospace";

function wrapText(text: string, fontSize: number, maxWidth: number): string[] {
  const avgCharWidth = fontSize * 0.52;
  const maxChars = Math.floor(maxWidth / avgCharWidth);

  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  return lines;
}

function buildSvg(): string {
  const titleFontSize = 60;
  const subtitleFontSize = 28;
  const subtitleLineHeight = 40;
  const domainFontSize = 22;

  const subtitleLines = wrapText(SITE_DESCRIPTION, subtitleFontSize, 880);
  const domain = SITE_URL.replace(/^https?:\/\//, "");

  const titleY = 250;
  const subtitleStartY = titleY + 70;
  const subtitleEndY = subtitleStartY + (subtitleLines.length - 1) * subtitleLineHeight;
  const dividerY = subtitleEndY + 60;
  const domainY = dividerY + 60;

  const subtitleTspans = subtitleLines
    .map((line, i) => `<tspan x="${CENTER_X}" dy="${i === 0 ? 0 : subtitleLineHeight}">${line}</tspan>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>
  <text x="${CENTER_X}" y="${titleY}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="${titleFontSize}" fill="#0b0b0b">${SITE_NAME}</text>
  <text x="${CENTER_X}" y="${subtitleStartY}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="${subtitleFontSize}" fill="#0b0b0b">${subtitleTspans}</text>
  <line x1="${CENTER_X - 60}" y1="${dividerY}" x2="${CENTER_X + 60}" y2="${dividerY}" stroke="#0b0b0b" stroke-width="1"/>
  <text x="${CENTER_X}" y="${domainY}" text-anchor="middle" font-family="${FONT_MONO}" font-size="${domainFontSize}" letter-spacing="2" fill="#0b0b0b">${domain}</text>
</svg>
`;
}

async function main() {
  const svg = buildSvg();
  await Bun.write(SVG_OUTPUT_PATH, svg);
  console.log(`Wrote ${SVG_OUTPUT_PATH.pathname}`);

  await sharp(Buffer.from(svg)).png().toFile(PNG_OUTPUT_PATH.pathname);
  console.log(`Wrote ${PNG_OUTPUT_PATH.pathname}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
