create table Decks (
  id serial not null primary key,
  name character not null,
  user_id uuid default uuid_generate_v4(),
  description text,
  created_at timestamp default now() not null
);

create table Cards (
  api_card_id bigint not null primary key,
  name text,
  type text,
  desc text,
  card_images text
);

create table DeckCards (
  id uuid default uuid_generate_v4() primary key,
  api_card bigint references Cards (api_card_id),
  deck_id integer references Decks (id)
);

create table Trap_Cards (
  api_card_id bigint references Cards (api_card_id),
  race text
);

create table Monster_Cards (
  api_card_id bigint references Cards (api_card_id),
  attribute text,
  race text,
  "level" bigint,
  attack bigint,
  defense bigint
);

create table Spell_Cards (
  api_card_id bigint references Cards (api_card_id),
  race text
);