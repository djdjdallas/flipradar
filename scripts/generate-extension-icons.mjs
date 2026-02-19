import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SIZES = [16, 48, 128];
const BG_COLOR = "#09090B";
const TEXT_COLOR = "#D2E823";
const OUTPUT_DIR = join(ROOT, "flipradar/icons");

async function generateIcons() {
  const fontBuffer = await readFile(
    join(ROOT, "public/fonts/DelaGothicOne-Regular.ttf")
  );
  const fontBase64 = fontBuffer.toString("base64");

  for (const size of SIZES) {
    const fontSize = Math.round(size * 0.56);
    const radius = Math.round(size * 0.12);

    const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Dela Gothic One';
        src: url('data:font/truetype;base64,${fontBase64}');
      }
    </style>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BG_COLOR}" />
  <text
    x="50%" y="54%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Dela Gothic One"
    font-size="${fontSize}"
    fill="${TEXT_COLOR}"
  >FC</text>
</svg>`;

    await sharp(Buffer.from(svg))
      .png()
      .toFile(join(OUTPUT_DIR, `icon${size}.png`));

    console.log(`Generated icon${size}.png`);
  }

  console.log("Done!");
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});
