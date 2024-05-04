-- CREATE INVOICE AND RELATED DATA
create
or replace function create_new_invoice (
  invoice_data jsonb,
  billto_data jsonb,
  billfrom_data jsonb,
  listitem_data jsonb[]
) returns void as $$
declare
  new_invoice_id integer;
  item jsonb;
begin
  insert into public.invoices (created_at, payment_due, payment_terms, project_description, status, total)
  values (
    (invoice_data ->> 'created_at')::date, 
    (invoice_data ->> 'payment_due')::date, 
    (invoice_data ->> 'payment_terms')::integer, 
    invoice_data ->> 'project_description', 
    (invoice_data ->> 'status')::boolean, 
    (invoice_data ->> 'total')::numeric
  )
  returning id into new_invoice_id;

  -- Insert billTo data
  insert into public."billTo" (client_name, client_email, street_address, city, post_code, country, invoice_id)
  values (
    billto_data ->> 'client_name', 
    billto_data ->> 'client_email', 
    billto_data ->> 'street_address', 
    billto_data ->> 'city', 
    billto_data ->> 'post_code', 
    billto_data ->> 'country', 
    new_invoice_id
  );

  -- Insert billFrom data
  insert into public."billFrom" (street_address, city, post_code, country, invoice_id)
  values (
    billfrom_data ->> 'street_address', 
    billfrom_data ->> 'city', 
    billfrom_data ->> 'post_code', 
    billfrom_data ->> 'country',
    new_invoice_id
  );

  FOREACH item IN ARRAY listitem_data
  LOOP
    INSERT INTO public."listItem" (name, quantity, price, total, invoice_id)
    VALUES (
      item->>'name', 
      (item->>'quantity')::integer, 
      (item->>'price')::numeric, 
      (item->>'total')::numeric, 
      new_invoice_id
    );
  END LOOP;
end;
$$ language plpgsql;

-- UPDATE INVOICE AND RELATED DATA
create
or replace function update_invoice(
  invoice_id_data integer,
  invoice_data jsonb,
  billto_data jsonb,
  billfrom_data jsonb,
  listitem_data jsonb[]
) returns void as $$
declare
  item jsonb;
begin
  update public.invoices
  set
    created_at = (invoice_data ->> 'created_at')::date,
    payment_due = (invoice_data ->> 'payment_due')::date,
    payment_terms = (invoice_data ->> 'payment_terms')::integer,
    project_description = invoice_data ->> 'project_description',
    status = (invoice_data ->> 'status')::boolean,
    total = (invoice_data ->> 'total')::numeric
  where id = invoice_id_data;

  update public."billTo"
  set
    client_name = billto_data ->> 'client_name',
    client_email = billto_data ->> 'client_email',
    street_address = billto_data ->> 'street_address',
    city = billto_data ->> 'city',
    post_code = billto_data ->> 'post_code',
    country = billto_data ->> 'country'
  where invoice_id = invoice_id_data;

  update public."billFrom"
  set
    street_address = billto_data ->> 'street_address',
    city = billto_data ->> 'city',
    post_code = billto_data ->> 'post_code',
    country = billto_data ->> 'country'
  where invoice_id = invoice_id_data;

  foreach item in array listitem_data
  loop
    update public."listItem"
    set
      name = item ->> 'name',
      quantity = (item ->> 'quantity')::integer,
      price = (item ->> 'price')::numeric,
      total = (item ->> 'total')::numeric
    where id = (item ->> 'id')::integer and invoice_id = invoice_id_data;
  end loop;
end;
$$ language plpgsql;

-- DELETE INVOICES
create
or replace function delete_invoice(
  invoice_id_data integer
) returns void as $$
declare
  item jsonb;
begin
  delete from public.invoices where id = invoice_id_data;
end;
$$ language plpgsql;