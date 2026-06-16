'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Field } from '@/components/ui/field';
import { formatKZT } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY = {
  fullName: '',
  phone: '',
  specialization: '',
  hourlyRate: 5000,
  paymentType: 'PER_HOUR',
  rating: '',
  languages: ['CHINESE'] as string[],
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    api('/teachers').then(setTeachers).catch(() => {});
  }
  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(t: any) {
    setEditingId(t.id);
    setForm({
      fullName: t.fullName ?? '',
      phone: t.phone ?? '',
      specialization: t.specialization ?? '',
      hourlyRate: Number(t.hourlyRate) || 0,
      paymentType: t.paymentType ?? 'PER_HOUR',
      rating: t.rating ?? '',
      languages: t.languages?.length ? t.languages : ['CHINESE'],
    });
    setOpen(true);
  }

  function toggleLang(lang: string) {
    setForm((f: any) => ({
      ...f,
      languages: f.languages.includes(lang) ? f.languages.filter((l: string) => l !== lang) : [...f.languages, lang],
    }));
  }

  async function save() {
    if (!form.fullName.trim()) {
      toast.error('Введите ФИО');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        hourlyRate: Number(form.hourlyRate),
        rating: form.rating === '' ? undefined : Number(form.rating),
      };
      if (editingId) {
        await api(`/teachers/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
        toast.success('Преподаватель обновлён');
      } else {
        await api('/teachers', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Преподаватель добавлен');
      }
      setOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(t: any) {
    if (!confirm(`Удалить преподавателя «${t.fullName}»?`)) return;
    try {
      await api(`/teachers/${t.id}`, { method: 'DELETE' });
      toast.success('Преподаватель удалён');
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Преподаватели · Нагрузка</h1>
          <p className="text-sm text-muted-foreground">Часы, зарплата и прибыль считаются автоматически</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Добавить
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {teachers.map((t) => (
          <Card key={t.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{t.fullName}</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(t)} aria-label="Изменить">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(t)} aria-label="Удалить">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <Metric label="Групп" value={t.groupsCount} />
                <Metric label="Студентов" value={t.studentsCount} />
                <Metric label="Ставка" value={formatKZT(t.hourlyRate)} />
                <Metric label="Часов/нед" value={t.hoursPerWeek} />
                <Metric label="Часов/мес" value={t.hoursPerMonth} />
                <Metric label="Рейтинг" value={t.rating ?? '—'} />
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-lg bg-accent/50 p-3 text-center">
                <Metric label="Зарплата" value={formatKZT(t.salary)} tone="text-red-600" />
                <Metric label="Доход групп" value={formatKZT(t.groupsIncome)} tone="text-emerald-600" />
                <Metric label="Прибыль" value={formatKZT(t.profit)} tone="text-primary font-bold" />
              </div>
              {t.groups?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {t.groups.map((g: any) => (
                    <span key={g.id} className="rounded-md border border-border px-2 py-1 text-xs">
                      {g.name} · {g.students} студ. · {g.hoursPerWeek}ч/нед
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? 'Редактировать преподавателя' : 'Новый преподаватель'}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="ФИО *">
              <Input value={form.fullName} onChange={set('fullName')} />
            </Field>
          </div>
          <Field label="Телефон">
            <Input value={form.phone} onChange={set('phone')} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Специализация">
              <Input value={form.specialization} onChange={set('specialization')} placeholder="Китайский язык, HSK" />
            </Field>
          </div>
          <Field label="Ставка за час (₸)">
            <Input value={form.hourlyRate} onChange={set('hourlyRate')} type="number" min="0" />
          </Field>
          <Field label="Тип оплаты">
            <Select value={form.paymentType} onChange={set('paymentType')}>
              <option value="PER_HOUR">За час</option>
              <option value="FIXED">Фиксированная</option>
              <option value="PER_STUDENT">За студента</option>
            </Select>
          </Field>
          <Field label="Рейтинг (0–5)">
            <Input value={form.rating} onChange={set('rating')} type="number" min="0" max="5" step="0.1" />
          </Field>
          <Field label="Языки">
            <div className="flex gap-4 pt-2">
              {[
                { v: 'CHINESE', l: 'Китайский' },
                { v: 'ENGLISH', l: 'Английский' },
              ].map((o) => (
                <label key={o.v} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.languages.includes(o.v)} onChange={() => toggleLang(o.v)} />
                  {o.l}
                </label>
              ))}
            </div>
          </Field>
        </div>
      </Modal>
    </div>
  );
}

function Metric({ label, value, tone = 'text-foreground' }: any) {
  return (
    <div>
      <p className={`text-sm font-semibold ${tone}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
