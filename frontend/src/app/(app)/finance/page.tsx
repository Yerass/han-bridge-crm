'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Field } from '@/components/ui/field';
import { formatKZT, formatDate } from '@/lib/utils';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';

const PERIOD_LABELS: Record<string, string> = { day: 'Сегодня', week: 'Неделя', month: 'Месяц', year: 'Год' };
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const CATEGORY_LABELS: Record<string, string> = {
  STUDENT_PAYMENT: 'Оплата студента', INDIVIDUAL_LESSON: 'Индив. занятие', MATERIALS_SALE: 'Продажа материалов', OTHER_INCOME: 'Прочий доход',
  TEACHER_SALARY: 'Зарплата преп.', STAFF_SALARY: 'Зарплата сотр.', TARGETED_ADS: 'Таргет', SMM: 'SMM', STATIONERY: 'Канцелярия',
  RENT: 'Аренда', UTILITIES: 'Коммуналка', INTERNET: 'Интернет', TAXES: 'Налоги', OTHER_EXPENSE: 'Прочий расход',
};
const INCOME_CATS = ['STUDENT_PAYMENT', 'INDIVIDUAL_LESSON', 'MATERIALS_SALE', 'OTHER_INCOME'];
const EXPENSE_CATS = ['RENT', 'UTILITIES', 'INTERNET', 'TARGETED_ADS', 'SMM', 'STATIONERY', 'TEACHER_SALARY', 'STAFF_SALARY', 'TAXES', 'OTHER_EXPENSE'];

function periodLabel(p: string) {
  const [y, m] = p.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export default function FinancePage() {
  const [current, setCurrent] = useState<any>(null); // operational summary (by groups)
  const [owner, setOwner] = useState<any>(null);
  const [ownerDenied, setOwnerDenied] = useState(false);

  const [periods, setPeriods] = useState<string[]>([]);
  const [period, setPeriod] = useState<string>('');
  const [periodData, setPeriodData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ type: 'EXPENSE', category: 'RENT', amount: 0, date: '', comment: '' });
  const [saving, setSaving] = useState(false);

  const loadTop = useCallback(() => {
    api('/finance/analytics').then(setCurrent).catch(() => {});
    api('/finance/owner-overview').then(setOwner).catch(() => setOwnerDenied(true));
    api('/finance/periods').then((ps: string[]) => {
      setPeriods(ps);
      setPeriod((cur) => cur || ps[0] || '');
    }).catch(() => {});
  }, []);

  const loadPeriod = useCallback((p: string) => {
    if (!p) return;
    const [y, m] = p.split('-').map(Number);
    api(`/finance/period?year=${y}&month=${m}`).then(setPeriodData).catch(() => {});
    api(`/finance/transactions?year=${y}&month=${m}`).then(setTransactions).catch(() => {});
  }, []);

  useEffect(() => { loadTop(); }, [loadTop]);
  useEffect(() => { loadPeriod(period); }, [period, loadPeriod]);

  function refresh() {
    loadTop();
    loadPeriod(period);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ type: 'EXPENSE', category: 'RENT', amount: 0, date: period ? `${period}-01` : new Date().toISOString().slice(0, 10), comment: '' });
    setOpen(true);
  }
  function openEdit(t: any) {
    setEditingId(t.id);
    setForm({ type: t.type, category: t.category, amount: Number(t.amount), date: t.date ? String(t.date).slice(0, 10) : '', comment: t.comment ?? '' });
    setOpen(true);
  }
  function setType(type: string) {
    const c = type === 'INCOME' ? INCOME_CATS : EXPENSE_CATS;
    setForm((f: any) => ({ ...f, type, category: c.includes(f.category) ? f.category : c[0] }));
  }
  async function save() {
    setSaving(true);
    try {
      const payload = { type: form.type, category: form.category, amount: Number(form.amount), date: form.date || undefined, comment: form.comment || undefined };
      if (editingId) await api(`/finance/transactions/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      else await api('/finance/transactions', { method: 'POST', body: JSON.stringify(payload) });
      toast.success('Сохранено');
      setOpen(false);
      refresh();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  }
  async function removeTx(id: string) {
    if (!confirm('Удалить операцию?')) return;
    try { await api(`/finance/transactions/${id}`, { method: 'DELETE' }); toast.success('Удалено'); refresh(); }
    catch (e: any) { toast.error(e.message); }
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));
  const cats = form.type === 'INCOME' ? INCOME_CATS : EXPENSE_CATS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Финансы</h1>
        <p className="text-sm text-muted-foreground">Текущая сводка — по активным группам · История — по фактическим оплатам/операциям</p>
      </div>

      {/* ── ТЕКУЩАЯ СВОДКА (по группам) ── */}
      {current && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Текущая сводка (по активным группам)</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>Итоги</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Доход (группы)" value={formatKZT(current.revenue)} tone="text-emerald-600" />
                <Row label="Зарплаты преп." value={formatKZT(current.teacherSalaries)} tone="text-red-600" />
                <Row label="Прочие расходы (мес.)" value={formatKZT(current.otherExpenses)} tone="text-red-600" />
                <Row label="Прибыль" value={formatKZT(current.profit)} tone="font-semibold text-primary" />
                <Row label="Рентабельность" value={`${current.margin}%`} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Доход по направлениям</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="🇨🇳 Китайский" value={formatKZT(current.revenueByLanguage?.CHINESE)} />
                <Row label="🇬🇧 Английский" value={formatKZT(current.revenueByLanguage?.ENGLISH)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Расходы по категориям</CardTitle></CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                {(current.expensesByCategory || []).map((e: any) => (
                  <Row key={e.category} label={CATEGORY_LABELS[e.category] ?? e.category} value={formatKZT(e.amount)} />
                ))}
                {(!current.expensesByCategory || current.expensesByCategory.length === 0) && <p className="text-muted-foreground">Нет расходов</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── OWNER DASHBOARD (по датам) ── */}
      {owner && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Owner Dashboard (фактически, по датам)</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(['day', 'week', 'month', 'year'] as const).map((p) => (
              <Card key={p}>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{PERIOD_LABELS[p]}</CardTitle></CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <Row label="Доход" value={formatKZT(owner[p].revenue)} tone="text-emerald-600" />
                  <Row label="Расход" value={formatKZT(owner[p].expenses)} tone="text-red-600" />
                  <Row label="Прибыль" value={formatKZT(owner[p].profit)} tone="font-semibold text-primary" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {ownerDenied && <p className="text-xs text-muted-foreground">Owner Dashboard доступен только директору.</p>}

      {/* ── ИСТОРИЯ ПО МЕСЯЦАМ (по оплатам/операциям) ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">История по месяцам (по фактическим оплатам)</h2>
        <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-44">
          {periods.map((p) => <option key={p} value={p}>{periodLabel(p)}</option>)}
        </Select>
      </div>

      {periodData && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Доход (оплаты)</p><p className="mt-1 text-xl font-bold text-emerald-600">{formatKZT(periodData.revenue)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Расход</p><p className="mt-1 text-xl font-bold text-red-600">{formatKZT(periodData.expenses)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Прибыль ({periodData.margin}%)</p><p className="mt-1 text-xl font-bold text-primary">{formatKZT(periodData.profit)}</p></CardContent></Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Операции · {period ? periodLabel(period) : ''}</CardTitle>
          <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> Добавить</Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Дата</th><th className="p-4 font-medium">Тип</th><th className="p-4 font-medium">Категория</th>
                <th className="p-4 font-medium">Комментарий</th><th className="p-4 text-right font-medium">Сумма</th><th className="p-4 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                  <td className="p-4 text-muted-foreground">{formatDate(t.date)}</td>
                  <td className="p-4"><Badge tone={t.type === 'INCOME' ? 'green' : 'red'}>{t.type === 'INCOME' ? 'Доход' : 'Расход'}</Badge></td>
                  <td className="p-4">{CATEGORY_LABELS[t.category] ?? t.category}</td>
                  <td className="p-4 text-muted-foreground">{t.comment ?? '—'}</td>
                  <td className={`p-4 text-right font-medium ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>{formatKZT(t.amount)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)} aria-label="Изменить"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTx(t.id)} aria-label="Удалить"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Операций за этот месяц нет. Нажмите «Добавить».</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? 'Редактировать операцию' : 'Новая операция'}
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button><Button onClick={save} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</Button></>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Тип">
            <Select value={form.type} onChange={(e) => setType(e.target.value)}>
              <option value="EXPENSE">Расход</option><option value="INCOME">Доход</option>
            </Select>
          </Field>
          <Field label="Категория">
            <Select value={form.category} onChange={set('category')}>
              {cats.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>)}
            </Select>
          </Field>
          <Field label="Сумма (₸)"><Input type="number" value={form.amount} onChange={set('amount')} min="0" /></Field>
          <Field label="Дата"><Input type="date" value={form.date} onChange={set('date')} /></Field>
          <div className="sm:col-span-2"><Field label="Комментарий"><Input value={form.comment} onChange={set('comment')} /></Field></div>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value, tone = '' }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={tone}>{value}</span>
    </div>
  );
}
