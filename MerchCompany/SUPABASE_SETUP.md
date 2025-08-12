# Supabase Setup Guide

This guide will help you set up Supabase for the MerchCompany website's authentication and database needs.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com/)
2. Node.js and npm installed on your development machine

## Setup Instructions

### 1. Create a new Supabase project

1. Log in to your Supabase dashboard
2. Click "New Project"
3. Enter your project details (name, database password, and region)
4. Click "Create new project"

### 2. Set up the database

1. Go to the SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20230527000000_create_inquiries_table.sql`
4. Paste the SQL into the query editor and click "Run"

### 3. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Site URL," add your website's URL (e.g., http://localhost:5500 for local development)
3. Under "Additional Redirect URLs," add your production URL if different
4. Under "Email Templates," customize the email templates as needed

### 4. Get your API keys

1. Go to Project Settings > API in your Supabase dashboard
2. Note your Project URL and public (anon) key
3. Update these values in `index.html`:
   - Replace `YOUR_SUPABASE_URL` with your Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your public (anon) key

### 5. Enable Email Authentication

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable "Email" provider
3. Configure the email provider settings as needed
4. Save your changes

## Environment Variables

For production, you should set these environment variables in your hosting provider:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Authentication

1. Open the website in your browser
2. Click "Sign Up" to create a new account
3. Check your email for the confirmation link
4. After confirming your email, log in with your credentials
5. Try submitting the contact form - it should now work!

## Troubleshooting

- If you get CORS errors, make sure your site URL is correctly configured in Supabase
- If emails aren't sending, check your email provider settings in Supabase
- Check the browser console for any JavaScript errors

## Security Notes

- Never expose your Supabase service role key in client-side code
- Always use Row Level Security (RLS) for your database tables
- Keep your Supabase credentials secure and never commit them to version control
