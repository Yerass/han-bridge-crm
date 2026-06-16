--
-- PostgreSQL database dump
--

\restrict r8SEWlbEJ8qbVsu2Dr5ftdVB453VTH1A2MhvyjHGGzlndWrqj5SF6tegUiiaLQW

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Transaction" DROP CONSTRAINT IF EXISTS "Transaction_campaignId_fkey";
ALTER TABLE IF EXISTS ONLY public."Teacher" DROP CONSTRAINT IF EXISTS "Teacher_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Student" DROP CONSTRAINT IF EXISTS "Student_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Student" DROP CONSTRAINT IF EXISTS "Student_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."ScheduleSlot" DROP CONSTRAINT IF EXISTS "ScheduleSlot_groupId_fkey";
ALTER TABLE IF EXISTS ONLY public."ScheduleSlot" DROP CONSTRAINT IF EXISTS "ScheduleSlot_classroomId_fkey";
ALTER TABLE IF EXISTS ONLY public."Payroll" DROP CONSTRAINT IF EXISTS "Payroll_teacherId_fkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_studentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Note" DROP CONSTRAINT IF EXISTS "Note_studentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Note" DROP CONSTRAINT IF EXISTS "Note_leadId_fkey";
ALTER TABLE IF EXISTS ONLY public."Note" DROP CONSTRAINT IF EXISTS "Note_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Lesson" DROP CONSTRAINT IF EXISTS "Lesson_teacherId_fkey";
ALTER TABLE IF EXISTS ONLY public."Lesson" DROP CONSTRAINT IF EXISTS "Lesson_groupId_fkey";
ALTER TABLE IF EXISTS ONLY public."Lesson" DROP CONSTRAINT IF EXISTS "Lesson_classroomId_fkey";
ALTER TABLE IF EXISTS ONLY public."Lead" DROP CONSTRAINT IF EXISTS "Lead_studentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Lead" DROP CONSTRAINT IF EXISTS "Lead_campaignId_fkey";
ALTER TABLE IF EXISTS ONLY public."Group" DROP CONSTRAINT IF EXISTS "Group_teacherId_fkey";
ALTER TABLE IF EXISTS ONLY public."Group" DROP CONSTRAINT IF EXISTS "Group_classroomId_fkey";
ALTER TABLE IF EXISTS ONLY public."GroupStudent" DROP CONSTRAINT IF EXISTS "GroupStudent_studentId_fkey";
ALTER TABLE IF EXISTS ONLY public."GroupStudent" DROP CONSTRAINT IF EXISTS "GroupStudent_groupId_fkey";
ALTER TABLE IF EXISTS ONLY public."Document" DROP CONSTRAINT IF EXISTS "Document_studentId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Attendance" DROP CONSTRAINT IF EXISTS "Attendance_studentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Attendance" DROP CONSTRAINT IF EXISTS "Attendance_lessonId_fkey";
DROP INDEX IF EXISTS public."User_role_idx";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Transaction_type_idx";
DROP INDEX IF EXISTS public."Transaction_date_idx";
DROP INDEX IF EXISTS public."Transaction_category_idx";
DROP INDEX IF EXISTS public."Teacher_userId_key";
DROP INDEX IF EXISTS public."Student_userId_key";
DROP INDEX IF EXISTS public."Student_status_idx";
DROP INDEX IF EXISTS public."Student_language_idx";
DROP INDEX IF EXISTS public."ScheduleSlot_weekday_idx";
DROP INDEX IF EXISTS public."ScheduleSlot_groupId_idx";
DROP INDEX IF EXISTS public."Payroll_teacherId_periodMonth_periodYear_key";
DROP INDEX IF EXISTS public."Payroll_periodYear_periodMonth_idx";
DROP INDEX IF EXISTS public."Payment_studentId_idx";
DROP INDEX IF EXISTS public."Payment_status_idx";
DROP INDEX IF EXISTS public."Payment_paidAt_idx";
DROP INDEX IF EXISTS public."Notification_type_idx";
DROP INDEX IF EXISTS public."Notification_status_idx";
DROP INDEX IF EXISTS public."Note_studentId_idx";
DROP INDEX IF EXISTS public."Note_leadId_idx";
DROP INDEX IF EXISTS public."MarketingCampaign_channel_idx";
DROP INDEX IF EXISTS public."Lesson_teacherId_idx";
DROP INDEX IF EXISTS public."Lesson_status_idx";
DROP INDEX IF EXISTS public."Lesson_groupId_idx";
DROP INDEX IF EXISTS public."Lesson_date_idx";
DROP INDEX IF EXISTS public."Lead_studentId_key";
DROP INDEX IF EXISTS public."Lead_stage_idx";
DROP INDEX IF EXISTS public."Lead_source_idx";
DROP INDEX IF EXISTS public."Lead_managerId_idx";
DROP INDEX IF EXISTS public."Group_teacherId_idx";
DROP INDEX IF EXISTS public."Group_language_idx";
DROP INDEX IF EXISTS public."GroupStudent_studentId_idx";
DROP INDEX IF EXISTS public."GroupStudent_groupId_studentId_key";
DROP INDEX IF EXISTS public."Classroom_name_key";
DROP INDEX IF EXISTS public."AuditLog_userId_idx";
DROP INDEX IF EXISTS public."AuditLog_entity_idx";
DROP INDEX IF EXISTS public."AuditLog_createdAt_idx";
DROP INDEX IF EXISTS public."Attendance_studentId_idx";
DROP INDEX IF EXISTS public."Attendance_lessonId_studentId_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Transaction" DROP CONSTRAINT IF EXISTS "Transaction_pkey";
ALTER TABLE IF EXISTS ONLY public."Teacher" DROP CONSTRAINT IF EXISTS "Teacher_pkey";
ALTER TABLE IF EXISTS ONLY public."Student" DROP CONSTRAINT IF EXISTS "Student_pkey";
ALTER TABLE IF EXISTS ONLY public."ScheduleSlot" DROP CONSTRAINT IF EXISTS "ScheduleSlot_pkey";
ALTER TABLE IF EXISTS ONLY public."Payroll" DROP CONSTRAINT IF EXISTS "Payroll_pkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_pkey";
ALTER TABLE IF EXISTS ONLY public."Parent" DROP CONSTRAINT IF EXISTS "Parent_pkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_pkey";
ALTER TABLE IF EXISTS ONLY public."Note" DROP CONSTRAINT IF EXISTS "Note_pkey";
ALTER TABLE IF EXISTS ONLY public."MarketingCampaign" DROP CONSTRAINT IF EXISTS "MarketingCampaign_pkey";
ALTER TABLE IF EXISTS ONLY public."Lesson" DROP CONSTRAINT IF EXISTS "Lesson_pkey";
ALTER TABLE IF EXISTS ONLY public."Lead" DROP CONSTRAINT IF EXISTS "Lead_pkey";
ALTER TABLE IF EXISTS ONLY public."Group" DROP CONSTRAINT IF EXISTS "Group_pkey";
ALTER TABLE IF EXISTS ONLY public."GroupStudent" DROP CONSTRAINT IF EXISTS "GroupStudent_pkey";
ALTER TABLE IF EXISTS ONLY public."Document" DROP CONSTRAINT IF EXISTS "Document_pkey";
ALTER TABLE IF EXISTS ONLY public."Classroom" DROP CONSTRAINT IF EXISTS "Classroom_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
ALTER TABLE IF EXISTS ONLY public."Attendance" DROP CONSTRAINT IF EXISTS "Attendance_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Transaction";
DROP TABLE IF EXISTS public."Teacher";
DROP TABLE IF EXISTS public."Student";
DROP TABLE IF EXISTS public."ScheduleSlot";
DROP TABLE IF EXISTS public."Payroll";
DROP TABLE IF EXISTS public."Payment";
DROP TABLE IF EXISTS public."Parent";
DROP TABLE IF EXISTS public."Notification";
DROP TABLE IF EXISTS public."Note";
DROP TABLE IF EXISTS public."MarketingCampaign";
DROP TABLE IF EXISTS public."Lesson";
DROP TABLE IF EXISTS public."Lead";
DROP TABLE IF EXISTS public."GroupStudent";
DROP TABLE IF EXISTS public."Group";
DROP TABLE IF EXISTS public."Document";
DROP TABLE IF EXISTS public."Classroom";
DROP TABLE IF EXISTS public."AuditLog";
DROP TABLE IF EXISTS public."Attendance";
DROP TYPE IF EXISTS public."TransactionType";
DROP TYPE IF EXISTS public."TeacherPaymentType";
DROP TYPE IF EXISTS public."StudyType";
DROP TYPE IF EXISTS public."StudentStatus";
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."PayrollStatus";
DROP TYPE IF EXISTS public."PaymentStatus";
DROP TYPE IF EXISTS public."PaymentMethod";
DROP TYPE IF EXISTS public."NotificationType";
DROP TYPE IF EXISTS public."NotificationStatus";
DROP TYPE IF EXISTS public."MarketingChannel";
DROP TYPE IF EXISTS public."LessonStatus";
DROP TYPE IF EXISTS public."LeadStage";
DROP TYPE IF EXISTS public."LeadSource";
DROP TYPE IF EXISTS public."Language";
DROP TYPE IF EXISTS public."FinanceCategory";
DROP TYPE IF EXISTS public."AttendanceStatus";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'EXCUSED'
);


--
-- Name: FinanceCategory; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FinanceCategory" AS ENUM (
    'STUDENT_PAYMENT',
    'INDIVIDUAL_LESSON',
    'MATERIALS_SALE',
    'OTHER_INCOME',
    'TEACHER_SALARY',
    'STAFF_SALARY',
    'TARGETED_ADS',
    'SMM',
    'STATIONERY',
    'RENT',
    'UTILITIES',
    'INTERNET',
    'TAXES',
    'OTHER_EXPENSE'
);


--
-- Name: Language; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Language" AS ENUM (
    'CHINESE',
    'ENGLISH'
);


--
-- Name: LeadSource; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeadSource" AS ENUM (
    'INSTAGRAM',
    'TIKTOK',
    'FACEBOOK',
    'GOOGLE_ADS',
    'YANDEX',
    'OUTDOOR',
    'REFERRAL',
    'WALK_IN',
    'OTHER'
);


--
-- Name: LeadStage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeadStage" AS ENUM (
    'NEW',
    'CONSULTATION',
    'TRIAL_LESSON',
    'AWAITING_PAYMENT',
    'ACTIVE',
    'GRADUATE',
    'LOST'
);


--
-- Name: LessonStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LessonStatus" AS ENUM (
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED',
    'RESCHEDULED'
);


--
-- Name: MarketingChannel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MarketingChannel" AS ENUM (
    'INSTAGRAM',
    'TIKTOK',
    'FACEBOOK',
    'GOOGLE_ADS',
    'YANDEX',
    'OUTDOOR',
    'OTHER'
);


--
-- Name: NotificationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."NotificationStatus" AS ENUM (
    'PENDING',
    'SENT',
    'FAILED'
);


--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."NotificationType" AS ENUM (
    'LESSON_REMINDER',
    'PAYMENT_REMINDER',
    'ABSENCE',
    'SUBSCRIPTION_END',
    'GENERAL'
);


--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'CARD',
    'TRANSFER',
    'KASPI',
    'OTHER'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PAID',
    'PENDING',
    'OVERDUE',
    'REFUNDED'
);


--
-- Name: PayrollStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PayrollStatus" AS ENUM (
    'DRAFT',
    'APPROVED',
    'PAID'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'SUPER_ADMIN',
    'DIRECTOR',
    'ADMINISTRATOR',
    'ACCOUNTANT',
    'SALES_MANAGER',
    'TEACHER',
    'STUDENT',
    'PARENT'
);


--
-- Name: StudentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StudentStatus" AS ENUM (
    'NEW',
    'TRIAL',
    'ACTIVE',
    'FROZEN',
    'GRADUATED',
    'DROPPED'
);


--
-- Name: StudyType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StudyType" AS ENUM (
    'GROUP',
    'INDIVIDUAL',
    'INDIVIDUAL_ONLINE'
);


--
-- Name: TeacherPaymentType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TeacherPaymentType" AS ENUM (
    'PER_HOUR',
    'FIXED',
    'PER_STUDENT'
);


--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TransactionType" AS ENUM (
    'INCOME',
    'EXPENSE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Attendance" (
    id text NOT NULL,
    "lessonId" text NOT NULL,
    "studentId" text NOT NULL,
    status public."AttendanceStatus" DEFAULT 'PRESENT'::public."AttendanceStatus" NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    changes jsonb,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Classroom; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Classroom" (
    id text NOT NULL,
    name text NOT NULL,
    capacity integer DEFAULT 10 NOT NULL,
    equipment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Document" (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    "mimeType" text,
    "studentId" text,
    "uploadedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Group" (
    id text NOT NULL,
    name text NOT NULL,
    language public."Language" DEFAULT 'CHINESE'::public."Language" NOT NULL,
    level text,
    "studyType" public."StudyType" DEFAULT 'GROUP'::public."StudyType" NOT NULL,
    "monthlyPrice" numeric(12,2) DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "teacherId" text,
    "classroomId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: GroupStudent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GroupStudent" (
    id text NOT NULL,
    "groupId" text NOT NULL,
    "studentId" text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "leftAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: Lead; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Lead" (
    id text NOT NULL,
    "fullName" text NOT NULL,
    phone text,
    email text,
    language public."Language" DEFAULT 'CHINESE'::public."Language" NOT NULL,
    stage public."LeadStage" DEFAULT 'NEW'::public."LeadStage" NOT NULL,
    source public."LeadSource" DEFAULT 'OTHER'::public."LeadSource" NOT NULL,
    "acquisitionCost" numeric(12,2) DEFAULT 0 NOT NULL,
    comment text,
    "managerId" text,
    "studentId" text,
    "campaignId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Lesson" (
    id text NOT NULL,
    "groupId" text NOT NULL,
    "teacherId" text,
    "classroomId" text,
    date timestamp(3) without time zone NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "durationMin" integer DEFAULT 60 NOT NULL,
    status public."LessonStatus" DEFAULT 'SCHEDULED'::public."LessonStatus" NOT NULL,
    topic text,
    notes text,
    "originalTeacherId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: MarketingCampaign; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MarketingCampaign" (
    id text NOT NULL,
    name text NOT NULL,
    channel public."MarketingChannel" DEFAULT 'OTHER'::public."MarketingChannel" NOT NULL,
    budget numeric(12,2) DEFAULT 0 NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "leadsCount" integer DEFAULT 0 NOT NULL,
    "paidCount" integer DEFAULT 0 NOT NULL,
    revenue numeric(12,2) DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Note" (
    id text NOT NULL,
    body text NOT NULL,
    "authorId" text,
    "studentId" text,
    "leadId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    type public."NotificationType" NOT NULL,
    status public."NotificationStatus" DEFAULT 'PENDING'::public."NotificationStatus" NOT NULL,
    channel text DEFAULT 'telegram'::text NOT NULL,
    recipient text,
    payload jsonb,
    message text NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Parent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Parent" (
    id text NOT NULL,
    "fullName" text NOT NULL,
    phone text,
    email text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    amount numeric(12,2) NOT NULL,
    method public."PaymentMethod" DEFAULT 'KASPI'::public."PaymentMethod" NOT NULL,
    status public."PaymentStatus" DEFAULT 'PAID'::public."PaymentStatus" NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "periodStart" timestamp(3) without time zone,
    "periodEnd" timestamp(3) without time zone,
    comment text,
    "documentUrl" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Payroll; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payroll" (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    "periodMonth" integer NOT NULL,
    "periodYear" integer NOT NULL,
    "hoursWorked" numeric(8,2) DEFAULT 0 NOT NULL,
    "hourlyRate" numeric(12,2) DEFAULT 0 NOT NULL,
    "baseAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    bonus numeric(12,2) DEFAULT 0 NOT NULL,
    penalty numeric(12,2) DEFAULT 0 NOT NULL,
    allowance numeric(12,2) DEFAULT 0 NOT NULL,
    "totalAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    status public."PayrollStatus" DEFAULT 'DRAFT'::public."PayrollStatus" NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ScheduleSlot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ScheduleSlot" (
    id text NOT NULL,
    "groupId" text NOT NULL,
    weekday integer NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "classroomId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Student; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Student" (
    id text NOT NULL,
    "fullName" text NOT NULL,
    phone text,
    email text,
    "birthDate" timestamp(3) without time zone,
    language public."Language" DEFAULT 'CHINESE'::public."Language" NOT NULL,
    level text,
    "studyType" public."StudyType" DEFAULT 'GROUP'::public."StudyType" NOT NULL,
    status public."StudentStatus" DEFAULT 'NEW'::public."StudentStatus" NOT NULL,
    "averageGrade" double precision,
    "startDate" timestamp(3) without time zone,
    "notesText" text,
    "userId" text,
    "parentId" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Teacher; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Teacher" (
    id text NOT NULL,
    "fullName" text NOT NULL,
    phone text,
    email text,
    specialization text,
    languages public."Language"[] DEFAULT ARRAY[]::public."Language"[],
    "hourlyRate" numeric(12,2) DEFAULT 0 NOT NULL,
    "paymentType" public."TeacherPaymentType" DEFAULT 'PER_HOUR'::public."TeacherPaymentType" NOT NULL,
    rating double precision,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    type public."TransactionType" NOT NULL,
    category public."FinanceCategory" NOT NULL,
    amount numeric(12,2) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    comment text,
    "documentUrl" text,
    "groupId" text,
    "teacherId" text,
    "studentId" text,
    "campaignId" text,
    "responsibleId" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "fullName" text NOT NULL,
    phone text,
    role public."Role" DEFAULT 'ADMINISTRATOR'::public."Role" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Attendance" (id, "lessonId", "studentId", status, comment, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AuditLog" (id, "userId", action, entity, "entityId", changes, "ipAddress", "createdAt") FROM stdin;
cmqgon4s70003em6h1zke5q5u	cmqgb32pi0001awwx61vqjxn4	CREATE	maintenance	\N	{}	172.18.0.2	2026-06-16 13:33:19.735
cmqgopg6z0006em6hsn9omwfx	cmqgb32pi0001awwx61vqjxn4	CREATE	leads	cmqgopg6k0004em6hx1hdd6s6	{"phone": "788898", "stage": "NEW", "source": "INSTAGRAM", "comment": "", "fullName": "thfc", "language": "CHINESE", "acquisitionCost": 0}	172.18.0.2	2026-06-16 13:35:07.835
cmqgophrg0008em6hbs6qogvn	cmqgb32pi0001awwx61vqjxn4	UPDATE	leads	cmqgopg6k0004em6hx1hdd6s6	{"stage": "CONSULTATION"}	172.18.0.2	2026-06-16 13:35:09.868
cmqgopkaw000aem6hst32qo5c	cmqgb32pi0001awwx61vqjxn4	UPDATE	leads	cmqgopg6k0004em6hx1hdd6s6	{"stage": "TRIAL_LESSON"}	172.18.0.2	2026-06-16 13:35:13.16
cmqgopl1i000cem6hn9otj3bw	cmqgb32pi0001awwx61vqjxn4	UPDATE	leads	cmqgopg6k0004em6hx1hdd6s6	{"stage": "CONSULTATION"}	172.18.0.2	2026-06-16 13:35:14.119
cmqgoplgd000eem6hoptv6pcn	cmqgb32pi0001awwx61vqjxn4	UPDATE	leads	cmqgopg6k0004em6hx1hdd6s6	{"stage": "TRIAL_LESSON"}	172.18.0.2	2026-06-16 13:35:14.653
cmqgopn2z000gem6h8v2fp6t1	cmqgb32pi0001awwx61vqjxn4	UPDATE	leads	cmqgopg6k0004em6hx1hdd6s6	{"stage": "AWAITING_PAYMENT"}	172.18.0.2	2026-06-16 13:35:16.764
cmqgoprnp000jem6hlgqo2c91	cmqgb32pi0001awwx61vqjxn4	CREATE	leads	cmqgoprnd000hem6h0zucels8	{}	172.18.0.2	2026-06-16 13:35:22.693
cmqgoqkva000lem6hqcibnrkn	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgoprnd000hem6h0zucels8	{"level": "", "phone": "788898", "status": "ACTIVE", "fullName": "thfc", "language": "CHINESE", "notesText": "", "startDate": "2026-06-16", "studyType": "INDIVIDUAL_ONLINE"}	172.18.0.2	2026-06-16 13:36:00.551
cmqgorglc000oem6hfa573r67	cmqgb32pi0001awwx61vqjxn4	CREATE	teachers	cmqgorgl1000mem6hn6337lr0	{"phone": "999", "fullName": "препод", "languages": ["CHINESE"], "hourlyRate": 4500, "paymentType": "PER_HOUR", "specialization": ""}	172.18.0.2	2026-06-16 13:36:41.664
cmqgowjlv000qem6hfc5d1dee	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgoprnd000hem6h0zucels8	\N	172.18.0.2	2026-06-16 13:40:38.851
cmqgoxdy6000tem6hsm16x6o1	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgoxdxy000rem6h4f7an40p	{"level": "", "phone": "", "status": "NEW", "fullName": "а", "language": "CHINESE", "notesText": "", "startDate": "2026-06-16", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:41:18.174
cmqgoxh0f000wem6hp04ohygb	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgoxh0a000uem6ht5ovrru8	{"level": "", "phone": "", "status": "NEW", "fullName": "б", "language": "CHINESE", "notesText": "", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:41:22.143
cmqgozbod0013em6h3za8se6m	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgozbnk000yem6hcgorgimk	{"name": "Группа Маржан 1", "level": "ПИДОР", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "18:00", "weekday": 1, "startTime": "17:00"}, {"endTime": "18:00", "weekday": 3, "startTime": "17:00"}, {"endTime": "18:00", "weekday": 5, "startTime": "17:00"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 13:42:48.541
cmqgozke20017em6hka8ixnos	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgozkdm0015em6hn59n1fsg	{"studentId": "cmqgoxh0a000uem6ht5ovrru8"}	172.18.0.2	2026-06-16 13:42:59.835
cmqgozls7001bem6hr94vasz4	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgozlrz0019em6hwdjndgez	{"studentId": "cmqgoxdxy000rem6h4f7an40p"}	172.18.0.2	2026-06-16 13:43:01.639
cmqgozt6o001gem6hkyfptyrv	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgozbnk000yem6hcgorgimk	{"name": "Группа Маржан 1", "level": "ПИДОР", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "18:00", "weekday": 1, "startTime": "17:00"}, {"endTime": "18:00", "weekday": 3, "startTime": "17:00"}, {"endTime": "18:00", "weekday": 5, "startTime": "17:00"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 13:43:11.233
cmqgp1h4v001iem6h6afpjtqf	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgoxh0a000uem6ht5ovrru8	\N	172.18.0.2	2026-06-16 13:44:28.927
cmqgp1izt001kem6h7qklrgnd	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgoxdxy000rem6h4f7an40p	\N	172.18.0.2	2026-06-16 13:44:31.338
cmqgp3nz9001nem6hbdcxa3nx	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgp3nz3001lem6hwbewmxv1	{"level": "hsk 2", "phone": "+7  702 164 93 33", "status": "ACTIVE", "fullName": "Зауре", "language": "CHINESE", "notesText": "", "startDate": "2026-04-01", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:46:11.109
cmqgp52q7001qem6hdxr37vgt	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgp52q0001oem6h7yc03xvr	{"level": "hsk 2", "phone": "+7 775 755 08 02", "status": "ACTIVE", "fullName": "Айсана", "language": "CHINESE", "notesText": "", "startDate": "2026-04-01", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:47:16.88
cmqgp65t0001tem6hq8lwoffa	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgp65st001rem6hfwwxe9xz	{"level": "hsk 2", "phone": "+7 778 854 27 27", "status": "ACTIVE", "fullName": "Молдир", "language": "CHINESE", "notesText": "", "startDate": "2026-04-01", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:48:07.524
cmqgp795i001wem6hpommn5di	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgp795c001uem6h0vbardj1	{"level": "hsk 2", "phone": "+7 778 932 25 26", "status": "ACTIVE", "fullName": "Азиза", "language": "CHINESE", "notesText": "", "startDate": "2026-05-20", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:48:58.518
cmqgp8rju001zem6h7roqly2s	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgp8rjl001xem6h667m6wzy	{"level": "hsk 2", "phone": "+7 775 274 50 44", "status": "ACTIVE", "fullName": "Жанайым", "language": "CHINESE", "notesText": "", "startDate": "2026-04-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:50:09.018
cmqgp9zxb0022em6hcc8ep51a	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgp9zx20020em6hid49ybd1	{"level": "hsk 2", "phone": "+7 702 386 75 31", "status": "ACTIVE", "fullName": "Айгуль", "language": "CHINESE", "notesText": "", "startDate": "2026-04-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:51:06.527
cmqgpcfui0025em6hpuhpssuv	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpcfu90023em6h71ue8wvv	{"level": "hsk 2", "phone": "7 775 329 0755", "status": "ACTIVE", "fullName": "Диас", "language": "CHINESE", "notesText": "", "startDate": "2026-04-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:53:00.474
cmqgpd43z0028em6hk6m5h7r6	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpd43r0026em6hfdpt43hs	{"level": "hsk 2", "phone": "7 702 501 5367", "status": "ACTIVE", "fullName": "Арина", "language": "CHINESE", "notesText": "", "startDate": "2026-05-14", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:53:31.919
cmqgpe7eg002bem6hhmjsu3ju	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpe7e90029em6hhyy8po10	{"level": "hsk 1", "phone": "7 778 846 5915", "status": "ACTIVE", "fullName": "Дана", "language": "CHINESE", "notesText": "", "startDate": "2026-06-03", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:54:22.841
cmqgpev8q002eem6h25xps05u	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpev8k002cem6h0byo0x0r	{"level": "hsk 1", "phone": "7 701 434 1434", "status": "ACTIVE", "fullName": "Акмоншак", "language": "CHINESE", "notesText": "", "startDate": "2026-06-03", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:54:53.738
cmqgpfi4g002hem6h6kka5j3s	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpfi49002fem6hcdm74fr0	{"level": "hsk 1", "phone": "7 747 127 6101", "status": "ACTIVE", "fullName": "Акжан", "language": "CHINESE", "notesText": "", "startDate": "2026-06-03", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:55:23.392
cmqgpg4al002kem6hd6ebkfnx	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpg4ac002iem6h6vsnr722	{"level": "Hsk 1", "phone": "7 707 956 0410‬", "status": "ACTIVE", "fullName": "Хамитула", "language": "CHINESE", "notesText": "", "startDate": "2026-06-12", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:55:52.125
cmqgpgx83002nem6htej651op	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpgx7v002lem6hqolzav57	{"level": "Hsk 1", "phone": "7 708 210 8546", "status": "ACTIVE", "fullName": "Ерден", "language": "CHINESE", "notesText": "", "startDate": "2026-06-12", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:56:29.62
cmqgphhqu002qem6h2ljycxj0	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgphhqm002oem6h45vaku0z	{"level": "hsk 1", "phone": "7 707 271 5032", "status": "ACTIVE", "fullName": "Ерсултан", "language": "CHINESE", "notesText": "", "startDate": "2026-06-15", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:56:56.214
cmqgpjzad002tem6hz5d13v08	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpjza2002rem6hw93xdder	{"level": "hsk 1", "phone": "+ 7 701 670 01 03", "status": "FROZEN", "fullName": "Мария", "language": "CHINESE", "notesText": "", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:58:52.261
cmqgpkkkd002vem6h4dmb4njl	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpjza2002rem6hw93xdder	{"level": "hsk 1", "phone": "+ 7 701 670 01 03", "status": "FROZEN", "fullName": "Мария", "language": "CHINESE", "notesText": "предоплата 5000", "studyType": "GROUP"}	172.18.0.2	2026-06-16 13:59:19.838
cmqgpljtm002yem6h2dw5ft0g	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpljtf002wem6hscrfsf82	{"level": "hsk 2", "phone": "7 776 136 3557", "status": "ACTIVE", "fullName": "Сабрина", "language": "CHINESE", "notesText": "", "startDate": "2026-05-07", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:00:05.531
cmqgpmjw80031em6hetgadcoh	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpmjvz002zem6h5kz3hfyj	{"level": "hsk 2", "phone": "7 707 144 4263", "status": "ACTIVE", "fullName": "Диас ", "language": "CHINESE", "notesText": "", "startDate": "2026-02-24", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:00:52.28
cmqgpn7fb0034em6hr13zcivh	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpn7f30032em6hkca1jzz6	{"level": "hsk 2", "phone": "7 701 525 02 00", "status": "ACTIVE", "fullName": "Амир", "language": "CHINESE", "notesText": "", "startDate": "2026-03-31", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:01:22.775
cmqgpo7fd0037em6hnpugosm7	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpo7f70035em6heqj3kquc	{"level": "hsk 2", "phone": "7 777 195 52 61", "status": "ACTIVE", "fullName": "Ляззат", "language": "CHINESE", "notesText": "", "startDate": "2026-02-23", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 14:02:09.433
cmqgpougz003aem6hhxmj26gc	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgpougu0038em6hhnvtk8yl	{"level": "hsk 1", "phone": "7 705 551 10 28", "status": "ACTIVE", "fullName": "Айнура", "language": "CHINESE", "notesText": "", "startDate": "2026-02-23", "studyType": "INDIVIDUAL_ONLINE"}	172.18.0.2	2026-06-16 14:02:39.299
cmqgppd33003dem6hft725qor	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgppd2u003bem6hn3469snx	{"level": "hsk 1", "phone": "7 708 383 83 83‬", "status": "ACTIVE", "fullName": "Алмаз", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 14:03:03.423
cmqgprm2b003fem6h7jpxio9n	cmqgb32pi0001awwx61vqjxn4	UPDATE	teachers	cmqgorgl1000mem6hn6337lr0	{"phone": "+7 778 500 83 56", "fullName": "Маржан", "languages": ["CHINESE"], "hourlyRate": 4500, "paymentType": "PER_HOUR", "specialization": "Китайский язык, hsk 5"}	172.18.0.2	2026-06-16 14:04:48.371
cmqgpsn3c003iem6h8l5ds6p7	cmqgb32pi0001awwx61vqjxn4	CREATE	teachers	cmqgpsn2z003gem6hc3zwr8st	{"phone": "+7 747 388 82 07", "fullName": "Елнур", "languages": ["CHINESE"], "hourlyRate": 4500, "paymentType": "PER_HOUR", "specialization": "Китайский язык, hsk 6"}	172.18.0.2	2026-06-16 14:05:36.36
cmqgpty3t003lem6h5rg9hp37	cmqgb32pi0001awwx61vqjxn4	CREATE	teachers	cmqgpty3k003jem6hgjc48puz	{"phone": "", "fullName": "Зюляль", "languages": ["CHINESE"], "hourlyRate": 4500, "paymentType": "PER_HOUR", "specialization": "Китайский язык, hsk 6"}	172.18.0.2	2026-06-16 14:06:37.289
cmqgpuxir003nem6h6k5xw8hg	cmqgb32pi0001awwx61vqjxn4	UPDATE	teachers	cmqgpty3k003jem6hgjc48puz	{"phone": "", "fullName": "Зюляль", "languages": ["CHINESE"], "hourlyRate": 4500, "paymentType": "PER_HOUR", "specialization": "Китайский язык, hsk 6"}	172.18.0.2	2026-06-16 14:07:23.187
cmqgpx5d5003rem6hfrkmivts	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgpx5cr003pem6hfdf6hwai	{"studentId": "cmqgpg4ac002iem6h6vsnr722"}	172.18.0.2	2026-06-16 14:09:06.665
cmqgpxn3d003vem6h22uusueu	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgpxn35003tem6h5ssckzxx	{"studentId": "cmqgpgx7v002lem6hqolzav57"}	172.18.0.2	2026-06-16 14:09:29.641
cmqgpxr6z003zem6hh6xsl66r	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgpxr6q003xem6hofo41byy	{"studentId": "cmqgphhqm002oem6h45vaku0z"}	172.18.0.2	2026-06-16 14:09:34.955
cmqgpy2o00043em6hefvygfzs	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgpy2ns0041em6hqlhvlduq	{"studentId": "cmqgpjza2002rem6hw93xdder"}	172.18.0.2	2026-06-16 14:09:49.825
cmqgpy69j0048em6ht3gl45to	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgozbnk000yem6hcgorgimk	{"name": "Группа Маржан 1", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:00", "weekday": 1, "startTime": "19:00"}, {"endTime": "20:00", "weekday": 3, "startTime": "19:00"}, {"endTime": "20:00", "weekday": 5, "startTime": "19:00"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:09:54.487
cmqgpyu7t004aem6hzxfqs953	cmqgb32pi0001awwx61vqjxn4	DELETE	groups	cmqgpy2ns0041em6hqlhvlduq	\N	172.18.0.2	2026-06-16 14:10:25.53
cmqgpyv8k004fem6hv8pwg36m	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgozbnk000yem6hcgorgimk	{"name": "Группа Маржан 1", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:00", "weekday": 1, "startTime": "19:00"}, {"endTime": "20:00", "weekday": 3, "startTime": "19:00"}, {"endTime": "20:00", "weekday": 5, "startTime": "19:00"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:10:26.853
cmqgqln0g009iem6hzjz914m5	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpougu0038em6hhnvtk8yl	{"level": "hsk 1", "phone": "7 705 551 10 28", "status": "ACTIVE", "fullName": "Айнура", "language": "CHINESE", "notesText": "", "startDate": "2026-06-01", "studyType": "INDIVIDUAL_ONLINE"}	172.18.0.2	2026-06-16 14:28:09.28
cmqgv3j2p000a5t69dcxfs22f	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgv3j2k00085t69zcjcnxe2	{"status": "NEW", "fullName": "????????? 3", "studyType": "GROUP"}	172.18.0.2	2026-06-16 16:34:02.449
cmqgq1mzk004mem6h7cbbf943	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq1mz8004hem6hknzmtu07	{"name": "Группа Маржан 2", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "18:30", "weekday": 1, "startTime": "17:30"}, {"endTime": "18:30", "weekday": 3, "startTime": "17:30"}, {"endTime": "18:30", "weekday": 5, "startTime": "17:30"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:12:36.129
cmqgq1t5e004qem6hjgvaqvql	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq1t55004oem6hn466g73b	{"studentId": "cmqgpev8k002cem6h0byo0x0r"}	172.18.0.2	2026-06-16 14:12:44.115
cmqgq22jc004uem6hb02vg4nb	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq22j1004sem6h2p5yzzsz	{"studentId": "cmqgpe7e90029em6hhyy8po10"}	172.18.0.2	2026-06-16 14:12:56.28
cmqgq29vx004yem6h60tzb3fm	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq29vk004wem6hwa1cjebr	{"studentId": "cmqgpfi49002fem6hcdm74fr0"}	172.18.0.2	2026-06-16 14:13:05.805
cmqgq2d520053em6h78gt03ld	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq1mz8004hem6hknzmtu07	{"name": "Группа Маржан 2", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "18:30", "weekday": 1, "startTime": "17:30"}, {"endTime": "18:30", "weekday": 3, "startTime": "17:30"}, {"endTime": "18:30", "weekday": 5, "startTime": "17:30"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:13:10.022
cmqgq3hro005aem6hlem785um	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq3hri0055em6hujpkywwl	{"name": "Группа Маржан 3", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "17:00", "weekday": 1, "startTime": "16:00"}, {"endTime": "17:00", "weekday": 3, "startTime": "16:00"}, {"endTime": "17:00", "weekday": 5, "startTime": "16:00"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:14:02.676
cmqgq3t96005eem6hdzcdkfrv	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq3t8y005cem6hbaeupvr3	{"studentId": "cmqgp3nz3001lem6hwbewmxv1"}	172.18.0.2	2026-06-16 14:14:17.562
cmqgq3vbo005iem6hcjuznvoj	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq3vbf005gem6hpsekgefs	{"studentId": "cmqgp65st001rem6hfwwxe9xz"}	172.18.0.2	2026-06-16 14:14:20.245
cmqgq3xo3005mem6h892s7dm5	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq3xo0005kem6hn0q7i19m	{"studentId": "cmqgp52q0001oem6h7yc03xvr"}	172.18.0.2	2026-06-16 14:14:23.283
cmqgq41iq005qem6homhbvocc	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq41ih005oem6hl9tgi7u6	{"studentId": "cmqgp795c001uem6h0vbardj1"}	172.18.0.2	2026-06-16 14:14:28.274
cmqgq43r5005vem6ha6o1gxwx	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq3hri0055em6hujpkywwl	{"name": "Группа Маржан 3", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "17:00", "weekday": 1, "startTime": "16:00"}, {"endTime": "17:00", "weekday": 3, "startTime": "16:00"}, {"endTime": "17:00", "weekday": 5, "startTime": "16:00"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:14:31.17
cmqgq66ku0062em6h0sfkkz6d	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq66kg005xem6h5hc6j4nb	{"name": "Группа Елнур 1", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:30", "weekday": 1, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 4, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 5, "startTime": "18:30"}], "studyType": "GROUP", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:16:08.142
cmqgq6jji0066em6hc79q3ln8	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq6jj80064em6hioh2uqmj	{"studentId": "cmqgp8rjl001xem6h667m6wzy"}	172.18.0.2	2026-06-16 14:16:24.943
cmqgq6ncm006aem6hylzcnozu	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq6ncf0068em6h61wkqeqy	{"studentId": "cmqgp9zx20020em6hid49ybd1"}	172.18.0.2	2026-06-16 14:16:29.879
cmqgq6pmp006eem6h6jbfl724	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq6pml006cem6hxscd84df	{"studentId": "cmqgpcfu90023em6h71ue8wvv"}	172.18.0.2	2026-06-16 14:16:32.833
cmqgq6t4x006iem6huldbaocg	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq6t4q006gem6htowrhx5r	{"studentId": "cmqgpd43r0026em6hfdpt43hs"}	172.18.0.2	2026-06-16 14:16:37.378
cmqgq6v6r006nem6h93n2ils1	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq66kg005xem6h5hc6j4nb	{"name": "Группа Елнур 1", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:30", "weekday": 1, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 4, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 5, "startTime": "18:30"}], "studyType": "GROUP", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:16:40.035
cmqgq83hr006tem6hhju3yd6z	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq83hj006pem6hvkt2gcpv	{"name": "Группа Маржан 4", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:00", "weekday": 2, "startTime": "18:30"}, {"endTime": "20:00", "weekday": 4, "startTime": "18:30"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:17:37.455
cmqgq8byd006xem6hd8kwmku5	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq8by4006vem6h01252eia	{"studentId": "cmqgpmjvz002zem6h5kz3hfyj"}	172.18.0.2	2026-06-16 14:17:48.421
cmqgq8e7b0071em6hw2gcbotf	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq8e75006zem6hmq6vbnbp	{"studentId": "cmqgpn7f30032em6hkca1jzz6"}	172.18.0.2	2026-06-16 14:17:51.335
cmqgq8ewh0075em6h9librpdw	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq83hj006pem6hvkt2gcpv	{"name": "Группа Маржан 4", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:00", "weekday": 2, "startTime": "18:30"}, {"endTime": "20:00", "weekday": 4, "startTime": "18:30"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:17:52.242
cmqgq8sfc0079em6hrfoc6tft	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq8sf40077em6h2f7ejoh2	{"studentId": "cmqgpljtf002wem6hscrfsf82"}	172.18.0.2	2026-06-16 14:18:09.768
cmqgqm253009kem6hfogqsr1g	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpo7f70035em6heqj3kquc	{"level": "hsk 2", "phone": "7 777 195 52 61", "status": "ACTIVE", "fullName": "Ляззат", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 14:28:28.888
cmqgq8t5d007eem6hiyqfe9zx	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq66kg005xem6h5hc6j4nb	{"name": "Группа Елнур 1", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:30", "weekday": 1, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 4, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 5, "startTime": "18:30"}], "studyType": "GROUP", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:18:10.705
cmqgq9wsz007lem6h1ebbh524	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgq9wsm007gem6hw29rv7vp	{"name": "Зюляль", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:00", "weekday": 1, "startTime": "18:00"}, {"endTime": "19:00", "weekday": 3, "startTime": "18:00"}, {"endTime": "18:00", "weekday": 5, "startTime": "17:00"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:19:02.099
cmqgqa230007pem6hud0eqbsv	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgqa22r007nem6he34vqn1c	{"studentId": "cmqgpo7f70035em6heqj3kquc"}	172.18.0.2	2026-06-16 14:19:08.94
cmqgqa2kg007uem6hmnxiawr8	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq9wsm007gem6hw29rv7vp	{"name": "Зюляль", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:00", "weekday": 1, "startTime": "18:00"}, {"endTime": "19:00", "weekday": 3, "startTime": "18:00"}, {"endTime": "18:00", "weekday": 5, "startTime": "17:00"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:19:09.568
cmqgqb6400081em6hkco4su68	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgqb63h007wem6hmv6jb8pk	{"name": "Зюляль 2", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "11:30", "weekday": 1, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 3, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 5, "startTime": "10:30"}], "studyType": "INDIVIDUAL_ONLINE", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdn00062qypbz2347c3r", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:20:00.816
cmqgqb9ys0086em6h83lgon5v	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqb63h007wem6hmv6jb8pk	{"name": "Зюляль 2", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "11:30", "weekday": 1, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 3, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 5, "startTime": "10:30"}], "studyType": "INDIVIDUAL_ONLINE", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdn00062qypbz2347c3r", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:20:05.812
cmqgqbunf008aem6hmnz563uh	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgqbun80088em6hspfpgapg	{"studentId": "cmqgpougu0038em6hhnvtk8yl"}	172.18.0.2	2026-06-16 14:20:32.619
cmqgqbvu2008fem6hvh9bkkdn	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqb63h007wem6hmv6jb8pk	{"name": "Зюляль 2", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "11:30", "weekday": 1, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 3, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 5, "startTime": "10:30"}], "studyType": "INDIVIDUAL_ONLINE", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdn00062qypbz2347c3r", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:20:34.154
cmqgqf883008mem6hes16zh0e	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgqf87o008hem6h50obtao1	{"name": "Елнур", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:30", "weekday": 1, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 4, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 5, "startTime": "19:30"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:23:10.179
cmqgqfn7v008qem6hq2z60gjf	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgqfn7r008oem6haqrv9v10	{"studentId": "cmqgppd2u003bem6hn3469snx"}	172.18.0.2	2026-06-16 14:23:29.611
cmqgqfnu7008vem6hi4qhwav0	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqf87o008hem6h50obtao1	{"name": "Елнур индив", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:30", "weekday": 1, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 4, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 5, "startTime": "19:30"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 14:23:30.415
cmqgqfya5008xem6h2nal6gkd	cmqgb32pi0001awwx61vqjxn4	UPDATE	teachers	cmqgpty3k003jem6hgjc48puz	{"phone": "", "fullName": "Зюляль", "languages": ["CHINESE"], "hourlyRate": 0, "paymentType": "PER_HOUR", "specialization": "Китайский язык, hsk 6"}	172.18.0.2	2026-06-16 14:23:43.949
cmqgqg1gf008zem6hp8ip217b	cmqgb32pi0001awwx61vqjxn4	UPDATE	teachers	cmqgpty3k003jem6hgjc48puz	{"phone": "", "fullName": "Зюляль", "languages": ["CHINESE"], "hourlyRate": 0, "paymentType": "PER_HOUR", "specialization": "Китайский язык, hsk 6"}	172.18.0.2	2026-06-16 14:23:48.063
cmqgqgevp0094em6htgt54j99	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqf87o008hem6h50obtao1	{"name": "Елнур индив", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:30", "weekday": 1, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 4, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 5, "startTime": "19:30"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 72000}	172.18.0.2	2026-06-16 14:24:05.461
cmqgqgkj90099em6hv7ccnvj6	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqb63h007wem6hmv6jb8pk	{"name": "Зюляль 2", "level": "hsk 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "11:30", "weekday": 1, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 3, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 5, "startTime": "10:30"}], "studyType": "INDIVIDUAL_ONLINE", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdn00062qypbz2347c3r", "monthlyPrice": 72000}	172.18.0.2	2026-06-16 14:24:12.789
cmqgqgpp2009eem6h52euvlnd	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq9wsm007gem6hw29rv7vp	{"name": "Зюляль", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:00", "weekday": 1, "startTime": "18:00"}, {"endTime": "19:00", "weekday": 3, "startTime": "18:00"}, {"endTime": "18:00", "weekday": 5, "startTime": "17:00"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 72000}	172.18.0.2	2026-06-16 14:24:19.479
cmqgql9ec009gem6h0t9hcmht	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgppd2u003bem6hn3469snx	{"level": "hsk 1", "phone": "7 708 383 83 83‬", "status": "ACTIVE", "fullName": "Алмаз", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 14:27:51.636
cmqgv3j1p00045t699oeyebkz	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgv3j1700025t69bn0m7lqy	{"status": "NEW", "fullName": "????????? 1", "studyType": "GROUP"}	172.18.0.2	2026-06-16 16:34:02.413
cmqgqmi0i009mem6htc46lx29	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpn7f30032em6hkca1jzz6	{"level": "hsk 2", "phone": "7 701 525 02 00", "status": "ACTIVE", "fullName": "Амир", "language": "CHINESE", "notesText": "", "startDate": "2026-05-26", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:28:49.458
cmqgqms6e009oem6hlnaqsnrd	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpmjvz002zem6h5kz3hfyj	{"level": "hsk 2", "phone": "7 707 144 4263", "status": "ACTIVE", "fullName": "Диас ", "language": "CHINESE", "notesText": "", "startDate": "2026-05-20", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:29:02.63
cmqgqn9no009qem6huejhm24t	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpljtf002wem6hscrfsf82	{"level": "hsk 2", "phone": "7 776 136 3557", "status": "ACTIVE", "fullName": "Сабрина", "language": "CHINESE", "notesText": "", "startDate": "2026-06-04", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:29:25.285
cmqgqnlv0009sem6hlp7pmcof	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgphhqm002oem6h45vaku0z	{"level": "hsk 1", "phone": "7 707 271 5032", "status": "ACTIVE", "fullName": "Ерсултан", "language": "CHINESE", "notesText": "", "startDate": "2026-06-15", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:29:41.101
cmqgqnrtn009uem6hkqx7wjp5	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpgx7v002lem6hqolzav57	{"level": "Hsk 1", "phone": "7 708 210 8546", "status": "ACTIVE", "fullName": "Ерден", "language": "CHINESE", "notesText": "", "startDate": "2026-06-12", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:29:48.828
cmqgqonn6009wem6h0ujjw5h1	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpd43r0026em6hfdpt43hs	{"level": "hsk 2", "phone": "7 702 501 5367", "status": "ACTIVE", "fullName": "Арина", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:30:30.067
cmqgqp5hr009yem6hoj2yamkb	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpcfu90023em6h71ue8wvv	{"level": "hsk 2", "phone": "7 775 329 0755", "status": "ACTIVE", "fullName": "Диас", "language": "CHINESE", "notesText": "", "startDate": "2026-05-29", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:30:53.199
cmqgqph9r00a0em6havpxnlns	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp9zx20020em6hid49ybd1	{"level": "hsk 2", "phone": "+7 702 386 75 31", "status": "ACTIVE", "fullName": "Айгуль", "language": "CHINESE", "notesText": "", "startDate": "2026-05-25", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:31:08.463
cmqgqpt3r00a2em6hjavntsym	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp8rjl001xem6h667m6wzy	{"level": "hsk 2", "phone": "+7 775 274 50 44", "status": "ACTIVE", "fullName": "Жанайым", "language": "CHINESE", "notesText": "", "startDate": "2026-06-07", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:31:23.8
cmqgqqat700a4em6hgtodep1r	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp795c001uem6h0vbardj1	{"level": "hsk 2", "phone": "+7 778 932 25 26", "status": "ACTIVE", "fullName": "Азиза", "language": "CHINESE", "notesText": "", "startDate": "2026-05-20", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:31:46.747
cmqgqqktp00a6em6hzdcxdbc7	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp65st001rem6hfwwxe9xz	{"level": "hsk 2", "phone": "+7 778 854 27 27", "status": "ACTIVE", "fullName": "Молдир", "language": "CHINESE", "notesText": "", "startDate": "2026-05-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:31:59.725
cmqgqqw8000a8em6hfcxuwyqg	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp52q0001oem6h7yc03xvr	{"level": "hsk 2", "phone": "+7 775 755 08 02", "status": "ACTIVE", "fullName": "Айсана", "language": "CHINESE", "notesText": "", "startDate": "2026-05-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:32:14.496
cmqgqr54i00aaem6h5p1d4kod	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp3nz3001lem6hwbewmxv1	{"level": "hsk 2", "phone": "+7  702 164 93 33", "status": "ACTIVE", "fullName": "Зауре", "language": "CHINESE", "notesText": "", "startDate": "2026-05-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 14:32:26.034
cmqgqut0f00adem6hxlsxn2u7	cmqgb32pi0001awwx61vqjxn4	CREATE	finance	cmqgqut0400abem6hdjnuo2m1	{"type": "EXPENSE", "amount": 120000, "comment": "", "category": "SMM"}	172.18.0.2	2026-06-16 14:35:16.959
cmqgqvb9a00agem6ht7mal70f	cmqgb32pi0001awwx61vqjxn4	CREATE	finance	cmqgqvb9000aeem6hunjz6xcu	{"type": "EXPENSE", "amount": 160000, "comment": "", "category": "TARGETED_ADS"}	172.18.0.2	2026-06-16 14:35:40.606
cmqgtav9i0001vc2nhvjsevcn	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgppd2u003bem6hn3469snx	{"level": "HSK 1", "phone": "7 708 383 83 83‬", "status": "ACTIVE", "fullName": "Алмаз", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 15:43:45.606
cmqgtaznm0003vc2ncot0qexi	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpougu0038em6hhnvtk8yl	{"level": "HSK 1", "phone": "7 705 551 10 28", "status": "ACTIVE", "fullName": "Айнура", "language": "CHINESE", "notesText": "", "startDate": "2026-06-01", "studyType": "INDIVIDUAL_ONLINE"}	172.18.0.2	2026-06-16 15:43:51.298
cmqgtb27c0005vc2nyi4p0pit	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpo7f70035em6heqj3kquc	{"level": "HSK 2", "phone": "7 777 195 52 61", "status": "ACTIVE", "fullName": "Ляззат", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 15:43:54.6
cmqgtb3w80007vc2nkzbtqvfw	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpo7f70035em6heqj3kquc	{"level": "HSK 2", "phone": "7 777 195 52 61", "status": "ACTIVE", "fullName": "Ляззат", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 15:43:56.792
cmqgtb6tj0009vc2n3xw9pnh8	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpn7f30032em6hkca1jzz6	{"level": "HSK 2", "phone": "7 701 525 02 00", "status": "ACTIVE", "fullName": "Амир", "language": "CHINESE", "notesText": "", "startDate": "2026-05-26", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:00.583
cmqgtb8da000bvc2n9h906iis	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpn7f30032em6hkca1jzz6	{"level": "HSK 2", "phone": "7 701 525 02 00", "status": "ACTIVE", "fullName": "Амир", "language": "CHINESE", "notesText": "", "startDate": "2026-05-26", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:02.591
cmqgtbar8000dvc2nihz7hn20	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpmjvz002zem6h5kz3hfyj	{"level": "HSK 2", "phone": "7 707 144 4263", "status": "ACTIVE", "fullName": "Диас ", "language": "CHINESE", "notesText": "", "startDate": "2026-05-20", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:05.684
cmqgtbe0t000fvc2n9rdqsqyw	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpljtf002wem6hscrfsf82	{"level": "HSK 2", "phone": "7 776 136 3557", "status": "ACTIVE", "fullName": "Сабрина", "language": "CHINESE", "notesText": "", "startDate": "2026-06-04", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:09.917
cmqgtbi5j000hvc2ngo3rt1eq	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpljtf002wem6hscrfsf82	{"level": "HSK 2", "phone": "7 776 136 3557", "status": "ACTIVE", "fullName": "Сабрина", "language": "CHINESE", "notesText": "", "startDate": "2026-06-04", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:15.272
cmqgv3j2800075t69362vtvpd	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgv3j2300055t69qymwpul3	{"status": "NEW", "fullName": "????????? 2", "studyType": "GROUP"}	172.18.0.2	2026-06-16 16:34:02.432
cmqgtbl46000jvc2nvfftfdf9	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpjza2002rem6hw93xdder	{"level": "HSK 1", "phone": "+ 7 701 670 01 03", "status": "FROZEN", "fullName": "Мария", "language": "CHINESE", "notesText": "предоплата 5000", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:19.11
cmqgtbn0b000lvc2nnvc37y7k	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgphhqm002oem6h45vaku0z	{"level": "HSK 1", "phone": "7 707 271 5032", "status": "ACTIVE", "fullName": "Ерсултан", "language": "CHINESE", "notesText": "", "startDate": "2026-06-15", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:21.563
cmqgtbp3z000nvc2n9geziun2	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgphhqm002oem6h45vaku0z	{"level": "HSK 1", "phone": "7 707 271 5032", "status": "ACTIVE", "fullName": "Ерсултан", "language": "CHINESE", "notesText": "", "startDate": "2026-06-15", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:24.287
cmqgtbrfz000pvc2nokgo605x	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpgx7v002lem6hqolzav57	{"level": "HSK 1", "phone": "7 708 210 8546", "status": "ACTIVE", "fullName": "Ерден", "language": "CHINESE", "notesText": "", "startDate": "2026-06-12", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:27.312
cmqgtbtsz000rvc2nsi3gfii5	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpg4ac002iem6h6vsnr722	{"level": "HSK 1", "phone": "7 707 956 0410‬", "status": "ACTIVE", "fullName": "Хамитула", "language": "CHINESE", "notesText": "", "startDate": "2026-06-12", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:30.371
cmqgtbxpq000tvc2nrvaerb56	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpfi49002fem6hcdm74fr0	{"level": "HSK 1", "phone": "7 747 127 6101", "status": "ACTIVE", "fullName": "Акжан", "language": "CHINESE", "notesText": "", "startDate": "2026-06-03", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:35.438
cmqgtc0fu000vvc2npcv2ta6f	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpe7e90029em6hhyy8po10	{"level": "HSK 1", "phone": "7 778 846 5915", "status": "ACTIVE", "fullName": "Дана", "language": "CHINESE", "notesText": "", "startDate": "2026-06-03", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:38.971
cmqgtc2u9000xvc2nocf3aas2	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpd43r0026em6hfdpt43hs	{"level": "HSK 2", "phone": "7 702 501 5367", "status": "ACTIVE", "fullName": "Арина", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:42.081
cmqgtc4t6000zvc2n7a9vyuta	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpd43r0026em6hfdpt43hs	{"level": "HSK 2", "phone": "7 702 501 5367", "status": "ACTIVE", "fullName": "Арина", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:44:44.634
cmqgtcgui0011vc2n9o7douly	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpcfu90023em6h71ue8wvv	{"level": "HSK 2", "phone": "7 775 329 0755", "status": "ACTIVE", "fullName": "Диас", "language": "CHINESE", "notesText": "", "startDate": "2026-05-29", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:45:00.234
cmqgtcmll0013vc2n80a7sjeh	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp9zx20020em6hid49ybd1	{"level": "HSK 2", "phone": "+7 702 386 75 31", "status": "ACTIVE", "fullName": "Айгуль", "language": "CHINESE", "notesText": "", "startDate": "2026-05-25", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:45:07.689
cmqgtcowb0015vc2norw9oytv	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp8rjl001xem6h667m6wzy	{"level": "HSK 2", "phone": "+7 775 274 50 44", "status": "ACTIVE", "fullName": "Жанайым", "language": "CHINESE", "notesText": "", "startDate": "2026-06-07", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:45:10.667
cmqgtcr850017vc2n1ri493wy	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp795c001uem6h0vbardj1	{"level": "HSK 2", "phone": "+7 778 932 25 26", "status": "ACTIVE", "fullName": "Азиза", "language": "CHINESE", "notesText": "", "startDate": "2026-05-20", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:45:13.685
cmqgtcuv00019vc2n6e3d2cqn	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp65st001rem6hfwwxe9xz	{"level": "HSK 2", "phone": "+7 778 854 27 27", "status": "ACTIVE", "fullName": "Молдир", "language": "CHINESE", "notesText": "", "startDate": "2026-05-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:45:18.396
cmqgtcyiu001bvc2nmvt9s8u2	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp52q0001oem6h7yc03xvr	{"level": "HSK 2", "phone": "+7 775 755 08 02", "status": "ACTIVE", "fullName": "Айсана", "language": "CHINESE", "notesText": "", "startDate": "2026-05-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:45:23.142
cmqgtd1gf001dvc2nktcirid4	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp3nz3001lem6hwbewmxv1	{"level": "HSK 2", "phone": "+7  702 164 93 33", "status": "ACTIVE", "fullName": "Зауре", "language": "CHINESE", "notesText": "", "startDate": "2026-05-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:45:26.943
cmqgtd5ga001fvc2ncchh4pnw	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgp3nz3001lem6hwbewmxv1	{"level": "HSK 2", "phone": "+7  702 164 93 33", "status": "ACTIVE", "fullName": "Зауре", "language": "CHINESE", "notesText": "", "startDate": "2026-05-27", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:45:32.122
cmqgtfjm2001hvc2ns23lnpx1	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgpcfu90023em6h71ue8wvv	{"level": "HSK 2", "phone": "7 775 329 0755", "status": "ACTIVE", "fullName": "Диас 1", "language": "CHINESE", "notesText": "", "startDate": "2026-05-29", "studyType": "GROUP"}	172.18.0.2	2026-06-16 15:47:23.787
cmqgtkyxu0001ll863sqab5q5	\N	CREATE	auth	\N	{"email": "director@hanbridge.kz", "password": "password123"}	172.18.0.2	2026-06-16 15:51:36.931
cmqgtkz1x0004ll868k8d1me3	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgtkz1t0002ll86xh1harso	{"status": "NEW", "fullName": "????????? ????"}	172.18.0.2	2026-06-16 15:51:37.078
cmqgtkz3s0007ll864s27oara	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgtkz3k0005ll8694t18nrm	{"name": "???? ?????????", "monthlyPrice": 1000}	172.18.0.2	2026-06-16 15:51:37.144
cmqgtkz49000bll86ou1213ty	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgtkz460009ll86242f6nud	{"studentId": "cmqgtkz1t0002ll86xh1harso"}	172.18.0.2	2026-06-16 15:51:37.162
cmqgtkz4t000dll86q7reo5u1	cmqgb32pi0001awwx61vqjxn4	DELETE	groups	cmqgtkz3k0005ll8694t18nrm	\N	172.18.0.2	2026-06-16 15:51:37.182
cmqgtkz56000fll86yz2xyseb	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgtkz1t0002ll86xh1harso	\N	172.18.0.2	2026-06-16 15:51:37.194
cmqgtm3cj000hll86gt9z3fy0	cmqgb32pi0001awwx61vqjxn4	DELETE	finance	cmqgqvb9000aeem6hunjz6xcu	\N	172.18.0.2	2026-06-16 15:52:29.3
cmqgtm4pk000jll867joarjhi	cmqgb32pi0001awwx61vqjxn4	DELETE	finance	cmqgqut0400abem6hdjnuo2m1	\N	172.18.0.2	2026-06-16 15:52:31.064
cmqgttazf0004m1q4xejsl6hb	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq66kg005xem6h5hc6j4nb	{"name": "Группа Елнур 1", "level": "HSK 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:30", "weekday": 1, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 4, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 5, "startTime": "18:30"}], "studyType": "GROUP", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 15:58:05.787
cmqgttd8h0009m1q4ez2sn02q	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgozbnk000yem6hcgorgimk	{"name": "Группа Маржан 1", "level": "HSK 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:00", "weekday": 1, "startTime": "19:00"}, {"endTime": "20:00", "weekday": 3, "startTime": "19:00"}, {"endTime": "20:00", "weekday": 5, "startTime": "19:00"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 15:58:08.705
cmqgttfhh000em1q4ihmaokps	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq1mz8004hem6hknzmtu07	{"name": "Группа Маржан 2", "level": "HSK 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "18:30", "weekday": 1, "startTime": "17:30"}, {"endTime": "18:30", "weekday": 3, "startTime": "17:30"}, {"endTime": "18:30", "weekday": 5, "startTime": "17:30"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 15:58:11.621
cmqgttib5000jm1q4shirf0wn	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq3hri0055em6hujpkywwl	{"name": "Группа Маржан 3", "level": "hsk 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "17:00", "weekday": 1, "startTime": "16:00"}, {"endTime": "17:00", "weekday": 3, "startTime": "16:00"}, {"endTime": "17:00", "weekday": 5, "startTime": "16:00"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 15:58:15.282
cmqgttl2v000nm1q4li2sp4ld	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq83hj006pem6hvkt2gcpv	{"name": "Группа Маржан 4", "level": "HSK 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:00", "weekday": 2, "startTime": "18:30"}, {"endTime": "20:00", "weekday": 4, "startTime": "18:30"}], "studyType": "GROUP", "teacherId": "cmqgorgl1000mem6hn6337lr0", "classroomId": "cmqgetdmx0061qypbvqsm7tzo", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 15:58:18.871
cmqgttn31000sm1q459etsv3h	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqf87o008hem6h50obtao1	{"name": "Елнур индив", "level": "HSK 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:30", "weekday": 1, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 4, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 5, "startTime": "19:30"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 72000}	172.18.0.2	2026-06-16 15:58:21.47
cmqgttpqu000xm1q47h1cby7h	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq9wsm007gem6hw29rv7vp	{"name": "Зюляль", "level": "HSK 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:00", "weekday": 1, "startTime": "18:00"}, {"endTime": "19:00", "weekday": 3, "startTime": "18:00"}, {"endTime": "18:00", "weekday": 5, "startTime": "17:00"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 72000}	172.18.0.2	2026-06-16 15:58:24.918
cmqgttrvc0012m1q4rkv33d9x	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqb63h007wem6hmv6jb8pk	{"name": "Зюляль 2", "level": "HSK 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "11:30", "weekday": 1, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 3, "startTime": "10:30"}, {"endTime": "11:30", "weekday": 5, "startTime": "10:30"}], "studyType": "INDIVIDUAL_ONLINE", "teacherId": "cmqgpty3k003jem6hgjc48puz", "classroomId": "cmqgetdn00062qypbz2347c3r", "monthlyPrice": 72000}	172.18.0.2	2026-06-16 15:58:27.672
cmqgtu2pd0014m1q46g9slkd1	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgppd2u003bem6hn3469snx	{"level": "HSK 1", "phone": "7 708 383 83 83‬", "status": "ACTIVE", "fullName": "Алмаз", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 15:58:41.713
cmqguoh0i00015bzol5zzrypp	\N	CREATE	auth	\N	{"email": "director@hanbridge.kz", "password": "password123"}	172.18.0.2	2026-06-16 16:22:19.938
cmqguoh3q000b5bzovmvteqg3	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqguoh3j00025bzow5e1pzjz	{"name": "???? ?????", "schedule": [{"endTime": "00:02", "weekday": 1, "startTime": "00:01"}, {"endTime": "00:02", "weekday": 2, "startTime": "00:01"}, {"endTime": "00:02", "weekday": 3, "startTime": "00:01"}, {"endTime": "00:02", "weekday": 4, "startTime": "00:01"}, {"endTime": "00:02", "weekday": 5, "startTime": "00:01"}, {"endTime": "00:02", "weekday": 6, "startTime": "00:01"}, {"endTime": "00:02", "weekday": 7, "startTime": "00:01"}], "monthlyPrice": 48000}	172.18.0.2	2026-06-16 16:22:20.055
cmqguoh44000e5bzo71uekphs	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqguoh40000c5bzo87tophiw	{"status": "ACTIVE", "fullName": "????? ????", "startDate": "2026-06-06"}	172.18.0.2	2026-06-16 16:22:20.069
cmqguoh4e000h5bzo6ppcpa9u	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqguoh4a000f5bzos0h81wmp	{"status": "ACTIVE", "fullName": "????? ????", "startDate": "2026-06-05"}	172.18.0.2	2026-06-16 16:22:20.078
cmqguoh4t000l5bzokfnm1ccs	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqguoh4q000j5bzosp2me6ze	{"studentId": "cmqguoh40000c5bzo87tophiw"}	172.18.0.2	2026-06-16 16:22:20.093
cmqguoh55000p5bzo7lqtde42	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqguoh52000n5bzos680hg0k	{"studentId": "cmqguoh4a000f5bzos0h81wmp"}	172.18.0.2	2026-06-16 16:22:20.106
cmqguoh6y000r5bzoa8499mq5	cmqgb32pi0001awwx61vqjxn4	DELETE	groups	cmqguoh3j00025bzow5e1pzjz	\N	172.18.0.2	2026-06-16 16:22:20.171
cmqguoh7b000t5bzortmx3wcv	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqguoh40000c5bzo87tophiw	\N	172.18.0.2	2026-06-16 16:22:20.183
cmqguoh7k000v5bzowxxrn4kr	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqguoh4a000f5bzos0h81wmp	\N	172.18.0.2	2026-06-16 16:22:20.192
cmqguq7gg000x5bzohb7xklov	cmqgb32pi0001awwx61vqjxn4	UPDATE	students	cmqgppd2u003bem6hn3469snx	{"level": "HSK 1", "phone": "7 708 383 83 83‬", "status": "ACTIVE", "fullName": "Алмаз", "language": "CHINESE", "notesText": "", "startDate": "2026-06-08", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 16:23:40.865
cmqgureho00105bzoaerz84h6	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgurehf000y5bzo0q3mfczw	{"level": "HSK 1", "phone": "", "status": "NEW", "fullName": "Тест", "language": "CHINESE", "notesText": "", "startDate": "2026-05-20", "studyType": "GROUP"}	172.18.0.2	2026-06-16 16:24:36.636
cmqgurtkj00135bzowakmapwp	cmqgb32pi0001awwx61vqjxn4	CREATE	teachers	cmqgurtk800115bzoq5scjgq0	{"phone": "", "fullName": "Тест", "languages": ["CHINESE"], "hourlyRate": 5000, "paymentType": "PER_HOUR", "specialization": ""}	172.18.0.2	2026-06-16 16:24:56.18
cmqgv3iyg00015t6912pbqbup	\N	CREATE	auth	\N	{"email": "director@hanbridge.kz", "password": "password123"}	172.18.0.2	2026-06-16 16:34:02.297
cmqgv3j62000i5t693s97us8q	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgv3j5s000b5t69whabsg9c	{"name": "?????? ????? ????????", "schedule": [{"endTime": "18:00", "weekday": 1, "startTime": "17:00"}], "studyType": "GROUP", "studentIds": ["cmqgv3j1700025t69bn0m7lqy", "cmqgv3j2300055t69qymwpul3", "cmqgv3j2k00085t69zcjcnxe2"], "monthlyPrice": 48000}	172.18.0.2	2026-06-16 16:34:02.571
cmqgv3j7o000k5t692dq518z9	cmqgb32pi0001awwx61vqjxn4	DELETE	groups	cmqgv3j5s000b5t69whabsg9c	\N	172.18.0.2	2026-06-16 16:34:02.628
cmqgv3j8j000m5t69i4yclhjh	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgv3j1700025t69bn0m7lqy	\N	172.18.0.2	2026-06-16 16:34:02.659
cmqgv3j8t000o5t69yi7lmk53	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgv3j2300055t69qymwpul3	\N	172.18.0.2	2026-06-16 16:34:02.669
cmqgv3j91000q5t69f9n59whj	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgv3j2k00085t69zcjcnxe2	\N	172.18.0.2	2026-06-16 16:34:02.678
cmqgv7db3000x5t69n5wc9i8d	cmqgb32pi0001awwx61vqjxn4	CREATE	groups	cmqgv7dae000s5t69f45qwwso	{"name": "Тест", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "18:00", "weekday": 1, "startTime": "17:00"}, {"endTime": "18:00", "weekday": 3, "startTime": "17:00"}, {"endTime": "18:00", "weekday": 5, "startTime": "17:00"}], "studyType": "GROUP", "teacherId": "cmqgurtk800115bzoq5scjgq0", "studentIds": [], "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 96000}	172.18.0.2	2026-06-16 16:37:01.599
cmqgv7kd000145t69z5c798b9	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgv7dae000s5t69f45qwwso	{"name": "Тест", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "18:00", "weekday": 1, "startTime": "17:00"}, {"endTime": "18:00", "weekday": 3, "startTime": "17:00"}, {"endTime": "18:00", "weekday": 5, "startTime": "17:00"}], "studyType": "GROUP", "teacherId": "cmqgurtk800115bzoq5scjgq0", "studentIds": ["cmqgurehf000y5bzo0q3mfczw"], "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 96000}	172.18.0.2	2026-06-16 16:37:10.741
cmqgv81qi00165t699ided0t8	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgurehf000y5bzo0q3mfczw	\N	172.18.0.2	2026-06-16 16:37:33.258
cmqgv84vo00185t696sxjqbzh	cmqgb32pi0001awwx61vqjxn4	DELETE	groups	cmqgv7dae000s5t69f45qwwso	\N	172.18.0.2	2026-06-16 16:37:37.332
cmqgvb6p2001b5t69dryeqyi3	cmqgb32pi0001awwx61vqjxn4	CREATE	students	cmqgvb6ox00195t69hwyfr2aj	{"level": "", "phone": "", "status": "ACTIVE", "fullName": "тест", "language": "CHINESE", "notesText": "", "startDate": "2026-05-21", "studyType": "INDIVIDUAL"}	172.18.0.2	2026-06-16 16:39:59.654
cmqgvbee1001i5t690ewe36hq	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqf87o008hem6h50obtao1	{"name": "Елнур индив", "level": "HSK 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:30", "weekday": 1, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 4, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 5, "startTime": "19:30"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "studentIds": ["cmqgppd2u003bem6hn3469snx", "cmqgvb6ox00195t69hwyfr2aj"], "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 72000}	172.18.0.2	2026-06-16 16:40:09.626
cmqgvd5ze001n5t695032dxqv	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgqf87o008hem6h50obtao1	{"name": "Елнур индив", "level": "HSK 1", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "20:30", "weekday": 1, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 4, "startTime": "19:30"}, {"endTime": "20:30", "weekday": 5, "startTime": "19:30"}], "studyType": "INDIVIDUAL", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "studentIds": ["cmqgppd2u003bem6hn3469snx"], "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 72000}	172.18.0.2	2026-06-16 16:41:32.043
cmqgvdabp001p5t6953krx3ze	cmqgb32pi0001awwx61vqjxn4	DELETE	teachers	cmqgurtk800115bzoq5scjgq0	\N	172.18.0.2	2026-06-16 16:41:37.669
cmqgvdcrb001r5t69gaqdw0tg	cmqgb32pi0001awwx61vqjxn4	DELETE	students	cmqgvb6ox00195t69hwyfr2aj	\N	172.18.0.2	2026-06-16 16:41:40.823
cmqgvfv9r001u5t69yk17t150	cmqgb32pi0001awwx61vqjxn4	CREATE	finance	cmqgvfv9e001s5t69xx7ufyhp	{"date": "2026-06-01", "type": "EXPENSE", "amount": 160000, "category": "TARGETED_ADS"}	172.18.0.2	2026-06-16 16:43:38.127
cmqgvg18p001w5t69d8tpjgzz	cmqgb32pi0001awwx61vqjxn4	UPDATE	finance	cmqgvfv9e001s5t69xx7ufyhp	{"date": "2026-05-25", "type": "EXPENSE", "amount": 160000, "category": "TARGETED_ADS"}	172.18.0.2	2026-06-16 16:43:45.865
cmqgvgcqm001y5t694rj3mgu9	cmqgb32pi0001awwx61vqjxn4	DELETE	finance	cmqgvfv9e001s5t69xx7ufyhp	\N	172.18.0.2	2026-06-16 16:44:00.766
cmqgvgnvp00215t694fkodqrm	cmqgb32pi0001awwx61vqjxn4	CREATE	finance	cmqgvgnve001z5t69n0p7twap	{"date": "2026-07-01", "type": "EXPENSE", "amount": 100, "category": "RENT"}	172.18.0.2	2026-06-16 16:44:15.205
cmqgvguq200235t69c6rgnqlt	cmqgb32pi0001awwx61vqjxn4	DELETE	finance	cmqgvgnve001z5t69n0p7twap	\N	172.18.0.2	2026-06-16 16:44:24.074
cmqgvh4vx00265t690bv1jl0i	cmqgb32pi0001awwx61vqjxn4	CREATE	finance	cmqgvh4vm00245t69ohirxcqy	{"date": "2026-06-01", "type": "EXPENSE", "amount": 160000, "category": "TARGETED_ADS"}	172.18.0.2	2026-06-16 16:44:37.246
cmqgvhlja00295t691qzc757v	cmqgb32pi0001awwx61vqjxn4	CREATE	finance	cmqgvhliy00275t695sufbv5v	{"date": "2026-06-01", "type": "EXPENSE", "amount": 120000, "category": "SMM"}	172.18.0.2	2026-06-16 16:44:58.823
cmqgvibua002e5t6960b0we25	cmqgb32pi0001awwx61vqjxn4	UPDATE	groups	cmqgq66kg005xem6h5hc6j4nb	{"name": "Группа Елнур 1", "level": "HSK 2", "isActive": true, "language": "CHINESE", "schedule": [{"endTime": "19:30", "weekday": 1, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 4, "startTime": "18:30"}, {"endTime": "19:30", "weekday": 5, "startTime": "18:30"}], "studyType": "GROUP", "teacherId": "cmqgpsn2z003gem6hc3zwr8st", "studentIds": ["cmqgp8rjl001xem6h667m6wzy", "cmqgp9zx20020em6hid49ybd1", "cmqgpcfu90023em6h71ue8wvv", "cmqgpd43r0026em6hfdpt43hs", "cmqgpljtf002wem6hscrfsf82"], "classroomId": "cmqgetdms0060qypbxf7xcanq", "monthlyPrice": 48000}	172.18.0.2	2026-06-16 16:45:32.914
\.


--
-- Data for Name: Classroom; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Classroom" (id, name, capacity, equipment, "createdAt", "updatedAt") FROM stdin;
cmqgetdms0060qypbxf7xcanq	Этаж 1	12	Проектор, доска	2026-06-16 08:58:14.981	2026-06-16 08:58:14.981
cmqgetdmx0061qypbvqsm7tzo	Этаж 2	8	ТВ, доска	2026-06-16 08:58:14.985	2026-06-16 08:58:14.985
cmqgetdn00062qypbz2347c3r	Онлайн	100	Zoom	2026-06-16 08:58:14.989	2026-06-16 08:58:14.989
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Document" (id, name, url, "mimeType", "studentId", "uploadedById", "createdAt") FROM stdin;
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Group" (id, name, language, level, "studyType", "monthlyPrice", "isActive", "teacherId", "classroomId", "createdAt", "updatedAt") FROM stdin;
cmqgozbnk000yem6hcgorgimk	Группа Маржан 1	CHINESE	HSK 1	GROUP	48000.00	t	cmqgorgl1000mem6hn6337lr0	cmqgetdmx0061qypbvqsm7tzo	2026-06-16 13:42:48.513	2026-06-16 15:58:08.698
cmqgq1mz8004hem6hknzmtu07	Группа Маржан 2	CHINESE	HSK 1	GROUP	48000.00	t	cmqgorgl1000mem6hn6337lr0	cmqgetdmx0061qypbvqsm7tzo	2026-06-16 14:12:36.116	2026-06-16 15:58:11.605
cmqgq3hri0055em6hujpkywwl	Группа Маржан 3	CHINESE	hsk 2	GROUP	48000.00	t	cmqgorgl1000mem6hn6337lr0	cmqgetdmx0061qypbvqsm7tzo	2026-06-16 14:14:02.671	2026-06-16 15:58:15.274
cmqgq83hj006pem6hvkt2gcpv	Группа Маржан 4	CHINESE	HSK 2	GROUP	48000.00	t	cmqgorgl1000mem6hn6337lr0	cmqgetdmx0061qypbvqsm7tzo	2026-06-16 14:17:37.447	2026-06-16 15:58:18.863
cmqgq9wsm007gem6hw29rv7vp	Зюляль	CHINESE	HSK 2	INDIVIDUAL	72000.00	t	cmqgpty3k003jem6hgjc48puz	cmqgetdms0060qypbxf7xcanq	2026-06-16 14:19:02.086	2026-06-16 15:58:24.909
cmqgqb63h007wem6hmv6jb8pk	Зюляль 2	CHINESE	HSK 1	INDIVIDUAL_ONLINE	72000.00	t	cmqgpty3k003jem6hgjc48puz	cmqgetdn00062qypbz2347c3r	2026-06-16 14:20:00.797	2026-06-16 15:58:27.658
cmqgqf87o008hem6h50obtao1	Елнур индив	CHINESE	HSK 1	INDIVIDUAL	72000.00	t	cmqgpsn2z003gem6hc3zwr8st	cmqgetdms0060qypbxf7xcanq	2026-06-16 14:23:10.165	2026-06-16 16:41:32.034
cmqgq66kg005xem6h5hc6j4nb	Группа Елнур 1	CHINESE	HSK 2	GROUP	48000.00	t	cmqgpsn2z003gem6hc3zwr8st	cmqgetdms0060qypbxf7xcanq	2026-06-16 14:16:08.129	2026-06-16 16:45:32.904
\.


--
-- Data for Name: GroupStudent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GroupStudent" (id, "groupId", "studentId", "joinedAt", "leftAt", "isActive") FROM stdin;
cmqgpx5cr003pem6hfdf6hwai	cmqgozbnk000yem6hcgorgimk	cmqgpg4ac002iem6h6vsnr722	2026-06-16 14:09:06.652	\N	t
cmqgpxn35003tem6h5ssckzxx	cmqgozbnk000yem6hcgorgimk	cmqgpgx7v002lem6hqolzav57	2026-06-16 14:09:29.633	\N	t
cmqgpxr6q003xem6hofo41byy	cmqgozbnk000yem6hcgorgimk	cmqgphhqm002oem6h45vaku0z	2026-06-16 14:09:34.946	\N	t
cmqgpy2ns0041em6hqlhvlduq	cmqgozbnk000yem6hcgorgimk	cmqgpjza2002rem6hw93xdder	2026-06-16 14:09:49.816	2026-06-16 14:10:25.526	f
cmqgq1t55004oem6hn466g73b	cmqgq1mz8004hem6hknzmtu07	cmqgpev8k002cem6h0byo0x0r	2026-06-16 14:12:44.105	\N	t
cmqgq22j1004sem6h2p5yzzsz	cmqgq1mz8004hem6hknzmtu07	cmqgpe7e90029em6hhyy8po10	2026-06-16 14:12:56.27	\N	t
cmqgq29vk004wem6hwa1cjebr	cmqgq1mz8004hem6hknzmtu07	cmqgpfi49002fem6hcdm74fr0	2026-06-16 14:13:05.793	\N	t
cmqgq3t8y005cem6hbaeupvr3	cmqgq3hri0055em6hujpkywwl	cmqgp3nz3001lem6hwbewmxv1	2026-06-16 14:14:17.554	\N	t
cmqgq3vbf005gem6hpsekgefs	cmqgq3hri0055em6hujpkywwl	cmqgp65st001rem6hfwwxe9xz	2026-06-16 14:14:20.236	\N	t
cmqgq3xo0005kem6hn0q7i19m	cmqgq3hri0055em6hujpkywwl	cmqgp52q0001oem6h7yc03xvr	2026-06-16 14:14:23.28	\N	t
cmqgq41ih005oem6hl9tgi7u6	cmqgq3hri0055em6hujpkywwl	cmqgp795c001uem6h0vbardj1	2026-06-16 14:14:28.266	\N	t
cmqgq6jj80064em6hioh2uqmj	cmqgq66kg005xem6h5hc6j4nb	cmqgp8rjl001xem6h667m6wzy	2026-06-16 14:16:24.932	\N	t
cmqgq6ncf0068em6h61wkqeqy	cmqgq66kg005xem6h5hc6j4nb	cmqgp9zx20020em6hid49ybd1	2026-06-16 14:16:29.871	\N	t
cmqgq6pml006cem6hxscd84df	cmqgq66kg005xem6h5hc6j4nb	cmqgpcfu90023em6h71ue8wvv	2026-06-16 14:16:32.829	\N	t
cmqgq6t4q006gem6htowrhx5r	cmqgq66kg005xem6h5hc6j4nb	cmqgpd43r0026em6hfdpt43hs	2026-06-16 14:16:37.37	\N	t
cmqgq8by4006vem6h01252eia	cmqgq83hj006pem6hvkt2gcpv	cmqgpmjvz002zem6h5kz3hfyj	2026-06-16 14:17:48.412	\N	t
cmqgq8e75006zem6hmq6vbnbp	cmqgq83hj006pem6hvkt2gcpv	cmqgpn7f30032em6hkca1jzz6	2026-06-16 14:17:51.329	\N	t
cmqgq8sf40077em6h2f7ejoh2	cmqgq66kg005xem6h5hc6j4nb	cmqgpljtf002wem6hscrfsf82	2026-06-16 14:18:09.76	\N	t
cmqgqa22r007nem6he34vqn1c	cmqgq9wsm007gem6hw29rv7vp	cmqgpo7f70035em6heqj3kquc	2026-06-16 14:19:08.932	\N	t
cmqgqbun80088em6hspfpgapg	cmqgqb63h007wem6hmv6jb8pk	cmqgpougu0038em6hhnvtk8yl	2026-06-16 14:20:32.612	\N	t
cmqgqfn7r008oem6haqrv9v10	cmqgqf87o008hem6h50obtao1	cmqgppd2u003bem6hn3469snx	2026-06-16 14:23:29.608	\N	t
\.


--
-- Data for Name: Lead; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Lead" (id, "fullName", phone, email, language, stage, source, "acquisitionCost", comment, "managerId", "studentId", "campaignId", "createdAt", "updatedAt") FROM stdin;
cmqgopg6k0004em6hx1hdd6s6	thfc	788898	\N	CHINESE	ACTIVE	INSTAGRAM	0.00		\N	\N	\N	2026-06-16 13:35:07.821	2026-06-16 13:35:22.689
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Lesson" (id, "groupId", "teacherId", "classroomId", date, "startTime", "endTime", "durationMin", status, topic, notes, "originalTeacherId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MarketingCampaign; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MarketingCampaign" (id, name, channel, budget, "startDate", "endDate", "leadsCount", "paidCount", revenue, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Note; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Note" (id, body, "authorId", "studentId", "leadId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (id, type, status, channel, recipient, payload, message, "sentAt", "createdAt") FROM stdin;
cmqgftmv8000b31apxxmgr3o6	PAYMENT_REMINDER	SENT	manual	+7 700 555 1234	{"studentId": "cmqgftms0000431apbl95ston"}	Напоминание об оплате отправлено: ???? ??????	2026-06-16 09:26:26.564	2026-06-16 09:26:26.565
cmqgg4z17001a31apylr6kq9a	PAYMENT_REMINDER	SENT	manual		{"studentId": "cmqgg2lhd000i31apl8fox6uv"}	Напоминание об оплате отправлено: Тест	2026-06-16 09:35:15.546	2026-06-16 09:35:15.547
\.


--
-- Data for Name: Parent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Parent" (id, "fullName", phone, email, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payment" (id, "studentId", amount, method, status, "paidAt", "periodStart", "periodEnd", comment, "documentUrl", "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Payroll; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payroll" (id, "teacherId", "periodMonth", "periodYear", "hoursWorked", "hourlyRate", "baseAmount", bonus, penalty, allowance, "totalAmount", status, comment, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ScheduleSlot; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ScheduleSlot" (id, "groupId", weekday, "startTime", "endTime", "classroomId", "createdAt", "updatedAt") FROM stdin;
cmqgvd5z5001j5t698xwdxjuo	cmqgqf87o008hem6h50obtao1	1	19:30	20:30	\N	2026-06-16 16:41:32.034	2026-06-16 16:41:32.034
cmqgvd5z5001k5t69xl0f5zm4	cmqgqf87o008hem6h50obtao1	4	19:30	20:30	\N	2026-06-16 16:41:32.034	2026-06-16 16:41:32.034
cmqgvd5z5001l5t69u27q1h0w	cmqgqf87o008hem6h50obtao1	5	19:30	20:30	\N	2026-06-16 16:41:32.034	2026-06-16 16:41:32.034
cmqgvibu0002a5t6980e2gzml	cmqgq66kg005xem6h5hc6j4nb	1	18:30	19:30	\N	2026-06-16 16:45:32.904	2026-06-16 16:45:32.904
cmqgvibu0002b5t698amlvwgs	cmqgq66kg005xem6h5hc6j4nb	4	18:30	19:30	\N	2026-06-16 16:45:32.904	2026-06-16 16:45:32.904
cmqgvibu0002c5t69z09m02m9	cmqgq66kg005xem6h5hc6j4nb	5	18:30	19:30	\N	2026-06-16 16:45:32.904	2026-06-16 16:45:32.904
cmqgttd890005m1q4ui3w1fad	cmqgozbnk000yem6hcgorgimk	1	19:00	20:00	\N	2026-06-16 15:58:08.698	2026-06-16 15:58:08.698
cmqgttd890006m1q4m8hlaocw	cmqgozbnk000yem6hcgorgimk	3	19:00	20:00	\N	2026-06-16 15:58:08.698	2026-06-16 15:58:08.698
cmqgttd890007m1q4dn0p80g5	cmqgozbnk000yem6hcgorgimk	5	19:00	20:00	\N	2026-06-16 15:58:08.698	2026-06-16 15:58:08.698
cmqgttfh1000am1q4n64zhseq	cmqgq1mz8004hem6hknzmtu07	1	17:30	18:30	\N	2026-06-16 15:58:11.605	2026-06-16 15:58:11.605
cmqgttfh1000bm1q4zg8xh9sp	cmqgq1mz8004hem6hknzmtu07	3	17:30	18:30	\N	2026-06-16 15:58:11.605	2026-06-16 15:58:11.605
cmqgttfh1000cm1q4f87sjpj8	cmqgq1mz8004hem6hknzmtu07	5	17:30	18:30	\N	2026-06-16 15:58:11.605	2026-06-16 15:58:11.605
cmqgttiay000fm1q44e8wap82	cmqgq3hri0055em6hujpkywwl	1	16:00	17:00	\N	2026-06-16 15:58:15.274	2026-06-16 15:58:15.274
cmqgttiay000gm1q4kv1us8o8	cmqgq3hri0055em6hujpkywwl	3	16:00	17:00	\N	2026-06-16 15:58:15.274	2026-06-16 15:58:15.274
cmqgttiay000hm1q4gfbf0bvg	cmqgq3hri0055em6hujpkywwl	5	16:00	17:00	\N	2026-06-16 15:58:15.274	2026-06-16 15:58:15.274
cmqgttl2n000km1q4e5a9xee9	cmqgq83hj006pem6hvkt2gcpv	2	18:30	20:00	\N	2026-06-16 15:58:18.863	2026-06-16 15:58:18.863
cmqgttl2n000lm1q4wtr6yemf	cmqgq83hj006pem6hvkt2gcpv	4	18:30	20:00	\N	2026-06-16 15:58:18.863	2026-06-16 15:58:18.863
cmqgttpql000tm1q48pn3q8qu	cmqgq9wsm007gem6hw29rv7vp	1	18:00	19:00	\N	2026-06-16 15:58:24.909	2026-06-16 15:58:24.909
cmqgttpql000um1q4c8c5523y	cmqgq9wsm007gem6hw29rv7vp	3	18:00	19:00	\N	2026-06-16 15:58:24.909	2026-06-16 15:58:24.909
cmqgttpql000vm1q43x5fwei8	cmqgq9wsm007gem6hw29rv7vp	5	17:00	18:00	\N	2026-06-16 15:58:24.909	2026-06-16 15:58:24.909
cmqgttruy000ym1q4ussgfucn	cmqgqb63h007wem6hmv6jb8pk	1	10:30	11:30	\N	2026-06-16 15:58:27.658	2026-06-16 15:58:27.658
cmqgttruy000zm1q450s78dau	cmqgqb63h007wem6hmv6jb8pk	3	10:30	11:30	\N	2026-06-16 15:58:27.658	2026-06-16 15:58:27.658
cmqgttruy0010m1q4d4fi7clm	cmqgqb63h007wem6hmv6jb8pk	5	10:30	11:30	\N	2026-06-16 15:58:27.658	2026-06-16 15:58:27.658
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Student" (id, "fullName", phone, email, "birthDate", language, level, "studyType", status, "averageGrade", "startDate", "notesText", "userId", "parentId", "createdById", "createdAt", "updatedAt") FROM stdin;
cmqgpev8k002cem6h0byo0x0r	Акмоншак	7 701 434 1434	\N	\N	CHINESE	hsk 1	GROUP	ACTIVE	\N	2026-06-03 00:00:00		\N	\N	\N	2026-06-16 13:54:53.732	2026-06-16 13:54:53.732
cmqgphhqm002oem6h45vaku0z	Ерсултан	7 707 271 5032	\N	\N	CHINESE	HSK 1	GROUP	ACTIVE	\N	2026-06-15 00:00:00		\N	\N	\N	2026-06-16 13:56:56.206	2026-06-16 15:44:24.283
cmqgpgx7v002lem6hqolzav57	Ерден	7 708 210 8546	\N	\N	CHINESE	HSK 1	GROUP	ACTIVE	\N	2026-06-12 00:00:00		\N	\N	\N	2026-06-16 13:56:29.612	2026-06-16 15:44:27.306
cmqgpg4ac002iem6h6vsnr722	Хамитула	7 707 956 0410‬	\N	\N	CHINESE	HSK 1	GROUP	ACTIVE	\N	2026-06-12 00:00:00		\N	\N	\N	2026-06-16 13:55:52.116	2026-06-16 15:44:30.364
cmqgpfi49002fem6hcdm74fr0	Акжан	7 747 127 6101	\N	\N	CHINESE	HSK 1	GROUP	ACTIVE	\N	2026-06-03 00:00:00		\N	\N	\N	2026-06-16 13:55:23.385	2026-06-16 15:44:35.429
cmqgpe7e90029em6hhyy8po10	Дана	7 778 846 5915	\N	\N	CHINESE	HSK 1	GROUP	ACTIVE	\N	2026-06-03 00:00:00		\N	\N	\N	2026-06-16 13:54:22.833	2026-06-16 15:44:38.964
cmqgpd43r0026em6hfdpt43hs	Арина	7 702 501 5367	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-06-08 00:00:00		\N	\N	\N	2026-06-16 13:53:31.911	2026-06-16 15:44:44.628
cmqgpougu0038em6hhnvtk8yl	Айнура	7 705 551 10 28	\N	\N	CHINESE	HSK 1	INDIVIDUAL_ONLINE	ACTIVE	\N	2026-06-01 00:00:00		\N	\N	\N	2026-06-16 14:02:39.295	2026-06-16 15:43:51.282
cmqgpo7f70035em6heqj3kquc	Ляззат	7 777 195 52 61	\N	\N	CHINESE	HSK 2	INDIVIDUAL	ACTIVE	\N	2026-06-08 00:00:00		\N	\N	\N	2026-06-16 14:02:09.427	2026-06-16 15:43:56.788
cmqgp9zx20020em6hid49ybd1	Айгуль	+7 702 386 75 31	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-05-25 00:00:00		\N	\N	\N	2026-06-16 13:51:06.518	2026-06-16 15:45:07.681
cmqgpn7f30032em6hkca1jzz6	Амир	7 701 525 02 00	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-05-26 00:00:00		\N	\N	\N	2026-06-16 14:01:22.767	2026-06-16 15:44:02.584
cmqgpmjvz002zem6h5kz3hfyj	Диас 	7 707 144 4263	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-05-20 00:00:00		\N	\N	\N	2026-06-16 14:00:52.271	2026-06-16 15:44:05.676
cmqgp8rjl001xem6h667m6wzy	Жанайым	+7 775 274 50 44	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-06-07 00:00:00		\N	\N	\N	2026-06-16 13:50:09.009	2026-06-16 15:45:10.657
cmqgpljtf002wem6hscrfsf82	Сабрина	7 776 136 3557	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-06-04 00:00:00		\N	\N	\N	2026-06-16 14:00:05.523	2026-06-16 15:44:15.268
cmqgpjza2002rem6hw93xdder	Мария	+ 7 701 670 01 03	\N	\N	CHINESE	HSK 1	GROUP	FROZEN	\N	\N	предоплата 5000	\N	\N	\N	2026-06-16 13:58:52.25	2026-06-16 15:44:19.1
cmqgp795c001uem6h0vbardj1	Азиза	+7 778 932 25 26	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-05-20 00:00:00		\N	\N	\N	2026-06-16 13:48:58.513	2026-06-16 15:45:13.678
cmqgp65st001rem6hfwwxe9xz	Молдир	+7 778 854 27 27	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-05-27 00:00:00		\N	\N	\N	2026-06-16 13:48:07.518	2026-06-16 15:45:18.393
cmqgp52q0001oem6h7yc03xvr	Айсана	+7 775 755 08 02	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-05-27 00:00:00		\N	\N	\N	2026-06-16 13:47:16.872	2026-06-16 15:45:23.133
cmqgp3nz3001lem6hwbewmxv1	Зауре	+7  702 164 93 33	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-05-27 00:00:00		\N	\N	\N	2026-06-16 13:46:11.103	2026-06-16 15:45:32.115
cmqgpcfu90023em6h71ue8wvv	Диас 1	7 775 329 0755	\N	\N	CHINESE	HSK 2	GROUP	ACTIVE	\N	2026-05-29 00:00:00		\N	\N	\N	2026-06-16 13:53:00.466	2026-06-16 15:47:23.782
cmqgppd2u003bem6hn3469snx	Алмаз	7 708 383 83 83‬	\N	\N	CHINESE	HSK 1	INDIVIDUAL	ACTIVE	\N	2026-06-08 00:00:00		\N	\N	\N	2026-06-16 14:03:03.415	2026-06-16 16:23:40.859
\.


--
-- Data for Name: Teacher; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Teacher" (id, "fullName", phone, email, specialization, languages, "hourlyRate", "paymentType", rating, "userId", "createdAt", "updatedAt") FROM stdin;
cmqgorgl1000mem6hn6337lr0	Маржан	+7 778 500 83 56	\N	Китайский язык, hsk 5	{CHINESE}	4500.00	PER_HOUR	\N	\N	2026-06-16 13:36:41.654	2026-06-16 14:04:48.367
cmqgpsn2z003gem6hc3zwr8st	Елнур	+7 747 388 82 07	\N	Китайский язык, hsk 6	{CHINESE}	4500.00	PER_HOUR	\N	\N	2026-06-16 14:05:36.347	2026-06-16 14:05:36.347
cmqgpty3k003jem6hgjc48puz	Зюляль		\N	Китайский язык, hsk 6	{CHINESE}	0.00	PER_HOUR	\N	\N	2026-06-16 14:06:37.281	2026-06-16 14:23:48.056
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Transaction" (id, type, category, amount, date, comment, "documentUrl", "groupId", "teacherId", "studentId", "campaignId", "responsibleId", "createdById", "createdAt", "updatedAt") FROM stdin;
cmqgvh4vm00245t69ohirxcqy	EXPENSE	TARGETED_ADS	160000.00	2026-06-01 00:00:00	\N	\N	\N	\N	\N	\N	\N	\N	2026-06-16 16:44:37.234	2026-06-16 16:44:37.234
cmqgvhliy00275t695sufbv5v	EXPENSE	SMM	120000.00	2026-06-01 00:00:00	\N	\N	\N	\N	\N	\N	\N	\N	2026-06-16 16:44:58.81	2026-06-16 16:44:58.81
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, "passwordHash", "fullName", phone, role, "isActive", "lastLoginAt", "createdAt", "updatedAt") FROM stdin;
cmqgb32p60000awwx18bsuwqp	admin@hanbridge.kz	$2a$10$w.A8Xy3lWQZQaw80H1bwmuG33ytV42veJjWgxP79McQ6UjyPO0mDq	Super Admin	\N	SUPER_ADMIN	t	\N	2026-06-16 07:13:48.906	2026-06-16 07:13:48.906
cmqgb32pl0002awwx5ut0b3ar	manager@hanbridge.kz	$2a$10$w.A8Xy3lWQZQaw80H1bwmuG33ytV42veJjWgxP79McQ6UjyPO0mDq	Администратор	\N	ADMINISTRATOR	t	\N	2026-06-16 07:13:48.922	2026-06-16 07:13:48.922
cmqgb32pp0003awwxkqyp9pve	accountant@hanbridge.kz	$2a$10$w.A8Xy3lWQZQaw80H1bwmuG33ytV42veJjWgxP79McQ6UjyPO0mDq	Бухгалтер	\N	ACCOUNTANT	t	\N	2026-06-16 07:13:48.925	2026-06-16 07:13:48.925
cmqgb32ps0004awwxykcsx30z	sales@hanbridge.kz	$2a$10$w.A8Xy3lWQZQaw80H1bwmuG33ytV42veJjWgxP79McQ6UjyPO0mDq	Менеджер Продаж	\N	SALES_MANAGER	t	\N	2026-06-16 07:13:48.929	2026-06-16 07:13:48.929
cmqgb32q60008awwxlkyoejhj	marzhan@hanbridge.kz	$2a$10$w.A8Xy3lWQZQaw80H1bwmuG33ytV42veJjWgxP79McQ6UjyPO0mDq	Маржан	\N	TEACHER	t	\N	2026-06-16 07:13:48.942	2026-06-16 07:13:48.942
cmqgb32qd000bawwx53ekanuo	yelnur@hanbridge.kz	$2a$10$w.A8Xy3lWQZQaw80H1bwmuG33ytV42veJjWgxP79McQ6UjyPO0mDq	Елнур	\N	TEACHER	t	\N	2026-06-16 07:13:48.95	2026-06-16 07:13:48.95
cmqgb32qj000eawwxpujandkz	zyulyal@hanbridge.kz	$2a$10$w.A8Xy3lWQZQaw80H1bwmuG33ytV42veJjWgxP79McQ6UjyPO0mDq	Зюляль	\N	TEACHER	t	\N	2026-06-16 07:13:48.955	2026-06-16 07:13:48.955
cmqgb32pi0001awwx61vqjxn4	director@hanbridge.kz	$2a$10$w.A8Xy3lWQZQaw80H1bwmuG33ytV42veJjWgxP79McQ6UjyPO0mDq	Директор Школы	\N	DIRECTOR	t	2026-06-16 16:34:02.284	2026-06-16 07:13:48.919	2026-06-16 16:34:02.285
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0c9fd186-72c2-4345-b795-0beb4952f5cf	78cd0b63c2ba34e818e7e0916afd39a1b203a0e1d43af2c33b1bb8595f0383c5	2026-06-16 07:13:48.067409+00	0_init	\N	\N	2026-06-16 07:13:47.778755+00	1
\.


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Classroom Classroom_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classroom"
    ADD CONSTRAINT "Classroom_pkey" PRIMARY KEY (id);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: GroupStudent GroupStudent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupStudent"
    ADD CONSTRAINT "GroupStudent_pkey" PRIMARY KEY (id);


--
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- Name: Lead Lead_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: MarketingCampaign MarketingCampaign_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MarketingCampaign"
    ADD CONSTRAINT "MarketingCampaign_pkey" PRIMARY KEY (id);


--
-- Name: Note Note_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Parent Parent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Payroll Payroll_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payroll"
    ADD CONSTRAINT "Payroll_pkey" PRIMARY KEY (id);


--
-- Name: ScheduleSlot ScheduleSlot_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScheduleSlot"
    ADD CONSTRAINT "ScheduleSlot_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: Teacher Teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Attendance_lessonId_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Attendance_lessonId_studentId_key" ON public."Attendance" USING btree ("lessonId", "studentId");


--
-- Name: Attendance_studentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Attendance_studentId_idx" ON public."Attendance" USING btree ("studentId");


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_entity_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_entity_idx" ON public."AuditLog" USING btree (entity);


--
-- Name: AuditLog_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_userId_idx" ON public."AuditLog" USING btree ("userId");


--
-- Name: Classroom_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Classroom_name_key" ON public."Classroom" USING btree (name);


--
-- Name: GroupStudent_groupId_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GroupStudent_groupId_studentId_key" ON public."GroupStudent" USING btree ("groupId", "studentId");


--
-- Name: GroupStudent_studentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "GroupStudent_studentId_idx" ON public."GroupStudent" USING btree ("studentId");


--
-- Name: Group_language_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Group_language_idx" ON public."Group" USING btree (language);


--
-- Name: Group_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Group_teacherId_idx" ON public."Group" USING btree ("teacherId");


--
-- Name: Lead_managerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Lead_managerId_idx" ON public."Lead" USING btree ("managerId");


--
-- Name: Lead_source_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Lead_source_idx" ON public."Lead" USING btree (source);


--
-- Name: Lead_stage_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Lead_stage_idx" ON public."Lead" USING btree (stage);


--
-- Name: Lead_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Lead_studentId_key" ON public."Lead" USING btree ("studentId");


--
-- Name: Lesson_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Lesson_date_idx" ON public."Lesson" USING btree (date);


--
-- Name: Lesson_groupId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Lesson_groupId_idx" ON public."Lesson" USING btree ("groupId");


--
-- Name: Lesson_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Lesson_status_idx" ON public."Lesson" USING btree (status);


--
-- Name: Lesson_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Lesson_teacherId_idx" ON public."Lesson" USING btree ("teacherId");


--
-- Name: MarketingCampaign_channel_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MarketingCampaign_channel_idx" ON public."MarketingCampaign" USING btree (channel);


--
-- Name: Note_leadId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Note_leadId_idx" ON public."Note" USING btree ("leadId");


--
-- Name: Note_studentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Note_studentId_idx" ON public."Note" USING btree ("studentId");


--
-- Name: Notification_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_status_idx" ON public."Notification" USING btree (status);


--
-- Name: Notification_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_type_idx" ON public."Notification" USING btree (type);


--
-- Name: Payment_paidAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Payment_paidAt_idx" ON public."Payment" USING btree ("paidAt");


--
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- Name: Payment_studentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Payment_studentId_idx" ON public."Payment" USING btree ("studentId");


--
-- Name: Payroll_periodYear_periodMonth_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Payroll_periodYear_periodMonth_idx" ON public."Payroll" USING btree ("periodYear", "periodMonth");


--
-- Name: Payroll_teacherId_periodMonth_periodYear_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Payroll_teacherId_periodMonth_periodYear_key" ON public."Payroll" USING btree ("teacherId", "periodMonth", "periodYear");


--
-- Name: ScheduleSlot_groupId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ScheduleSlot_groupId_idx" ON public."ScheduleSlot" USING btree ("groupId");


--
-- Name: ScheduleSlot_weekday_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ScheduleSlot_weekday_idx" ON public."ScheduleSlot" USING btree (weekday);


--
-- Name: Student_language_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Student_language_idx" ON public."Student" USING btree (language);


--
-- Name: Student_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Student_status_idx" ON public."Student" USING btree (status);


--
-- Name: Student_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Student_userId_key" ON public."Student" USING btree ("userId");


--
-- Name: Teacher_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Teacher_userId_key" ON public."Teacher" USING btree ("userId");


--
-- Name: Transaction_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Transaction_category_idx" ON public."Transaction" USING btree (category);


--
-- Name: Transaction_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Transaction_date_idx" ON public."Transaction" USING btree (date);


--
-- Name: Transaction_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Transaction_type_idx" ON public."Transaction" USING btree (type);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: Attendance Attendance_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Attendance Attendance_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Document Document_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupStudent GroupStudent_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupStudent"
    ADD CONSTRAINT "GroupStudent_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupStudent GroupStudent_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupStudent"
    ADD CONSTRAINT "GroupStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Group Group_classroomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES public."Classroom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Group Group_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Lead Lead_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."MarketingCampaign"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Lead Lead_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Lesson Lesson_classroomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES public."Classroom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Lesson Lesson_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Lesson Lesson_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Note Note_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Note Note_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public."Lead"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Note Note_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payment Payment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payroll Payroll_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payroll"
    ADD CONSTRAINT "Payroll_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ScheduleSlot ScheduleSlot_classroomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScheduleSlot"
    ADD CONSTRAINT "ScheduleSlot_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES public."Classroom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ScheduleSlot ScheduleSlot_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ScheduleSlot"
    ADD CONSTRAINT "ScheduleSlot_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Student Student_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Parent"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Teacher Teacher_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."MarketingCampaign"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict r8SEWlbEJ8qbVsu2Dr5ftdVB453VTH1A2MhvyjHGGzlndWrqj5SF6tegUiiaLQW

