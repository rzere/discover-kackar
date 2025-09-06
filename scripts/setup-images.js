#!/usr/bin/env node

/**
 * Image Setup Script for Discover Kaçkar Website
 * 
 * This script helps manage images for development and production.
 * Since large images are gitignored, this script provides utilities
 * to copy images from the assets folder for local development.
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../../assets');
const IMAGES_DIR = path.join(__dirname, '../public/images');

// Essential images that should be kept in the repository
const ESSENTIAL_IMAGES = [
  'placeholder.jpg',
  'logo.png',
  'favicon.ico'
];

// Hero images for the main page
const HERO_IMAGES = [
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-DJI_0098-2.jpg',
  'discover_over_the_clouds_eeff360dff.avif',
  'ayder_plateau_3_58bd958670.avif'
];

// Category images
const CATEGORY_IMAGES = [
  'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
  'aa-01_edited.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg',
  'Kackar_HiRes-nodumsports_moritzklee-MK_01928-2.jpg'
];

function copyImage(sourcePath, destPath) {
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied: ${path.basename(sourcePath)}`);
      return true;
    } else {
      console.log(`❌ Not found: ${path.basename(sourcePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error copying ${path.basename(sourcePath)}:`, error.message);
    return false;
  }
}

function setupImages() {
  console.log('🚀 Setting up images for local development...\n');
  
  // Ensure images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  
  let copiedCount = 0;
  let totalCount = 0;
  
  // Copy hero images
  console.log('📸 Copying hero images...');
  HERO_IMAGES.forEach(imageName => {
    totalCount++;
    const sourcePath = path.join(ASSETS_DIR, imageName);
    const destPath = path.join(IMAGES_DIR, imageName);
    if (copyImage(sourcePath, destPath)) {
      copiedCount++;
    }
  });
  
  // Copy category images
  console.log('\n🏷️ Copying category images...');
  CATEGORY_IMAGES.forEach(imageName => {
    totalCount++;
    const sourcePath = path.join(ASSETS_DIR, imageName);
    const destPath = path.join(IMAGES_DIR, imageName);
    if (copyImage(sourcePath, destPath)) {
      copiedCount++;
    }
  });
  
  console.log(`\n📊 Summary: ${copiedCount}/${totalCount} images copied successfully`);
  
  if (copiedCount < totalCount) {
    console.log('\n⚠️  Some images were not found. Make sure the assets folder contains all required images.');
  }
  
  console.log('\n💡 For production deployment:');
  console.log('   1. Upload images to a CDN (Cloudinary, AWS S3, etc.)');
  console.log('   2. Update getImageUrl() function to use CDN URLs');
  console.log('   3. Remove the gitignore rules for images if needed');
}

function cleanImages() {
  console.log('🧹 Cleaning up images...\n');
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('Images directory does not exist.');
    return;
  }
  
  const files = fs.readdirSync(IMAGES_DIR);
  let removedCount = 0;
  
  files.forEach(file => {
    if (!ESSENTIAL_IMAGES.includes(file)) {
      const filePath = path.join(IMAGES_DIR, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`❌ Error removing ${file}:`, error.message);
      }
    }
  });
  
  console.log(`\n📊 Removed ${removedCount} images`);
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupImages();
    break;
  case 'clean':
    cleanImages();
    break;
  default:
    console.log('🖼️  Image Management Script for Discover Kaçkar\n');
    console.log('Usage:');
    console.log('  node scripts/setup-images.js setup  - Copy images for local development');
    console.log('  node scripts/setup-images.js clean  - Remove images (keep essentials)');
    console.log('\nThis script helps manage the large image files that are gitignored.');
    break;
}
