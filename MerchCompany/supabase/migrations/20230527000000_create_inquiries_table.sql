-- Create a table for storing inquiries
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  form_data jsonb not null,
  status text not null default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.inquiries enable row level security;

-- Create policies for RLS
create policy "Users can view their own inquiries"
  on public.inquiries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own inquiries"
  on public.inquiries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own inquiries"
  on public.inquiries for update
  using (auth.uid() = user_id);

-- Create a function to automatically update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create a trigger to update the updated_at column
create trigger handle_updated_at
  before update on public.inquiries
  for each row
  execute function update_updated_at_column();
