'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickActions } from '@/components/quick-actions';
import { formatKZT, formatDate } from '@/lib/utils';
import { Users, Layers, GraduationCap, TrendingUp, TrendingDown, Wallet, AlertCircle, Trophy, Award } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777'];

const CATEGORY_LABELS: Record<string, string> = {
  RENT: 'Аренда',
  UTILITIES: 'Коммуналка',
  INTERNET: 'Интернет',
  TARGETED_ADS: 'Таргет',
  SMM: 'SMM',
  STATIONERY: 'Канцелярия',
  TEACHER_SALARY: 'Зарплата преп.',
  STAFF_SALARY: 'Зарплата сотр.',
  TAXES: 'Налоги',
  OTHER_EXPENSE: 'Прочее',
};

function StatCard({ title, value, icon: Icon, tone = 'text-foreground' }: any) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api('/dashboard')
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!data) return <p className="text-muted-foreground">Загрузка...</p>;

  const { kpis, teacherLoad, finance, upcomingLessons, topGroup, topTeacher, revenueByLanguage } = data;

  const expenseData = (finance.expensesByCategory || []).map((e: any) => ({
    name: CATEGORY_LABELS[e.category] ?? e.category,
    value: e.amount,
  }));
  const teacherChart = teacherLoad.map((t: any) => ({ name: t.fullName, Часы: t.hoursPerMonth }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Дашборд</h1>
          <p className="text-sm text-muted-foreground">Обзор ключевых показателей школы</p>
        </div>
        <QuickActions onDone={load} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Активные студенты" value={kpis.activeStudents} icon={Users} />
        <StatCard title="Группы" value={kpis.groupsCount} icon={Layers} />
        <StatCard title="Преподаватели" value={kpis.teachersCount} icon={GraduationCap} />
        <StatCard title="Студенты с просрочкой" value={kpis.overdueStudents} icon={AlertCircle} tone="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard title="Доход за месяц" value={formatKZT(kpis.monthlyRevenue)} icon={TrendingUp} tone="text-emerald-600" />
        <StatCard title="Расход за месяц" value={formatKZT(kpis.monthlyExpenses)} icon={TrendingDown} tone="text-red-600" />
        <StatCard
          title={`Чистая прибыль (маржа ${kpis.margin}%)`}
          value={formatKZT(kpis.netProfit)}
          icon={Wallet}
          tone={kpis.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}
        />
      </div>

      {/* Highlight KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-amber-500" /> Самая прибыльная группа
            </div>
            {topGroup ? (
              <>
                <p className="text-base font-semibold">{topGroup.name}</p>
                <p className="text-sm text-emerald-600">{formatKZT(topGroup.netProfit)} · {topGroup.margin}%</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-amber-500" /> Самый прибыльный преподаватель
            </div>
            {topTeacher ? (
              <>
                <p className="text-base font-semibold">{topTeacher.fullName}</p>
                <p className="text-sm text-emerald-600">{formatKZT(topTeacher.profit)}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="mb-1 text-sm text-muted-foreground">🇨🇳 Доход · Китайский</p>
            <p className="text-lg font-semibold">{formatKZT(revenueByLanguage?.CHINESE)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="mb-1 text-sm text-muted-foreground">🇬🇧 Доход · Английский</p>
            <p className="text-lg font-semibold">{formatKZT(revenueByLanguage?.ENGLISH)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Нагрузка преподавателей (часов/месяц)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={teacherChart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="Часы" fill="#dc2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Структура расходов</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseData.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {expenseData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatKZT(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ближайшие занятия</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Нет запланированных занятий. Сгенерируйте уроки из расписания групп.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {upcomingLessons.map((l: any) => (
                <li key={l.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{l.group?.name}</span>
                  <span className="text-muted-foreground">
                    {formatDate(l.date)} · {l.startTime}–{l.endTime} · {l.teacher?.fullName ?? '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
