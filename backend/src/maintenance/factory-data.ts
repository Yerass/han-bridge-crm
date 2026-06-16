// Shared factory dataset + wipe helpers.
// Used by BOTH the CLI seed (prisma/seed.ts) and the in-app reset
// (MaintenanceService) so the demo data never drifts between them.
// Keep this file free of NestJS imports — prisma/seed.ts runs it via ts-node.
import {
  PrismaClient,
  Role,
  Language,
  StudyType,
  StudentStatus,
  PaymentMethod,
  PaymentStatus,
  TransactionType,
  FinanceCategory,
  TeacherPaymentType,
  LeadStage,
  LeadSource,
  MarketingChannel,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export const DEFAULT_PASSWORD = 'password123';

/** Truncate operational tables. Keeps User (logins) always; keeps Classroom unless classrooms=true. */
export async function wipeData(prisma: PrismaClient, opts: { classrooms?: boolean } = {}) {
  const tables = [
    'Attendance', 'Lesson', 'ScheduleSlot', 'GroupStudent', 'Payment', 'Transaction',
    'Note', 'Document', 'Lead', 'MarketingCampaign', 'Payroll', 'AuditLog',
    'Group', 'Student', 'Teacher', 'Parent',
  ];
  if (opts.classrooms) tables.push('Classroom');
  const quoted = tables.map((t) => `"${t}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE;`);
}

/** Populate the original demo dataset (real Han Bridge school data). */
export async function seedFactoryData(prisma: PrismaClient) {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const userDefs: { email: string; fullName: string; role: Role }[] = [
    { email: 'admin@hanbridge.kz', fullName: 'Super Admin', role: Role.SUPER_ADMIN },
    { email: 'director@hanbridge.kz', fullName: 'Директор Школы', role: Role.DIRECTOR },
    { email: 'manager@hanbridge.kz', fullName: 'Администратор', role: Role.ADMINISTRATOR },
    { email: 'accountant@hanbridge.kz', fullName: 'Бухгалтер', role: Role.ACCOUNTANT },
    { email: 'sales@hanbridge.kz', fullName: 'Менеджер Продаж', role: Role.SALES_MANAGER },
  ];
  for (const u of userDefs) {
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { ...u, passwordHash } });
  }

  const room1 = await prisma.classroom.upsert({ where: { name: 'Этаж 1' }, update: {}, create: { name: 'Этаж 1', capacity: 12, equipment: 'Проектор, доска' } });
  const room2 = await prisma.classroom.upsert({ where: { name: 'Этаж 2' }, update: {}, create: { name: 'Этаж 2', capacity: 8, equipment: 'ТВ, доска' } });
  const online = await prisma.classroom.upsert({ where: { name: 'Онлайн' }, update: {}, create: { name: 'Онлайн', capacity: 100, equipment: 'Zoom' } });

  async function teacher(fullName: string, email: string) {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, fullName, role: Role.TEACHER, passwordHash },
    });
    return prisma.teacher.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        fullName,
        email,
        specialization: 'Китайский язык, HSK',
        languages: [Language.CHINESE],
        hourlyRate: 5000,
        paymentType: TeacherPaymentType.PER_HOUR,
        rating: 4.7,
        userId: user.id,
      },
    });
  }
  const marzhan = await teacher('Маржан', 'marzhan@hanbridge.kz');
  const yelnur = await teacher('Елнур', 'yelnur@hanbridge.kz');
  const zyulyal = await teacher('Зюляль', 'zyulyal@hanbridge.kz');

  type GroupDef = {
    name: string;
    teacherId: string;
    type: StudyType;
    price: number;
    classroomId: string;
    students: { name: string; phone?: string }[];
    schedule: { weekday: number; start: string; end: string }[];
  };

  const groupDefs: GroupDef[] = [
    {
      name: 'Группа Маржан · Китайский A',
      teacherId: marzhan.id, type: StudyType.GROUP, price: 48000, classroomId: room1.id,
      students: [
        { name: 'Хамитула', phone: '+7 707 956 0410' },
        { name: 'Ерден', phone: '+7 708 210 8546' },
        { name: 'Ерсултан', phone: '+7 707 271 5032' },
        { name: 'Сабрина', phone: '+7 776 136 3557' },
      ],
      schedule: [{ weekday: 1, start: '17:00', end: '18:00' }, { weekday: 3, start: '17:00', end: '18:00' }, { weekday: 5, start: '17:00', end: '18:00' }],
    },
    {
      name: 'Группа Елнур · Китайский B',
      teacherId: yelnur.id, type: StudyType.GROUP, price: 48000, classroomId: room2.id,
      students: [
        { name: 'Жанайым', phone: '+7 775 274 5044' },
        { name: 'Айгуль', phone: '+7 702 386 7531' },
        { name: 'Диас', phone: '+7 775 329 0755' },
        { name: 'Арина', phone: '+7 702 501 5367' },
      ],
      schedule: [{ weekday: 1, start: '18:30', end: '19:30' }, { weekday: 4, start: '18:30', end: '19:30' }, { weekday: 5, start: '18:30', end: '19:30' }],
    },
    {
      name: 'Группа Елнур · Китайский C',
      teacherId: yelnur.id, type: StudyType.GROUP, price: 48000, classroomId: room2.id,
      students: [
        { name: 'Дана', phone: '+7 778 846 5915' },
        { name: 'Акжан', phone: '+7 747 127 6101' },
        { name: 'Акмоншак', phone: '+7 701 434 1434' },
      ],
      schedule: [{ weekday: 2, start: '19:00', end: '20:30' }, { weekday: 4, start: '19:00', end: '20:30' }],
    },
    {
      name: 'Группа Маржан · Китайский D',
      teacherId: marzhan.id, type: StudyType.GROUP, price: 48000, classroomId: room1.id,
      students: [
        { name: 'Молдир', phone: '+7 778 854 2727' },
        { name: 'Айсана', phone: '+7 775 755 0802' },
        { name: 'Зауре', phone: '+7 702 164 9333' },
        { name: 'Азиза', phone: '+7 778 932 2526' },
      ],
      schedule: [{ weekday: 1, start: '17:00', end: '18:00' }, { weekday: 3, start: '17:00', end: '18:00' }, { weekday: 5, start: '17:00', end: '18:00' }],
    },
    {
      name: 'Индивидуально · Ляззат',
      teacherId: zyulyal.id, type: StudyType.INDIVIDUAL, price: 72000, classroomId: room1.id,
      students: [{ name: 'Ляззат', phone: '+7 777 195 5261' }],
      schedule: [{ weekday: 1, start: '18:00', end: '19:00' }, { weekday: 3, start: '18:00', end: '19:00' }, { weekday: 5, start: '17:00', end: '18:00' }],
    },
    {
      name: 'Онлайн · Айнура',
      teacherId: zyulyal.id, type: StudyType.INDIVIDUAL_ONLINE, price: 72000, classroomId: online.id,
      students: [{ name: 'Айнура', phone: '+7 705 551 1028' }],
      schedule: [{ weekday: 1, start: '10:30', end: '11:30' }, { weekday: 3, start: '10:30', end: '11:30' }, { weekday: 5, start: '10:30', end: '11:30' }],
    },
    {
      name: 'Онлайн · Нурила',
      teacherId: zyulyal.id, type: StudyType.INDIVIDUAL_ONLINE, price: 72000, classroomId: online.id,
      students: [{ name: 'Нурила' }],
      schedule: [{ weekday: 2, start: '16:40', end: '17:40' }, { weekday: 4, start: '16:40', end: '17:40' }],
    },
    {
      name: 'Индивидуально · Даниал',
      teacherId: marzhan.id, type: StudyType.INDIVIDUAL, price: 72000, classroomId: room2.id,
      students: [{ name: 'Даниал' }],
      schedule: [{ weekday: 4, start: '10:00', end: '11:30' }, { weekday: 6, start: '10:00', end: '11:30' }],
    },
  ];

  for (const g of groupDefs) {
    const group = await prisma.group.create({
      data: {
        name: g.name,
        language: Language.CHINESE,
        studyType: g.type,
        monthlyPrice: g.price,
        teacherId: g.teacherId,
        classroomId: g.classroomId,
        scheduleSlots: {
          create: g.schedule.map((s) => ({ weekday: s.weekday, startTime: s.start, endTime: s.end, classroomId: g.classroomId })),
        },
      },
    });

    for (const s of g.students) {
      await prisma.student.create({
        data: {
          fullName: s.name,
          phone: s.phone,
          language: Language.CHINESE,
          studyType: g.type,
          status: StudentStatus.ACTIVE,
          startDate: new Date('2026-04-01'),
          enrollments: { create: { groupId: group.id } },
          payments: {
            create: {
              amount: g.price,
              method: PaymentMethod.KASPI,
              status: PaymentStatus.PAID,
              paidAt: new Date('2026-06-01'),
              periodStart: new Date('2026-06-01'),
              periodEnd: new Date('2026-07-01'),
              comment: 'Оплата за месяц',
            },
          },
        },
      });
    }
  }

  const expenses: { category: FinanceCategory; amount: number; comment: string }[] = [
    { category: FinanceCategory.RENT, amount: 250000, comment: 'Аренда помещения' },
    { category: FinanceCategory.UTILITIES, amount: 35000, comment: 'Коммунальные услуги' },
    { category: FinanceCategory.INTERNET, amount: 12000, comment: 'Интернет' },
    { category: FinanceCategory.TARGETED_ADS, amount: 120000, comment: 'Таргет Instagram' },
    { category: FinanceCategory.SMM, amount: 80000, comment: 'SMM-специалист' },
    { category: FinanceCategory.STATIONERY, amount: 18000, comment: 'Канцелярия' },
  ];
  for (const e of expenses) {
    await prisma.transaction.create({
      data: { type: TransactionType.EXPENSE, category: e.category, amount: e.amount, comment: e.comment, date: new Date('2026-06-05') },
    });
  }

  const campaign = await prisma.marketingCampaign.create({
    data: {
      name: 'Instagram Июнь 2026',
      channel: MarketingChannel.INSTAGRAM,
      budget: 120000,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-30'),
      leadsCount: 24,
      paidCount: 6,
      revenue: 288000,
    },
  });

  const leadDefs: { name: string; stage: LeadStage; source: LeadSource }[] = [
    { name: 'Айдана Қ.', stage: LeadStage.NEW, source: LeadSource.INSTAGRAM },
    { name: 'Бекзат С.', stage: LeadStage.CONSULTATION, source: LeadSource.TIKTOK },
    { name: 'Гульнур М.', stage: LeadStage.TRIAL_LESSON, source: LeadSource.INSTAGRAM },
    { name: 'Данияр Т.', stage: LeadStage.AWAITING_PAYMENT, source: LeadSource.REFERRAL },
    { name: 'Ерлан Ж.', stage: LeadStage.NEW, source: LeadSource.GOOGLE_ADS },
  ];
  for (const l of leadDefs) {
    await prisma.lead.create({
      data: { fullName: l.name, stage: l.stage, source: l.source, language: Language.CHINESE, acquisitionCost: 5000, campaignId: campaign.id },
    });
  }
}
