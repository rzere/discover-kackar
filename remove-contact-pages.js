#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDuplicateContactPages() {
  console.log('🗑️  Removing duplicate contact pages...');

  try {
    // Delete French contact page
    const { error: frError } = await supabase
      .from('pages')
      .delete()
      .eq('slug', 'contact')
      .eq('locale', 'fr');

    if (frError) {
      console.error('❌ Error deleting French contact page:', frError);
    } else {
      console.log('✅ French contact page deleted');
    }

    // Delete German contact page
    const { error: deError } = await supabase
      .from('pages')
      .delete()
      .eq('slug', 'contact')
      .eq('locale', 'de');

    if (deError) {
      console.error('❌ Error deleting German contact page:', deError);
    } else {
      console.log('✅ German contact page deleted');
    }

    // Verify the deletion
    const { data: remainingPages, error: fetchError } = await supabase
      .from('pages')
      .select('slug, locale, title')
      .order('locale')
      .order('slug');

    if (fetchError) {
      console.error('❌ Error fetching remaining pages:', fetchError);
    } else {
      console.log('📋 Remaining pages:');
      remainingPages.forEach(page => {
        console.log(`   ${page.locale.toUpperCase()}: ${page.slug} - ${page.title}`);
      });
    }

    console.log('🎉 Duplicate contact pages removed successfully!');
    console.log('💡 Contact functionality is now handled by the dedicated contact_pages table.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

removeDuplicateContactPages();
