#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node create-admin-user.js <email> <password> [full_name]');
    console.log('');
    console.log('Example:');
    console.log('  node create-admin-user.js admin@discoverkackar.com password123 "Admin User"');
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];
  const fullName = args[2] || 'Admin User';

  console.log('🚀 Creating admin user...');
  console.log(`📧 Email: ${email}`);
  console.log(`👤 Name: ${fullName}`);
  console.log('');

  try {
    // Create user in Supabase Auth
    console.log('1. Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    });

    if (authError) {
      console.error('❌ Error creating user in auth:', authError.message);
      process.exit(1);
    }

    console.log('✅ User created in Supabase Auth');
    console.log(`   User ID: ${authData.user.id}`);

    // Create profile in database
    console.log('2. Creating user profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: 'admin'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message);
      
      // Try to clean up the auth user
      console.log('🧹 Cleaning up auth user...');
      await supabase.auth.admin.deleteUser(authData.user.id);
      process.exit(1);
    }

    console.log('✅ User profile created');
    console.log(`   Role: ${profileData.role}`);

    console.log('');
    console.log('🎉 Admin user created successfully!');
    console.log('');
    console.log('You can now log in to the admin panel at:');
    console.log('  http://localhost:3000/admin/login');
    console.log('');
    console.log('Login credentials:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
