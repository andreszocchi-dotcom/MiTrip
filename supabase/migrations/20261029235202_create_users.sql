-- One row per MiTrip account (PLAN.md section 3: users).
-- Supabase Auth keeps login details in auth.users; this public table mirrors
-- each account so the rest of the schema can link to it.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  created_at timestamptz not null default now()
);

-- Row Level Security: a user can read only their own row.
alter table public.users enable row level security;

create policy "Users can read their own row"
  on public.users for select
  to authenticated
  using ((select auth.uid()) = id);

-- When someone signs up (email or Google), copy them into public.users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
