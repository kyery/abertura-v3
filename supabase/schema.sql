create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  ticket_kind text not null check (ticket_kind in ('individual','casadinha')),
  amount_cents integer not null check (amount_cents in (2500,4000)),
  ticket_quantity integer not null check (ticket_quantity in (1,2)),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','cancelled','refunded')),
  provider_preference_id text,
  provider_payment_id text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  constraint order_kind_quantity check (
    (ticket_kind='individual' and ticket_quantity=1 and amount_cents=2500)
    or (ticket_kind='casadinha' and ticket_quantity=2 and amount_cents=4000)
  )
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  token text not null unique,
  status text not null default 'valid' check (status in ('valid','used','cancelled')),
  created_at timestamptz not null default now(),
  checked_in_at timestamptz
);

create table if not exists public.entry_logs (
  id bigint generated always as identity primary key,
  ticket_id uuid not null references public.tickets(id),
  action text not null check (action in ('check_in','reversal','manual_review')),
  staff_user_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders(payment_status);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists tickets_order_idx on public.tickets(order_id);
create index if not exists tickets_status_idx on public.tickets(status);
create index if not exists entry_logs_ticket_idx on public.entry_logs(ticket_id);

-- Dados sensíveis não devem ser expostos publicamente.
alter table public.orders enable row level security;
alter table public.tickets enable row level security;
alter table public.entry_logs enable row level security;

-- Não crie políticas públicas para leitura/escrita dessas tabelas.
-- As rotas de servidor usam SUPABASE_SERVICE_ROLE_KEY, que nunca deve ir ao navegador.

-- Acesso privado ao link do pedido (token aleatório de 256 bits).
alter table public.orders add column if not exists public_token text;
create unique index if not exists orders_public_token_idx on public.orders(public_token);

-- Confirmação manual idempotente e criação atômica dos ingressos.
create or replace function public.admin_confirm_order_paid(p_order_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare o public.orders%rowtype; i integer;
begin
  select * into o from public.orders where id = p_order_id for update;
  if not found then return jsonb_build_object('ok',false,'message','Pedido não encontrado.'); end if;
  if o.payment_status = 'paid' then return jsonb_build_object('ok',false,'message','Este pedido já foi confirmado.'); end if;
  if o.payment_status <> 'pending' then return jsonb_build_object('ok',false,'message','Este pedido não está pendente.'); end if;
  update public.orders set payment_status='paid', paid_at=now() where id=p_order_id;
  for i in 1..o.ticket_quantity loop
    insert into public.tickets(order_id,token,status) values (p_order_id, encode(gen_random_bytes(32),'hex'),'valid');
  end loop;
  return jsonb_build_object('ok',true,'message','Pagamento confirmado e ingressos emitidos.');
end; $$;

-- Validação atômica: não permite duas entradas para o mesmo ingresso.
create or replace function public.staff_check_in(p_token text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare t public.tickets%rowtype; o public.orders%rowtype;
begin
  select * into t from public.tickets where token=p_token for update;
  if not found then return jsonb_build_object('status','not_found'); end if;
  if t.status='used' then return jsonb_build_object('status','used','ticket_id',t.id); end if;
  if t.status<>'valid' then return jsonb_build_object('status','not_found'); end if;
  select * into o from public.orders where id=t.order_id;
  if not found or o.payment_status<>'paid' then return jsonb_build_object('status','unpaid'); end if;
  update public.tickets set status='used',checked_in_at=now() where id=t.id;
  insert into public.entry_logs(ticket_id,action,created_at) values(t.id,'check_in',now());
  return jsonb_build_object('status','ok','ticket_id',t.id,'buyer_name',o.buyer_name);
end; $$;

-- Somente a chave service role do servidor deve executar essas funções.
revoke all on function public.admin_confirm_order_paid(uuid) from public, anon, authenticated;
revoke all on function public.staff_check_in(text) from public, anon, authenticated;
grant execute on function public.admin_confirm_order_paid(uuid) to service_role;
grant execute on function public.staff_check_in(text) to service_role;
