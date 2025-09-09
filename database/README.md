# Database Setup Instructions

This document provides step-by-step instructions for setting up the Supabase database schema for the polling app.

## Prerequisites

1. A Supabase project with authentication enabled
2. Access to your Supabase dashboard

## Setup Steps

### 1. Access the SQL Editor

1. Go to your Supabase dashboard
2. Navigate to the **SQL Editor** section in the left sidebar
3. Click **New Query**

### 2. Run the Schema

1. Copy the entire contents of `schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the schema

### 3. Verify the Setup

After running the schema, you should see the following in your Supabase dashboard:

#### Tables Created:
- `polls` - Main polls table
- `poll_options` - Poll options/choices
- `votes` - User votes

#### Views Created:
- `poll_results` - Pre-calculated poll results with percentages

#### Types Created:
- `poll_status` - Enum: 'active', 'closed', 'draft'
- `vote_type` - Enum: 'single', 'multiple'

### 4. Test the Setup

You can test the database setup by running these queries in the SQL Editor:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('polls', 'poll_options', 'votes');

-- Check if types exist
SELECT typname FROM pg_type 
WHERE typname IN ('poll_status', 'vote_type');

-- Check if view exists
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'poll_results';
```

## Database Schema Overview

### Tables

#### `polls`
- **id**: UUID (Primary Key)
- **title**: VARCHAR(255) - Poll title
- **description**: TEXT - Poll description
- **status**: poll_status - 'active', 'closed', 'draft'
- **vote_type**: vote_type - 'single', 'multiple'
- **allow_multiple_votes**: BOOLEAN - Whether users can vote multiple times
- **max_votes_per_user**: INTEGER - Maximum votes per user
- **expires_at**: TIMESTAMP - When the poll expires
- **created_by**: UUID - User who created the poll
- **created_at**: TIMESTAMP - Creation timestamp
- **updated_at**: TIMESTAMP - Last update timestamp

#### `poll_options`
- **id**: UUID (Primary Key)
- **poll_id**: UUID (Foreign Key) - References polls.id
- **text**: VARCHAR(500) - Option text
- **order_index**: INTEGER - Display order
- **created_at**: TIMESTAMP - Creation timestamp

#### `votes`
- **id**: UUID (Primary Key)
- **poll_id**: UUID (Foreign Key) - References polls.id
- **option_id**: UUID (Foreign Key) - References poll_options.id
- **user_id**: UUID (Foreign Key) - References auth.users.id
- **created_at**: TIMESTAMP - Creation timestamp

### Views

#### `poll_results`
A pre-calculated view that provides:
- Poll information
- Option details
- Vote counts
- Percentages

### Security Features

#### Row Level Security (RLS)
- All tables have RLS enabled
- Policies ensure users can only:
  - View all polls and results
  - Create polls (authenticated users)
  - Update/delete their own polls
  - Vote on active polls
  - Manage options for their own polls

#### Vote Validation
- Automatic validation of vote limits
- Prevention of voting on inactive/expired polls
- Enforcement of single/multiple vote rules

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps

After setting up the database:

1. **Test Authentication**: Ensure user registration and login work
2. **Test Poll Creation**: Create a test poll through the app
3. **Test Voting**: Vote on polls and verify results
4. **Monitor Logs**: Check Supabase logs for any errors

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure RLS policies are correctly set up
2. **Foreign Key Errors**: Verify that referenced users exist in auth.users
3. **Vote Validation Errors**: Check poll status and vote limits

### Useful Queries

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check table permissions
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public';
```

## Support

If you encounter any issues:
1. Check the Supabase logs in your dashboard
2. Verify your environment variables
3. Ensure all SQL commands executed successfully
