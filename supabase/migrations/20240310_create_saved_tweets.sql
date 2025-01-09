create table "public"."saved_tweets" (
    id bigserial primary key,
    content text not null,
    created_at timestamptz default now()
);

-- Enable Row Level Security
alter table "public"."saved_tweets" enable row level security;

-- Create policies
create policy "Anyone can insert tweets" on "public"."saved_tweets"
    for insert with check (true);

create policy "Anyone can view tweets" on "public"."saved_tweets"
    for select using (true);

create policy "Anyone can delete tweets" on "public"."saved_tweets"
    for delete using (true); 