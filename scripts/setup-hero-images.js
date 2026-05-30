#!/usr/bin/env node
/**
 * Copy HiRes hero sources from assets/ and build optimized AVIFs for the home carousel.
 * Run: node scripts/setup-hero-images.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '../../assets');
const IMAGES_DIR = path.join(__dirname, '../public/images');
const OPT_DIR = path.join(IMAGES_DIR, 'optimized');

const HERO_SOURCES = [
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0098-2.jpg',
];

const SIZES = [
  { suffix: 'mobile', width: 640, quality: 80 },
  { suffix: 'tablet', width: 1024, quality: 85 },
  { suffix: 'desktop', width: 1920, quality: 90 },
];

function hasConvert() {
  try {
    execSync('convert -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function optimize(inputPath, baseName) {
  SIZES.forEach(({ suffix, width, quality }) => {
    const out = path.join(OPT_DIR, `${baseName}_${suffix}.avif`);
    execSync(
      `convert "${inputPath}" -resize ${width}x -quality ${quality} -format avif "${out}"`,
      { stdio: 'ignore' }
    );
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`   ✓ ${suffix}: ${kb} KB`);
  });
}

function main() {
  if (!hasConvert()) {
    console.error('ImageMagick `convert` is required. Install: brew install imagemagick');
    process.exit(1);
  }

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.mkdirSync(OPT_DIR, { recursive: true });

  for (const name of HERO_SOURCES) {
    const src = path.join(ASSETS_DIR, name);
    if (!fs.existsSync(src)) {
      console.error(`Missing source: ${src}`);
      process.exit(1);
    }
    const dest = path.join(IMAGES_DIR, name);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
    const baseName = path.parse(name).name;
    console.log(`\n🖼  ${name}`);
    optimize(dest, baseName);
  }

  console.log('\nDone. Hero URLs: /images/optimized/<name>_desktop.avif');
}

main();
