const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdminProfile() {
  try {
    // Get all users
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    
    console.log('Users found:');
    users.users.forEach(user => {
      console.log(`- Email: ${user.email}, ID: ${user.id}`);
    });
    
    // Find the admin user
    const adminUser = users.users.find(u => u.email === 'ceylans@manaplusds.com');
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }
    
    console.log(`\nCreating profile for admin user: ${adminUser.email}`);
    
    // Create profile
    const { data, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: adminUser.id,
        email: adminUser.email,
        full_name: 'Admin User',
        role: 'admin',
        is_active: true
      });
      
    if (profileError) {
      console.error('Error creating profile:', profileError);
    } else {
      console.log('Profile created successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminProfile();
