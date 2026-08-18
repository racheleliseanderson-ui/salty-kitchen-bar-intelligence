create table if not exists kbi_inventories (
  user_id    text primary key,
  payload    text not null,
  updated_at timestamptz not null default now()
);
