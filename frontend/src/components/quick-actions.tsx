'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Field } from '@/components/ui/field';
import { UserPlus, Layers, Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

type Mode = 'student' | 'group' | 'payment' | 'expense' | 'lead' | null;

const EXPENSE_CATEGORIES = [
  ['RENT', 'Аренда'],
  ['UTILITIES', 'Коммунальные услуги'],
  ['INTERNET', 'Интернет'],
  ['TARGETED_ADS', 'Таргет'],
  ['SMM', 'SMM'],
  ['STATIONERY', 'Канцелярия'],
  ['TEACHER_SALARY', 'Зарплата преподавателя'],
  ['STAFF_SALARY', 'Зарплата сотрудника'],
  ['TAXES', 'Налоги'],
  ['OTHER_EXPENSE', 'Прочее'],
];
const LEAD_SOURCES = [
  ['INSTAGRAM', 'Instagram'],
  ['TIKTOK', 'TikTok'],
  ['FACEBOOK', 'Facebook'],
  ['GOOGLE_ADS', 'Google Ads'],
  ['YANDEX', 'Яндекс'],
  ['OUTDOOR', 'Наружная'],
  ['REFERRAL', 'Рекомендация'],
  ['WALK_IN', 'Пришёл сам'],
  ['OTHER', 'Прочее'],
];

export function QuickActions({ onDone }: { onDone?: () => void }) {
  const [mode, setMode] = useState<Mode>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    api('/students?pageSize=200').then((r: any) => setStudents(r.items)).catch(() => {});
    api('/teachers').then(setTeachers).catch(() => {});
  }, []);

  function open(m: Mode) {
    const defaults: Record<string, any> = {
      student: { fullName: '', phone: '', language: 'CHINESE', status: 'ACTIVE' },
      group: { name: '', monthlyPrice: 48000, language: 'CHINESE', teacherId: '' },
      payment: { studentId: '', amount: 48000, method: 'KASPI' },
      expense: { category: 'RENT', amount: 0, comment: '' },
      lead: { fullName: '', phone: '', source: 'INSTAGRAM', stage: 'NEW', language: 'CHINESE' },
    };
    setForm(defaults[m as string]);
    setMode(m);
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  async function save() {
    setSaving(true);
    try {
      if (mode === 'student') {
        if (!form.fullName.trim()) throw new Error('Введите ФИО');
        await api('/students', { method: 'POST', body: JSON.stringify(form) });
      } else if (mode === 'group') {
        if (!form.name.trim()) throw new Error('Введите название');
        await api('/groups', {
          method: 'POST',
          body: JSON.stringify({ ...form, monthlyPrice: Number(form.monthlyPrice), teacherId: form.teacherId || undefined }),
        });
      } else if (mode === 'payment') {
        if (!form.studentId) throw new Error('Выберите студента');
        await api('/payments', { method: 'POST', body: JSON.stringify({ ...form, amount: Number(form.amount) }) });
      } else if (mode === 'expense') {
        await api('/finance/transactions', {
          method: 'POST',
          body: JSON.stringify({ type: 'EXPENSE', category: form.category, amount: Number(form.amount), comment: form.comment }),
        });
      } else if (mode === 'lead') {
        if (!form.fullName.trim()) throw new Error('Введите имя');
        await api('/leads', { method: 'POST', body: JSON.stringify(form) });
      }
      toast.success('Сохранено');
      setMode(null);
      onDone?.();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  const titles: Record<string, string> = {
    student: 'Новый студент',
    group: 'Новая группа',
    payment: 'Новый платёж',
    expense: 'Новый расход',
    lead: 'Новый лид',
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => open('student')}>
          <UserPlus className="h-4 w-4" /> Студент
        </Button>
        <Button size="sm" variant="outline" onClick={() => open('group')}>
          <Layers className="h-4 w-4" /> Группа
        </Button>
        <Button size="sm" variant="outline" onClick={() => open('payment')}>
          <Wallet className="h-4 w-4" /> Платёж
        </Button>
        <Button size="sm" variant="outline" onClick={() => open('expense')}>
          <TrendingDown className="h-4 w-4" /> Расход
        </Button>
        <Button size="sm" variant="outline" onClick={() => open('lead')}>
          <TrendingUp className="h-4 w-4" /> Лид
        </Button>
      </div>

      <Modal
        open={mode !== null}
        onClose={() => setMode(null)}
        title={mode ? titles[mode] : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setMode(null)}>
              Отмена
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Сохранение...' : 'Создать'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {mode === 'student' && (
            <>
              <Field label="ФИО *">
                <Input value={form.fullName} onChange={set('fullName')} />
              </Field>
              <Field label="Телефон">
                <Input value={form.phone} onChange={set('phone')} />
              </Field>
              <Field label="Язык">
                <Select value={form.language} onChange={set('language')}>
                  <option value="CHINESE">Китайский</option>
                  <option value="ENGLISH">Английский</option>
                </Select>
              </Field>
            </>
          )}

          {mode === 'group' && (
            <>
              <Field label="Название *">
                <Input value={form.name} onChange={set('name')} />
              </Field>
              <Field label="Стоимость/мес (₸)">
                <Input type="number" value={form.monthlyPrice} onChange={set('monthlyPrice')} />
              </Field>
              <Field label="Язык">
                <Select value={form.language} onChange={set('language')}>
                  <option value="CHINESE">Китайский</option>
                  <option value="ENGLISH">Английский</option>
                </Select>
              </Field>
              <Field label="Преподаватель">
                <Select value={form.teacherId} onChange={set('teacherId')}>
                  <option value="">— не назначен —</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          )}

          {mode === 'payment' && (
            <>
              <Field label="Студент *">
                <Select value={form.studentId} onChange={set('studentId')}>
                  <option value="">— выберите —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Сумма (₸)">
                <Input type="number" value={form.amount} onChange={set('amount')} />
              </Field>
              <Field label="Способ">
                <Select value={form.method} onChange={set('method')}>
                  <option value="KASPI">Kaspi</option>
                  <option value="CASH">Наличные</option>
                  <option value="CARD">Карта</option>
                  <option value="TRANSFER">Перевод</option>
                  <option value="OTHER">Другое</option>
                </Select>
              </Field>
            </>
          )}

          {mode === 'expense' && (
            <>
              <Field label="Категория">
                <Select value={form.category} onChange={set('category')}>
                  {EXPENSE_CATEGORIES.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Сумма (₸)">
                <Input type="number" value={form.amount} onChange={set('amount')} />
              </Field>
              <Field label="Комментарий">
                <Input value={form.comment} onChange={set('comment')} />
              </Field>
            </>
          )}

          {mode === 'lead' && (
            <>
              <Field label="Имя *">
                <Input value={form.fullName} onChange={set('fullName')} />
              </Field>
              <Field label="Телефон">
                <Input value={form.phone} onChange={set('phone')} />
              </Field>
              <Field label="Источник">
                <Select value={form.source} onChange={set('source')}>
                  {LEAD_SOURCES.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </Field>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
