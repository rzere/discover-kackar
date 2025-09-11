-- Test script to verify migration syntax
-- This is a simplified version to test the SQL syntax

-- Test the contact_pages structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contact_pages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test the footer structure  
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'footer' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test the cta_cards structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cta_cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;
