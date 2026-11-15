// Generates assets/icon + splash PNGs for @capacitor/assets (node scripts/make-icons.cjs)
const sharp = require('sharp'), fs = require('fs');
fs.mkdirSync('assets', { recursive: true });
const mark = (s, ox, oy, scale) => `<g transform="translate(${ox} ${oy}) scale(${scale})">
  <rect x="60" y="238" width="392" height="36" rx="10" fill="#F4EDE0"/>
  <rect x="112" y="170" width="40" height="172" rx="12" fill="#FF6B5B"/><rect x="360" y="170" width="40" height="172" rx="12" fill="#FF6B5B"/>
  <rect x="160" y="196" width="32" height="120" rx="10" fill="#F4EDE0"/><rect x="320" y="196" width="32" height="120" rx="10" fill="#F4EDE0"/>
  <path d="M96 138c40-56 76-56 112 0s72 56 112 0 56-26 96-26" fill="none" stroke="#F4EDE0" stroke-width="22" stroke-linecap="round" opacity=".9" transform="translate(0 -8)"/>
</g>`;
const bg = (s) => `<defs><radialGradient id="g" cx="50%" cy="85%" r="70%"><stop offset="0" stop-color="#FF6B5B" stop-opacity=".55"/><stop offset="1" stop-color="#0b0c10"/></radialGradient></defs><rect width="${s}" height="${s}" fill="#0b0c10"/><rect width="${s}" height="${s}" fill="url(#g)"/>`;
const svg = (s, inner) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${inner}</svg>`);
(async () => {
  await sharp(svg(1024, bg(1024) + mark(1024, 51, 105, 1.8))).png().toFile('assets/icon-only.png');
  await sharp(svg(1024, mark(1024, 179, 218, 1.3))).png().toFile('assets/icon-foreground.png');
  await sharp(svg(1024, `<rect width="1024" height="1024" fill="#0b0c10"/>`)).png().toFile('assets/icon-background.png');
  for (const n of ['splash', 'splash-dark']) {
    await sharp(svg(2732, `<rect width="2732" height="2732" fill="#0b0c10"/><radialGradient id="g" cx="50%" cy="58%" r="40%"><stop offset="0" stop-color="#FF6B5B" stop-opacity=".5"/><stop offset="1" stop-color="#0b0c10" stop-opacity="0"/></radialGradient><rect width="2732" height="2732" fill="url(#g)"/>${mark(2732, 803, 703, 2.2)}<text x="1366" y="1700" text-anchor="middle" font-family="DejaVu Sans, Arial" font-size="120" font-weight="700" fill="#F4EDE0" letter-spacing="6">IronPath</text>`)).png().toFile(`assets/${n}.png`);
  }
  console.log('icons ready');
})();
