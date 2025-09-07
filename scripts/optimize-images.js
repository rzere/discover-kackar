#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if ImageMagick is available
function checkImageMagick() {
  try {
    execSync('convert -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('❌ ImageMagick not found. Installing via Homebrew...');
    try {
      execSync('brew install imagemagick', { stdio: 'inherit' });
      return true;
    } catch (installError) {
      console.log('❌ Failed to install ImageMagick. Please install manually:');
      console.log('   brew install imagemagick');
      return false;
    }
  }
}

// Optimize a single image
function optimizeImage(inputPath, outputDir, baseName) {
  const sizes = [
    { suffix: 'mobile', width: 640, quality: 80 },
    { suffix: 'tablet', width: 1024, quality: 85 },
    { suffix: 'desktop', width: 1920, quality: 90 }
  ];

  console.log(`🖼️  Optimizing ${baseName}...`);

  sizes.forEach(({ suffix, width, quality }) => {
    const outputPath = path.join(outputDir, `${baseName}_${suffix}.avif`);
    
    try {
      // Convert to AVIF with specific dimensions and quality
      const command = `convert "${inputPath}" -resize ${width}x -quality ${quality} -format avif "${outputPath}"`;
      execSync(command, { stdio: 'ignore' });
      
      const stats = fs.statSync(outputPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`   ✅ ${suffix}: ${sizeKB}KB (${width}px wide)`);
    } catch (error) {
      console.log(`   ❌ Failed to create ${suffix} version`);
    }
  });
}

// Main optimization function
function optimizeImages() {
  console.log('🚀 Starting image optimization...\n');

  if (!checkImageMagick()) {
    return;
  }

  const inputDir = path.join(__dirname, '../public/images');
  const outputDir = path.join(__dirname, '../public/images/optimized');
  
  // Create optimized directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // List of essential images to optimize
  const essentialImages = [
    'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-DJI_0098-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg',
    'Kackar_HiRes-nodumsports_moritzklee-MK_01928-2.jpg',
    'aa-01_edited.jpg'
  ];

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  essentialImages.forEach(filename => {
    const inputPath = path.join(inputDir, filename);
    const baseName = path.parse(filename).name;
    
    if (fs.existsSync(inputPath)) {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      totalOriginalSize += originalStats.size;
      
      // Optimize the image
      optimizeImage(inputPath, outputDir, baseName);
      
      // Calculate optimized size
      const mobilePath = path.join(outputDir, `${baseName}_mobile.avif`);
      const tabletPath = path.join(outputDir, `${baseName}_tablet.avif`);
      const desktopPath = path.join(outputDir, `${baseName}_desktop.avif`);
      
      if (fs.existsSync(mobilePath)) {
        totalOptimizedSize += fs.statSync(mobilePath).size;
      }
      if (fs.existsSync(tabletPath)) {
        totalOptimizedSize += fs.statSync(tabletPath).size;
      }
      if (fs.existsSync(desktopPath)) {
        totalOptimizedSize += fs.statSync(desktopPath).size;
      }
    } else {
      console.log(`⚠️  File not found: ${filename}`);
    }
  });

  // Summary
  console.log('\n📊 Optimization Summary:');
  console.log(`   Original size: ${Math.round(totalOriginalSize / 1024 / 1024)}MB`);
  console.log(`   Optimized size: ${Math.round(totalOptimizedSize / 1024 / 1024)}MB`);
  console.log(`   Space saved: ${Math.round((totalOriginalSize - totalOptimizedSize) / 1024 / 1024)}MB`);
  console.log(`   Compression ratio: ${Math.round((1 - totalOptimizedSize / totalOriginalSize) * 100)}%`);
  
  console.log('\n✅ Image optimization complete!');
  console.log('📁 Optimized images saved to: public/images/optimized/');
}

// Run optimization
optimizeImages();
