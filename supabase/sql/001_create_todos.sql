create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  title text not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

create policy "Todos are viewable by owner"
  on public.todos
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Todos are insertable by owner"
  on public.todos
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Todos are updatable by owner"
  on public.todos
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Todos are deletable by owner"
  on public.todos
  for delete
  to authenticated
  using (user_id = auth.uid());