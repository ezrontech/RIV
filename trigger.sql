-- 1. Create a trigger function that inserts a new profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, username, avatar, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '/images/riv-logo.webp'),
    'member'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Bind the trigger to auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
