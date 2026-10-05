-- Atomic, replay-safe study operations. Existing rows remain v1 until their
-- owner explicitly enrolls. Old documents retain local work but may no longer
-- replace an enrolled account with a stale whole-row snapshot.
create schema if not exists private;

alter table public.user_data
  add column if not exists sync_version smallint not null default 1,
  add column if not exists sync_revision bigint not null default 0,
  add column if not exists sync_clock bigint not null default 0,
  add column if not exists sync_stamps jsonb not null default '{}'::jsonb;

create table if not exists private.user_data_sync_receipts (
  user_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid not null,
  payload_hash text not null,
  conflicts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, operation_id)
);
alter table private.user_data_sync_receipts enable row level security;
revoke all on private.user_data_sync_receipts from public, anon, authenticated;

drop policy if exists user_data_v1_insert on public.user_data;
create policy user_data_v1_insert on public.user_data as restrictive
  for insert to authenticated with check
  (sync_version = 1 and sync_revision = 0 and sync_clock = 0 and sync_stamps = '{}'::jsonb);
drop policy if exists user_data_v1_update on public.user_data;
create policy user_data_v1_update on public.user_data as restrictive
  for update to authenticated using (sync_version = 1) with check
  (sync_version = 1 and sync_revision = 0 and sync_clock = 0 and sync_stamps = '{}'::jsonb);
drop policy if exists user_data_v1_delete on public.user_data;
create policy user_data_v1_delete on public.user_data as restrictive
  for delete to authenticated using (sync_version = 1);

create or replace function private.user_data_canonical_json(item jsonb)
returns jsonb language plpgsql immutable set search_path = pg_catalog as $$
declare result jsonb;
begin
  case jsonb_typeof(item)
    when 'number' then return to_jsonb(trim_scale((item#>>'{}')::numeric));
    when 'array' then
      select coalesce(jsonb_agg(private.user_data_canonical_json(value) order by n),'[]'::jsonb)
        into result from jsonb_array_elements(item) with ordinality t(value,n);
      return result;
    when 'object' then
      select coalesce(jsonb_object_agg(key,private.user_data_canonical_json(value)),'{}'::jsonb)
        into result from jsonb_each(item);
      return result;
    else return item;
  end case;
end;
$$;
revoke all on function private.user_data_canonical_json(jsonb) from public, anon, authenticated;

create or replace function private.normalize_user_history_item(item jsonb)
returns jsonb language plpgsql immutable set search_path = pg_catalog as $$
declare
  id_map constant jsonb := $vmx_history_id_map${"engprof:1100":51000,"engprof:1101":51001,"engprof:1102":51002,"engprof:1103":51003,"engprof:1104":51004,"engprof:1105":51005,"engprof:1106":51006,"engprof:1107":51007,"engprof:1108":51008,"engprof:1109":51009,"engprof:1110":51010,"engprof:1111":51011,"engprof:1112":51012,"engprof:1113":51013,"engprof:1114":51014,"engprof:1115":51015,"engprof:1116":51016,"engprof:1117":51017,"engprof:1118":51018,"engprof:1119":51019,"engprof:1120":51020,"engprof:1121":51021,"engprof:1122":51022,"engprof:1123":51023,"engprof:1124":51024,"engprof:1125":51025,"engprof:1126":51026,"engprof:1127":51027,"engprof:1130":51028,"engprof:1131":51029,"engprof:1132":51030,"engprof:1133":51031,"engprof:1135":51032,"engprof:1140":51033,"engprof:1141":51034,"engprof:1142":51035,"engprof:1143":51036,"engprof:1144":51037,"engprof:1145":51038,"engprof:1148":51039,"engprof:1149":51040,"engprof:1150":51041,"engprof:1151":51042,"engprof:1152":51043,"engprof:1153":51044,"engprof:1155":51045,"engprof:1160":51046,"exotic:1500":50000,"exotic:1501":50001,"exotic:1502":50002,"exotic:1503":50003,"exotic:1504":50004,"exotic:1505":50005,"exotic:1506":50006,"exotic:1510":50007,"exotic:1511":50008,"exotic:1512":50009,"exotic:1513":50010,"exotic:1514":50011,"exotic:1515":50012,"exotic:1520":50013,"exotic:1521":50014,"exotic:1522":50015,"exotic:1523":50016,"exotic:1524":50017,"exotic:1530":50018,"exotic:1531":50019,"exotic:1532":50020,"exotic:1533":50021,"exotic:1534":50022,"exotic:1540":50023,"exotic:1541":50024,"exotic:1542":50025,"exotic:1543":50026,"exotic:1544":50027,"exotic:1545":50028,"exotic:1546":50029,"exotic:1547":50030,"exotic:1548":50031,"exotic:1549":50032,"exotic:1550":50033,"exotic:1551":50034,"exotic:1552":50035,"exotic:1553":50036,"exotic:1554":50037,"exotic:1555":50038,"exotic:1556":50039,"exotic:1557":50040,"exotic:1558":50041,"exotic:1559":50042,"exotic:1560":50043,"exotic:1561":50044,"exotic:1562":50045,"exotic:1563":50046,"exotic:1564":50047,"exotic:1565":50048,"exotic:1566":50049,"exotic:1567":50050,"exotic:1568":50051,"exotic:1569":50052,"exotic:1570":50053,"exotic:1571":50054,"repro-lect:2000":52004,"repro-lect:2001":52005,"repro-lect:2002":52006,"repro-lect:2003":52007,"repro-lect:2004":52008,"repro-lect:2005":52009,"repro-lect:2006":52010,"repro-lect:2007":52011,"repro-lect:2008":52012,"repro-lect:2009":52013,"repro-lect:2010":52014,"repro-lect:2011":52015,"repro-lect:2012":52016,"repro-lect:2013":52017,"repro-lect:2014":52018,"repro-lect:2015":52019,"repro-lect:2016":52020,"repro-lect:2017":52021,"repro-lect:2018":52022,"repro-lect:2019":52023,"repro-lect:2020":52024,"repro-lect:2021":52025,"repro-lect:2022":52026,"repro-lect:2023":52027,"repro-lect:2024":52028,"repro-lect:2025":52029,"repro-lect:2026":52030,"repro-lect:2027":52031,"repro-lect:2028":52032,"repro-lect:2029":52033,"repro-lect:2030":52034,"repro-lect:2031":52035,"repro-lect:2032":52036,"repro-lect:2033":52037,"repro-lect:2034":52038,"repro-lect:2035":52039,"repro-lect:2036":52040,"repro-lect:2037":52041,"repro-lect:2038":52042,"repro-lect:2039":52043,"repro-lect:2040":52044,"repro-lect:2041":52045,"repro-lect:2042":52046,"repro-lect:2043":52047,"repro-lect:2044":52048,"repro-lect:2045":52049,"repro-lect:2046":52050,"repro-lect:2047":52051,"repro-lect:2048":52052,"repro-lect:2049":52053,"repro-lect:2050":52054,"repro-lect:2051":52055,"repro-lect:2052":52056,"repro-lect:1900":52000,"repro-lect:1901":52001,"repro-lect:1902":52002,"repro-lect:1903":52003,"repro-lect:2200":52057,"repro-lect:2201":52058,"repro-lect:2202":52059,"repro-lect:2203":52060,"repro-lect:2210":52061,"repro-lect:2211":52062}$vmx_history_id_map$::jsonb;
  year_map constant jsonb := $vmx_history_year_map${"intro-vet":1,"biology-lab":1,"comp-app":1,"biochem-1":1,"vet-dev-anat":1,"vet-anat-1":1,"vet-histo":2,"vet-anat-2":2,"vet-physio-1":2,"vet-physio-lab-1":2,"biochem-2":2,"husbandry-2":2,"vet-neuroanat":2,"vet-physio-2":2,"vet-physio-3":2,"vet-physio-lab-2":2,"animal-breeding":2,"vet-parasit-1":2,"vet-microbio-1":2,"lab-animal":3,"field-husbandry":3,"vet-path-1":3,"vet-parasit-2":3,"biostat":3,"vet-pharm-1":3,"vet-microbio-2":3,"vet-immuno":3,"animal-nutrition":3,"vet-clin-chem":3,"principles-vet-med":3,"vet-pharm-2":3,"vet-tox":3,"vet-path-2":3,"vet-clin-immuno":3,"vet-hema-cytology":3,"vet-anesth":3,"principles-vph":3,"principles-surgery":3,"principles-therio":3,"surg2":4,"surg3":4,"com5":4,"com3":4,"com4":4,"repro":4,"repro-lect":4,"poultry":4,"exotic":4,"practrum":4,"cliapprum":4,"engprof":4,"com1":4,"com2":4,"surg1":4,"swine-herd":4,"swine-repro":4,"vet-imaging":4,"food-safety-y4":4,"vet-juris":4,"engprof1":4,"herd-health-rum":4,"epidemiology":5,"aquatic-clinic":5,"avian-medicine":5,"poa-clinical":5,"milk-meat-hygiene":5,"one-health":5,"food-industry":5,"equine-medicine":5,"equine-repro":5,"zoonoses":5,"swine-clinic":5,"vca":5,"rec-adv-bioscience":5,"ruminant-clinical":5,"comp-repro-clinic":5,"livestock-pathology":5,"preclinic-orientation":5,"rotation-small-animal":6,"rotation-surgery-anesth":6,"rotation-livestock-farm":6,"rotation-aquatic-wildlife":6,"rotation-vph-extern":6,"rotation-imaging-pathlab":6,"senior-project":6}$vmx_history_year_map$::jsonb;
  mapped jsonb;
begin
  if jsonb_typeof(item) <> 'object' then return item; end if;
  mapped := id_map->((item->>'subject')||':'||(private.user_data_canonical_json(item->'questionId')#>>'{}'));
  if mapped is not null then item := jsonb_set(item,'{questionId}',mapped); end if;
  if not(item ? 'year') then
    item := item || jsonb_build_object('year',coalesce(year_map->(item->>'subject'),'null'::jsonb),
      'phase',coalesce(item->'phase','null'::jsonb));
  end if;
  return item;
end;
$$;
revoke all on function private.normalize_user_history_item(jsonb) from public, anon, authenticated;

create or replace function private.user_data_item_key(item jsonb)
returns text language sql immutable set search_path = pg_catalog as $$
  select case
    when jsonb_typeof(item) = 'object' and item ? 'id' then 'id:' || coalesce(private.user_data_canonical_json(item->'id')#>>'{}','null')
    when jsonb_typeof(item) = 'object' and item ? 'questionId' and item ? 'date'
      then 'history:' || coalesce(private.user_data_canonical_json(item->'date')#>>'{}','null') || ':' || coalesce(item->>'subject','') || ':' || coalesce(private.user_data_canonical_json(item->'questionId')#>>'{}','null')
    else 'json:' || private.user_data_canonical_json(item)::text end;
$$;
revoke all on function private.user_data_item_key(jsonb) from public, anon, authenticated;

create or replace function private.user_data_normalize_key(key text)
returns text language plpgsql immutable set search_path = pg_catalog as $$
declare item jsonb; normalized jsonb; subject_id text; question_id text;
begin
  if left(key,5) = 'json:' then
    item := substring(key from 6)::jsonb;
    if jsonb_typeof(item)='object' and item ? 'questionId' then item := private.normalize_user_history_item(item); end if;
    return private.user_data_item_key(item);
  end if;
  if left(key,8) = 'history:' then
    subject_id := split_part(key,':',-2); question_id := split_part(key,':',-1);
    normalized := private.normalize_user_history_item(jsonb_build_object('subject',subject_id,'questionId',question_id));
    return left(key,length(key)-length(question_id)) || (normalized->>'questionId');
  end if;
  return key;
end;
$$;
revoke all on function private.user_data_normalize_key(text) from public, anon, authenticated;

create or replace function public.sync_user_data_v2(p_operations jsonb)
returns jsonb language plpgsql security definer set search_path = pg_catalog as $$
declare
  uid uuid := auth.uid();
  row_data public.user_data%rowtype;
  op jsonb; change_record record; mutation jsonb; changes jsonb;
  field_name text; delta jsonb; values_now jsonb; mutations jsonb;
  array_puts jsonb; array_updates jsonb; array_removed text[];
  key_name text; raw_key text; item jsonb; stamp jsonb;
  op_id uuid; cancel_id uuid; op_clock bigint; payload_hash text; saved_hash text;
  op_conflicts jsonb; saved_conflicts jsonb;
  all_conflicts jsonb := '[]'::jsonb; acknowledged jsonb := '[]'::jsonb;
  dirty boolean := false; deleting boolean; is_create boolean;
begin
  if uid is null then raise exception using errcode='42501', message='Authentication required'; end if;
  if p_operations is null or jsonb_typeof(p_operations) <> 'array'
    or jsonb_array_length(p_operations) > 200 or octet_length(p_operations::text) > 8388608 then
    raise exception using errcode='22023', message='Invalid sync operation batch';
  end if;
  if (select coalesce(sum(jsonb_array_length(case when jsonb_typeof(value->'cancel')='array'
    then value->'cancel' else '[]'::jsonb end)),0) from jsonb_array_elements(p_operations)) > 10000 then
    raise exception using errcode='22023', message='Too many cancellation IDs';
  end if;
  -- The FK rejects a vanished principal; the row lock serializes independent devices.
  insert into public.user_data(user_id) values(uid) on conflict(user_id) do nothing;
  select * into strict row_data from public.user_data where user_id=uid for update;
  if row_data.sync_version <> 2 then
    select coalesce(jsonb_agg(private.normalize_user_history_item(value) order by n),'[]'::jsonb)
      into row_data.history from jsonb_array_elements(coalesce(row_data.history,'[]'::jsonb)) with ordinality t(value,n);
    row_data.sync_version := 2; dirty := true;
  end if;

  for op in select value from jsonb_array_elements(p_operations)
    order by (value->>'clock')::numeric, value->>'id'
  loop
    if jsonb_typeof(op) <> 'object' or not(op ?& array['id','clock','changes'])
      or exists(select 1 from jsonb_object_keys(op) k where k not in ('id','clock','changes','cancel'))
      or jsonb_typeof(op->'id') <> 'string' or jsonb_typeof(op->'clock') <> 'number'
      or (op->>'clock')::numeric < 0 or (op->>'clock')::numeric > 9007199254740991
      or (op->>'clock')::numeric <> trunc((op->>'clock')::numeric)
      or jsonb_typeof(op->'changes') <> 'object' then
      raise exception using errcode='22023', message='Invalid sync operation';
    end if;
    op_id := (op->>'id')::uuid; op_clock := (op->>'clock')::bigint;
    payload_hash := encode(sha256(convert_to(op::text,'UTF8')),'hex');
    select r.payload_hash,r.conflicts into saved_hash,saved_conflicts
      from private.user_data_sync_receipts r where r.user_id=uid and r.operation_id=op_id;
    if found then
      if saved_hash <> 'cancelled' and saved_hash <> payload_hash then raise exception using errcode='22023', message='Sync operation ID reused with different content'; end if;
      acknowledged := acknowledged || jsonb_build_array(op_id::text);
      all_conflicts := all_conflicts || saved_conflicts;
      continue;
    end if;
    if op ? 'cancel' then
      if jsonb_typeof(op->'cancel') <> 'array' or jsonb_array_length(op->'cancel') > 200
        or exists(select 1 from jsonb_array_elements(op->'cancel') x where jsonb_typeof(x) <> 'string') then
        raise exception using errcode='22023', message='Invalid cancellation IDs';
      end if;
      for cancel_id in select value::uuid from jsonb_array_elements_text(op->'cancel') loop
        if cancel_id=op_id then raise exception using errcode='22023', message='Operation cannot cancel itself'; end if;
        insert into private.user_data_sync_receipts(user_id,operation_id,payload_hash)
          values(uid,cancel_id,'cancelled') on conflict(user_id,operation_id) do nothing;
      end loop;
    end if;
    op_conflicts := '[]'::jsonb;
    for change_record in select * from jsonb_each(op->'changes') loop
      field_name := change_record.key; delta := change_record.value;
      if field_name not in ('notes','sr_cards','reading_checklist','bookmarks','history','custom_questions','streak_data')
        or jsonb_typeof(delta) <> 'object' then
        raise exception using errcode='22023', message='Invalid sync field';
      end if;
      mutations := '[]'::jsonb;
      if field_name = 'streak_data' then
        if jsonb_typeof(delta->'value') is distinct from 'object'
          or exists(select 1 from jsonb_object_keys(delta) k where k <> 'value') then
          raise exception using errcode='22023', message='Invalid streak delta';
        end if;
        mutations := jsonb_build_array(jsonb_build_object('key','value','value',delta->'value','remove',false));
      else
        if jsonb_typeof(delta->'remove') is distinct from 'array'
          or exists(select 1 from jsonb_array_elements(delta->'remove') x where jsonb_typeof(x) <> 'string') then
          raise exception using errcode='22023', message='Invalid removed keys';
        end if;
        if field_name in ('notes','sr_cards','reading_checklist') then
          if jsonb_typeof(delta->'set') is distinct from 'object'
            or exists(select 1 from jsonb_object_keys(delta) k where k not in ('set','remove')) then
            raise exception using errcode='22023', message='Invalid map delta';
          end if;
          for key_name,item in select * from jsonb_each(delta->'set') loop
            mutations := mutations || jsonb_build_array(jsonb_build_object('key',key_name,'value',item,'remove',false));
          end loop;
        else
          if jsonb_typeof(delta->'put') is distinct from 'array'
            or exists(select 1 from jsonb_object_keys(delta) k where k not in ('put','remove','created'))
            or (delta ? 'created' and (field_name <> 'custom_questions' or jsonb_typeof(delta->'created') <> 'array')) then
            raise exception using errcode='22023', message='Invalid array delta';
          end if;
          if (select count(*) from jsonb_array_elements(delta->'put')) <>
            (select count(distinct private.user_data_item_key(case when field_name='history'
              then private.normalize_user_history_item(value) else value end)) from jsonb_array_elements(delta->'put')) then
            raise exception using errcode='22023', message='Duplicate array identities';
          end if;
          if delta ? 'created' then
            if exists(select 1 from jsonb_array_elements(delta->'created') x where jsonb_typeof(x) <> 'string')
              or (select count(*) from jsonb_array_elements(delta->'created')) <>
                 (select count(distinct value) from jsonb_array_elements_text(delta->'created'))
              or exists(select 1 from jsonb_array_elements_text(delta->'created') k where not exists
                (select 1 from jsonb_array_elements(delta->'put') x where private.user_data_item_key(x)=k)) then
              raise exception using errcode='22023', message='Invalid created identities';
            end if;
          end if;
          for item in select value from jsonb_array_elements(delta->'put') loop
            if field_name='history' then item := private.normalize_user_history_item(item); end if;
            key_name := private.user_data_item_key(item);
            if field_name = 'bookmarks' and jsonb_typeof(item) not in ('string','number') then
              raise exception using errcode='22023', message='Invalid bookmark';
            end if;
            if field_name in ('history','custom_questions') and jsonb_typeof(item) <> 'object' then
              raise exception using errcode='22023', message='Invalid study record';
            end if;
            if field_name = 'custom_questions' and (not(item ? 'id') or jsonb_typeof(item->'id') not in ('number','string')) then
              raise exception using errcode='22023', message='Invalid question identity';
            end if;
            mutations := mutations || jsonb_build_array(jsonb_build_object('key',key_name,'value',item,'remove',false,
              'created',coalesce(delta->'created' ? key_name,false)));
          end loop;
        end if;
        for raw_key in select jsonb_array_elements_text(delta->'remove') loop
          key_name := case when field_name in ('notes','sr_cards','reading_checklist') then raw_key else private.user_data_normalize_key(raw_key) end;
          if exists(select 1 from jsonb_array_elements(mutations) x where x->>'key'=key_name) then
            raise exception using errcode='22023', message='Overlapping sync delta';
          end if;
          mutations := mutations || jsonb_build_array(jsonb_build_object('key',key_name,'remove',true));
        end loop;
      end if;
      values_now := to_jsonb(row_data)->field_name;
      array_puts := '[]'::jsonb; array_updates := '{}'::jsonb; array_removed := array[]::text[];
      if field_name in ('bookmarks','history','custom_questions') then values_now := coalesce(nullif(values_now,'null'::jsonb),'[]'::jsonb);
      else values_now := coalesce(nullif(values_now,'null'::jsonb),'{}'::jsonb); end if;
      row_data.sync_stamps := jsonb_set(row_data.sync_stamps,array[field_name],coalesce(row_data.sync_stamps->field_name,'{}'::jsonb),true);
      for mutation in select value from jsonb_array_elements(mutations) loop
        key_name := mutation->>'key'; deleting := (mutation->>'remove')::boolean;
        if key_name is null or length(key_name)>4096 or key_name in ('__proto__','constructor','prototype') then
          raise exception using errcode='22023', message='Invalid sync key';
        end if;
        stamp := row_data.sync_stamps->field_name->key_name;
        if stamp is not null and ((stamp->>0)::bigint > op_clock or
          ((stamp->>0)::bigint = op_clock and (stamp->>1) >= op_id::text)) then
          op_conflicts := op_conflicts || jsonb_build_array(jsonb_build_object('id',op_id::text,'field',field_name,'key',key_name));
          continue;
        end if;
        if field_name='custom_questions' and coalesce((mutation->>'created')::boolean,false) then
          if exists(select 1 from jsonb_array_elements(values_now) x where private.user_data_item_key(x)=key_name and x <> mutation->'value')
            or (not exists(select 1 from jsonb_array_elements(values_now) x where private.user_data_item_key(x)=key_name) and (
              row_data.sync_stamps->'custom_questions' ? key_name
              or exists(select 1 from jsonb_array_elements(coalesce(row_data.history,'[]'::jsonb)) x where private.user_data_canonical_json(x->'questionId')#>>'{}'=substring(key_name from 4))
              or exists(select 1 from jsonb_each(coalesce(row_data.sr_cards,'{}'::jsonb)) t(k,v)
                where k=substring(key_name from 4) or private.user_data_canonical_json(v->'questionId')#>>'{}'=substring(key_name from 4))
              or exists(select 1 from jsonb_object_keys(coalesce(row_data.notes,'{}'::jsonb)) k where k=substring(key_name from 4) or right(k,length(substring(key_name from 4))+1)=':'||(substring(key_name from 4)))
              or exists(select 1 from jsonb_array_elements(private.user_data_canonical_json(coalesce(row_data.bookmarks,'[]'::jsonb))) t(v)
                where v#>>'{}'=substring(key_name from 4) or right(v#>>'{}',length(substring(key_name from 4))+1)=':'||(substring(key_name from 4)))
            )) then
            raise exception using errcode='22023', message='VMX_CUSTOM_ID_CONFLICT';
          end if;
        end if;
        if field_name in ('bookmarks','history','custom_questions') then
          if deleting then array_removed := array_append(array_removed,key_name);
          else
            array_updates := jsonb_set(array_updates,array[key_name],mutation->'value',true);
            array_puts := array_puts || jsonb_build_array(mutation->'value');
          end if;
        elsif field_name='streak_data' then values_now := mutation->'value';
        elsif deleting then values_now := values_now-key_name;
        else values_now := jsonb_set(values_now,array[key_name],mutation->'value',true); end if;
        row_data.sync_stamps := jsonb_set(row_data.sync_stamps,array[field_name,key_name],jsonb_build_array(op_clock,op_id::text),true);
      end loop;
      if field_name in ('bookmarks','history','custom_questions') then
        -- One scan retains existing order and appends new identities in authored
        -- order. Rescanning the whole history once per imported item is quadratic.
        with old_items as materialized (
          select x,n,private.user_data_item_key(x) as key from jsonb_array_elements(values_now) with ordinality t(x,n)
        )
        select (select coalesce(jsonb_agg(coalesce(array_updates->key,x) order by n),'[]'::jsonb)
                  from old_items where not(key=any(array_removed)))
          || (select coalesce(jsonb_agg(x order by n),'[]'::jsonb)
                from jsonb_array_elements(array_puts) with ordinality t(x,n)
                where not exists(select 1 from old_items o where o.key=private.user_data_item_key(t.x)))
          into values_now;
      end if;
      row_data := jsonb_populate_record(row_data,jsonb_build_object(field_name,values_now));
    end loop;
    insert into private.user_data_sync_receipts(user_id,operation_id,payload_hash,conflicts)
      values(uid,op_id,payload_hash,op_conflicts);
    row_data.sync_clock := greatest(row_data.sync_clock,op_clock);
    dirty := true;
    acknowledged := acknowledged || jsonb_build_array(op_id::text);
    all_conflicts := all_conflicts || op_conflicts;
  end loop;
  if octet_length(to_jsonb(row_data)::text) > 33554432 then
    raise exception using errcode='22023', message='Study data exceeds sync size limit';
  end if;
  if dirty then
    update public.user_data set notes=row_data.notes,sr_cards=row_data.sr_cards,
      reading_checklist=row_data.reading_checklist,bookmarks=row_data.bookmarks,
      history=row_data.history,custom_questions=row_data.custom_questions,streak_data=row_data.streak_data,
      sync_version=2,sync_revision=sync_revision+1,sync_clock=row_data.sync_clock,
      sync_stamps=row_data.sync_stamps,updated_at=clock_timestamp()
      where user_id=uid returning * into row_data;
  end if;
  return jsonb_build_object('row',to_jsonb(row_data),'acknowledged',acknowledged,'conflicts',all_conflicts);
end;
$$;
revoke all on function public.sync_user_data_v2(jsonb) from public, anon;
grant execute on function public.sync_user_data_v2(jsonb) to authenticated;
