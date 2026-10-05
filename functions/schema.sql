create table if not exists srs_cards (
  id text not null,
  user_id text not null,
  word_id text not null,
  card_kind text not null default 'recognition',
  state text not null default 'new',
  due_at timestamptz not null default now(),
  interval_days integer not null default 0,
  ease numeric(4, 2) not null default 2.50,
  reps integer not null default 0,
  lapses integer not null default 0,
  last_review_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  unique (user_id, word_id, card_kind)
);

create index if not exists srs_cards_due_idx on srs_cards (user_id, due_at);

create table if not exists review_logs (
  id bigserial primary key,
  user_id text not null,
  card_id text not null,
  word_id text not null,
  card_kind text not null default 'recognition',
  rating smallint not null check (rating between 1 and 4),
  interval_days integer not null default 0,
  ease numeric(4, 2) not null default 2.50,
  reviewed_at timestamptz not null default now()
);

create index if not exists review_logs_user_idx on review_logs (user_id, reviewed_at desc);
