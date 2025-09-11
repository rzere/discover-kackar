#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running French and German content migration...');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('supabase/migrations/020_add_french_german_content.sql')) {
    console.error('❌ Migration file not found. Make sure you\'re in the project root.');
    process.exit(1);
  }

  // Run the migration
  console.log('📝 Applying migration: 020_add_french_german_content.sql');
  execSync('npx supabase db push', { stdio: 'inherit' });
  
  console.log('✅ Migration completed successfully!');
  console.log('🎉 French and German content has been added to your database.');
  console.log('📋 You can now:');
  console.log('   - Access French content at /fr/');
  console.log('   - Access German content at /de/');
  console.log('   - Use the language toggle in the admin panel');
  console.log('   - Manage content in all 4 languages');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('💡 Make sure your Supabase project is running and configured correctly.');
  process.exit(1);
}
