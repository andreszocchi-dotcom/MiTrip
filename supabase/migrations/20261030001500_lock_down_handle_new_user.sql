-- Fix: handle_new_user() (from the create_users migration) is a trigger
-- function but was also callable through the website API. Only the
-- sign-up trigger should run it.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
