create table terrorism(
    event_id integer,
    iyear integer,
    imonth integer,
    iday integer,
    country_id integer,
    country text,
    region_id integer,
    region text,
    city text,
    latitude real,
    longitude real,
    summary text,
    success boolean,
    suicide boolean,
    attacktype_id integer,
    attacktype text,
    targtype1 integer,
    targtype1_txt text,
    targsubtype1 integer,
    targsubtype1_txt text,
    corp1 text,
    target1 text,
    natlty1 integer,
    natlty1_txt text,
    targtype2 integer,
    targtype2_txt text,
    targsubtype2 integer,
    targsubtype2_txt text,
    corp2 text,
    target2 text,
    natlty2 integer,
    natlty2_txt text,
    targtype3 integer,
    targtype3_txt text,
    targsubtype3 integer,
    targsubtype3_txt text,
    corp3 text,
    target3 text,
    natlty3 integer,
    natlty3_txt text,
    gname text,
    motive text,
    weaptype1 integer,
    weaptype1_txt text,
    weapsubtype1 integer,
    weapsubtype1_txt text,
    weapdetail text,
    nkill integer,
    nwound numeric(7,3),
    property integer,
    propvalue real,
    propcomment text
)

--The table above is the dummy table, we will use it to create all the tables that we need

--after creating it, create a table in postgresql and run this command in the terminal:
        -- \copy table_name FROM 'file_path' WITH (FORMAT CSV,  HEADER true, DELIMITER ',')

        --file path is the .csv file from the repo
--test
select * from terrorism where country = 'Romania';
select * from terrorism where iyear=1970;
select * from terrorism where event_id = 123;
--THE PRIMARY KEY IS THE ID ONLY => THE TABLE IS IN 2NF

--3NF NORMALIZATION:

    -- DEPENDENCIES

    -- event_id -> (iyear, imonth, iday, country_id, region_id, city, latitude, longitude,
    --  summary, success, suicide, attacktype_id, targtype1, targsubtype1, 
    -- corp1, target1, 
    -- natlty1, targtype2, targsubtype2, corp2, target2, natlty2, targtype3, targsubtype3, corp3, 
    -- target3, natlty3, gname, motive, weaptype1, weapsubtype1, weapdetail, nkill, nwound, property,
    --  propvalue, propcomment)
    --     The event_id uniquely determines all other attributes in the table.

    -- country_id -> country
    --     The country_id uniquely determines the country attribute.

       -- natlty[1,2,3] -> natlty[1,2,3]_txt
    --     The natlty1 uniquely determines the natlty1_txt attribute.

    create table countries(
        id integer,
        country text,
        PRIMARY KEY (id)
    );

    insert into countries  
        select distinct * from 
                (select distinct country_id, country from terrorism
                    where country_id is not null
            UNION
                select distinct natlty1, natlty1_txt from terrorism
                    where natlty1 is not null
            UNION
                select distinct natlty2, natlty2_txt from terrorism
                    where natlty2 is not null
            UNION
                select distinct natlty3, natlty3_txt from terrorism
                    where natlty3 is not null
            )sub;


    -- region_id -> region
    --     The region_id uniquely determines the region attribute.

    create table regions(
        id integer,
        region text,
        primary key (id) 
    )
    insert into regions select distinct region_id, region from terrorism;

    -- attacktype_id -> attacktype
    --     The attacktype_id uniquely determines the attacktype attribute.
    create table attacktypes(
        id integer,
        attacktype text,
        primary key (id)
    )
    insert into attacktypes select distinct attacktype_id, attacktype from terrorism;


    -- targtype1 -> targtype1_txt
    --     The targtype1 uniquely determines the targtype1_txt attribute.
    -- targtype2 -> targtype2_txt
    --     The targtype2 uniquely determines the targtype2_txt attribute.
    -- targtype3 -> targtype3_txt
    --     The targtype3 uniquely determines the targtype3_txt attribute.
    
    create table targtypes(
        id integer,
        targtype text,
        primary key (id)
    )
    select * from targtypes;

    insert into targtypes  
    select distinct * from 
            (select distinct targtype1, targtype1_txt from terrorism
                where targtype1 is not null
        UNION
            select distinct targtype2, targtype2_txt from terrorism
                where targtype2 is not null
        UNION
            select distinct targtype3, targtype3_txt from terrorism
                where targtype3 is not null
        )sub;


    
    -- targsubtype1 -> targsubtype1_txt
    --     The targsubtype1 uniquely determines the targsubtype1_txt attribute.
    -- targsubtype2 -> targsubtype2_txt
    --     The targsubtype2 uniquely determines the targsubtype2_txt attribute.
    -- targsubtype3 -> targsubtype3_txt
    --     The targsubtype3 uniquely determines the targsubtype3_txt attribute.


    create table targsubtypes(
        id integer,
        targsubtype text,
        primary key (id)
    )

        insert into targsubtypes  
        select distinct * from 
            (select distinct targsubtype1, targsubtype1_txt from terrorism
                where targsubtype1 is not null
            UNION
            select distinct targsubtype2, targsubtype2_txt from terrorism
                where targsubtype2 is not null
            UNION
            select distinct targsubtype3, targsubtype3_txt from terrorism
                where targsubtype3 is not null
        )sub;


    -- weaptype1 -> weaptype1_txt
    --     The weaptype1 uniquely determines the weaptype1_txt attribute.
        create table weapon_types(
            id integer,
            weapon_type text,
            primary key (id)
        )
        insert into weapon_types
            select distinct weaptype1, weaptype1_txt from terrorism;

    -- weapsubtype1 -> weapsubtype1_txt
    --     The weapsubtype1 uniquely determines the weapsubtype1_txt attribute.

        create table weapons(
            id integer,
            weapon text,
            primary key (id)
        )

        insert into weapons
            select distinct weapsubtype1, weapsubtype1_txt from terrorism
            where weapsubtype1 is not null;


--MAIN TABLE:
select organization, killed, date, motive from attacks join countries on country_id = countries.id
where country = 'Romania';

select organization, success, suicide, summary, killed, property, property_comment, wounded from attacks join countries on country_id = countries.id
where country = 'Romania';

select  weapon_type, weapon, weapon_detail, organization from attacks 
join countries on country_id = countries.id
join weapon_types on weapon_types.id = weapon_type_id
join weapons on weapons.id = weapon_id
where country = 'Romania';



create table attacks(
    id integer,
    date Date,
    country_id integer,
    region_id integer,
    city text,
    latitude real,
    longitude real,
    summary text,
    success boolean,
    suicide boolean,
    attacktype_id integer,
    organization text, 
    motive text,
    weapon_type_id integer,
    weapon_id integer,
    weapon_detail text,
    killed integer,
    wounded numeric(7,3),
    property integer,
    property_value real,
    property_comment text,
    primary key (id)
);
select * from attacks where id = 125;
insert into attacks  
    select event_id, TO_DATE(CONCAT(iyear, '-', imonth, '-', iday), 'YYYY-MM-DD'),
    country_id, region_id, city, latitude, longitude, summary, success,
    suicide, attacktype_id, gname, motive, weaptype1, weapsubtype1,
    weapdetail, nkill, nwound, property, propvalue, propcomment
    from terrorism;

create table victims( 
    id serial PRIMARY key,
    target_id integer not null,
    target_subtype_id integer,
    corp text,
    victim text,
    ntlty_id integer,
    attack_id integer
) 



insert into victims (target_id, target_subtype_id, corp, victim, ntlty_id, attack_id)
    select targtype1, targsubtype1, corp1, target1, natlty1, event_id
    from terrorism where targtype1 is not null; 

insert into victims (target_id, target_subtype_id, corp, victim, ntlty_id, attack_id)
    select targtype2, targsubtype2, corp2, target2, natlty2, event_id
    from terrorism where targtype2 is not null;

insert into victims (target_id, target_subtype_id, corp, victim, ntlty_id, attack_id)
    select targtype3, targsubtype3, corp3, target3, natlty3, event_id
    from terrorism where targtype3 is not null;

--test
select attacks.id, date, organization, victim from attacks join victims on 
                            attacks.id = victims.attack_id where attacks.id=586;


-- REFERENTIAL INTEGRITY

    --VICTIMS AND ATTACKS : MANY TO ONE 
    --when an attack is deleted, the rows from 'victims' are also deleted
    alter table victims
    add constraint victimRefAttack
        foreign key (attack_id) references attacks (id) 
                                on delete cascade;
                                
    --test
    begin;
    select * from victims where attack_id = 586;
    delete from attacks where id = 586;
    select * from victims where attack_id = 586;
    rollback;
    commit;


    --when a country is deleted, all the attacks with that country_id from 'attacks' will be set to null correspondingly
   
        DROP FUNCTION country_trigger_function();
        drop trigger country_trigger on countries;

    CREATE OR REPLACE FUNCTION country_trigger_function() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
        AS $$
    DECLARE
        v_id int;
    BEGIN
        select old.id into v_id from countries;
        update attacks
        set country_id = null
        where country_id = v_id;
        --also delete victims nationality
        update victims
        set ntlty_id = null
        where ntlty_id = v_id;
        return new;
    END;
    $$


    create trigger country_trigger 
    after delete on countries
    for each row execute procedure country_trigger_function();

    
    


        --when a subtargtype is deleted, the victims  with that subtarget id will have null value
        -- DROP FUNCTION victims_trigger_function();
        -- drop trigger victims_trigger on targsubtypes;

    CREATE OR REPLACE FUNCTION victims_trigger_function() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
        AS $$
    DECLARE
        v_id int;
    BEGIN
        select old.id into v_id from targsubtypes;
        update victims
        set target_subtype_id = null
        where target_subtype_id = v_id;
        return new;

 
    END;
    $$


    create trigger victims_trigger 
    after delete on targsubtypes
    for each row execute procedure victims_trigger_function();

    --test
    begin;
    -- SELECT * from victims where target_subtype_id = 11;

    delete from targsubtypes where id = 11;

    SELECT * from victims where target_subtype_id = 11;
    rollback;
    commit;

CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role INTEGER
      );
