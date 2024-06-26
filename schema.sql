create table
  public.invoices (
    id bigint generated by default as identity,
    created_at date not null,
    payment_due date null,
    payment_terms integer null,
    project_description text null,
    status boolean null,
    total numeric null,
    constraint invoices_pkey primary key (id)
  ) tablespace pg_default;

create table
  public."billTo" (
    id bigint generated by default as identity,
    client_name character varying null,
    client_email character varying null,
    street_address character varying null,
    city character varying null,
    post_code character varying null,
    country character varying null,
    invoice_id bigint null,
    constraint billTo_pkey primary key (id),
    constraint billTo_invoice_id_fkey foreign key (invoice_id) references invoices (id) on delete cascade
  ) tablespace pg_default;

create table
  public."billFrom" (
    id bigint generated by default as identity,
    street_address character varying null,
    city character varying null,
    post_code character varying null,
    country character varying null,
    invoice_id bigint null,
    constraint billFrom_pkey primary key (id),
    constraint billFrom_invoice_id_fkey foreign key (invoice_id) references invoices (id) on delete cascade
  ) tablespace pg_default;

create table
  public."listItem" (
    id bigint generated by default as identity,
    name text null,
    quantity bigint null,
    price numeric null,
    total numeric null,
    invoice_id bigint null,
    constraint listItem_pkey primary key (id),
    constraint listItem_invoice_id_fkey foreign key (invoice_id) references invoices (id) on delete cascade
  ) tablespace pg_default;