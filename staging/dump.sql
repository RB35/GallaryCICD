--
-- PostgreSQL database dump
--

\restrict 1lQPOWBAzPlf2rwAaWxrQy6qXQSZvagXoe1V45531WN3gzN6GXcOgS3enXYRaJh

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'curator',
    'staff',
    'member'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint,
    name text,
    applied_at timestamp with time zone DEFAULT now()
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: artwork; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artwork (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    creator character varying(255) NOT NULL,
    description character varying(1000) NOT NULL,
    media character varying(255) NOT NULL,
    "managedBy" integer CONSTRAINT "artwork_addedBy_not_null" NOT NULL,
    added timestamp without time zone DEFAULT now() NOT NULL,
    "imageUrl" character varying(500),
    "onDisplay" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.artwork OWNER TO postgres;

--
-- Name: artwork_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.artwork ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.artwork_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "time" timestamp without time zone NOT NULL,
    "createdDate" timestamp without time zone DEFAULT now() NOT NULL,
    notes character varying(500) NOT NULL
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.bookings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lands (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(1000),
    polygon public.geometry(Polygon,4326) NOT NULL,
    "createdDate" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lands OWNER TO postgres;

--
-- Name: lands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lands ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "passwordHash" character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    "createdDate" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at, name, applied_at) FROM stdin;
1	ce53b67ab1edbf713dd5f75400cb71d88323615fdebb02e421acd862a7c8b0de	1780580877881	20260604134757_wooden_paper_doll	\N
2	c7bb6d51619fd330275fbeec99faa5671d63983523ee5a661724ed46010cffd2	1780726448000	20260606061408_premium_owl	2026-06-06 16:16:21.757779+10
3	9674b3eb0ba4f1ba5a69aa52b0e7e2efe13cf2459f02232d3d514f5140afc084	1780761755000	20260606160235_equal_black_cat	2026-06-07 02:04:23.921028+10
4	b13c6e753c217b563bc47ea21f18c817afc3ec68a428099f571295b37164dd7b	1780761816000	20260606160336_talented_odin	2026-06-07 02:04:23.921028+10
5	033a7dcf9ee14392f719e7cc8cfaab70cf1fa6a458256f90f869858c66bfd0e6	1780801897000	20260607031137_first_thor_girl	2026-06-07 13:12:06.855479+10
6	ad6e5bf99c9a849ca202cd0dda33410bed2d6e363b1159cd8f5d27186b6e2635	1780814558000	20260607064238_jittery_hobgoblin	2026-06-07 16:43:02.955095+10
7	2b5ea29a58f8e7cd1d641bf6da70cc971e76ecb34570967ddee7a4bc567ef257	1780830409000	20260607110649_worthless_the_hand	2026-06-07 21:13:07.370346+10
8	976b722461518abdb1df08f28337607439d5d271a9d1276c69c194d56b488246	1780920345000	20260608120545_sharp_zuras	2026-06-08 22:06:02.844715+10
9	007c94806519d5875e91d13f9aa7583d944269239c805ea42d43253467573425	1780990218000	20260609073018_sharp_vengeance	2026-06-09 17:30:24.974081+10
\.


--
-- Data for Name: artwork; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artwork (id, title, creator, description, media, "managedBy", added, "imageUrl", "onDisplay") FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, "userId", "time", "createdDate", notes) FROM stdin;
1	2	2026-08-24 14:30:00	2026-06-09 17:13:07.40955	Booked over the phone - rescheduled
4	3	2025-06-11 09:30:00	2026-06-09 19:02:31.788822	Moved one day forward
5	3	2026-08-22 14:30:00	2026-06-09 19:16:29.172585	Booked over the phone
\.


--
-- Data for Name: lands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lands (id, name, description, polygon, "createdDate") FROM stdin;
2	Test - Wow	Example description	0103000020E61000000100000006000000AFDB56694115624011E50B5A480E42C0593508737B37624073C982D3CCFD41C099C57A59493A62402E97E8876C1E42C00DCBFA287E1362400339CDA7333A42C0B94D5D9E330C624067C6EC7607F941C0AFDB56694115624011E50B5A480E42C0	2026-06-09 02:10:28.567342
4	Test - Wow	Example description	0103000020E61000000100000006000000AFDB56694115624011E50B5A480E42C0593508737B37624073C982D3CCFD41C099C57A59493A62402E97E8876C1E42C00DCBFA287E1362400339CDA7333A42C0B94D5D9E330C624067C6EC7607F941C0AFDB56694115624011E50B5A480E42C0	2026-10-03 21:41:14.195682
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", email, "passwordHash", role, "createdDate") FROM stdin;
2	Riley	Brown	riley@rileybrownprojects.com	$argon2id$v=19$m=65536,t=3,p=4$Bk++G8pRYEdbxyY5NcQrKw$F21tlvY/dveNqtV1HSJ1KWvKHAPRPI3I/C4k3X3yTzY	admin	2026-06-08 22:06:41.748006
3	Josh	Doe	john@rileybrownprojects.com	$argon2id$v=19$m=65536,t=3,p=4$WxXVq8qKaBDTbsHvtbZRdg$y3MRXNFsKbVnZw2TsQsBZ3ZXkrMZ7UpU06gHM62XqKM	member	2026-06-09 18:54:06.901739
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 9, true);


--
-- Name: artwork_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.artwork_id_seq', 22, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 11, true);


--
-- Name: lands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lands_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 92, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: artwork artwork_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artwork
    ADD CONSTRAINT artwork_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: lands lands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lands
    ADD CONSTRAINT lands_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: artwork artwork_addedBy_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artwork
    ADD CONSTRAINT "artwork_addedBy_users_id_fk" FOREIGN KEY ("managedBy") REFERENCES public.users(id);


--
-- Name: bookings bookings_userId_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "bookings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 1lQPOWBAzPlf2rwAaWxrQy6qXQSZvagXoe1V45531WN3gzN6GXcOgS3enXYRaJh

