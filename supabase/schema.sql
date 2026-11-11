-- OJ NEXUS Academy: run in your own Supabase project's SQL editor.
-- Authentication is managed by Supabase Auth; NEVER store passwords here.
create table if not exists public.student_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 progress jsonb not null default '{"completed":{},"cases":[],"scores":[]}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.student_progress enable row level security;
revoke all on public.student_progress from anon;
grant select,insert,update,delete on public.student_progress to authenticated;
drop policy if exists "Students read own progress" on public.student_progress;
create policy "Students read own progress" on public.student_progress for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Students create own progress" on public.student_progress;
create policy "Students create own progress" on public.student_progress for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Students update own progress" on public.student_progress;
create policy "Students update own progress" on public.student_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Students delete own progress" on public.student_progress;
create policy "Students delete own progress" on public.student_progress for delete to authenticated using ((select auth.uid()) = user_id);
-- The public client uses a publishable key only; keep service-role keys server-side.
