'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';
import { formatDate } from '@/lib/utils';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS: Record<string, { label: string; tone: any }> = {
  ACTIVE: { label: 'Активен', tone: 'green' },
  NEW: { label: 'Новый', tone: 'blue' },
  TRIAL: { label: 'Пробный', tone: 'amber' },
  FROZEN: { label: 'Заморожен', tone: 'amber' },
  GRADUATED: { label: 'Выпускник', tone: 'default' },
  DROPPED: { label: 'Отток', tone: 'red' },
};
const LANG: Record<string, string> = { CHINESE: '🇨🇳 Китайский', ENGLISH: '🇬🇧 Английский' };

const EMPTY = {
  fullName: '',
  phone: '',
  language: 'CHINESE',
  level: '',
  studyType: 'GROUP',
  status: 'NEW',
  startDate: '',
  notesText: '',
};

export default function StudentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await api<any>(`/students?search=${encodeURIComponent(search)}&pageSize=100`);
    setItems(res.items);
    setTotal(res.total);
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(s: any) {
    setEditingId(s.id);
    setForm({
      fullName: s.fullName ?? '',
      phone: s.phone ?? '',
      language: s.language ?? 'CHINESE',
      level: s.level ?? '',
      studyType: s.studyType ?? 'GROUP',
      status: s.status ?? 'NEW',
      startDate: s.startDate ? String(s.startDate).slice(0, 10) : '',
      notesText: s.notesText ?? '',
    });
    setOpen(true);
  }

  async function save() {
    if (!form.fullName.trim()) {
      toast.error('Введите ФИО');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, startDate: form.startDate || undefined };
      if (editingId) {
        await api(`/students/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
        toast.success('Студент обновлён');
      } else {
        await api('/students', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Студент добавлен');
      }
      setOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(s: any) {
    if (!confirm(`Удалить студента «${s.fullName}»?`)) return;
    try {
      await api(`/students/${s.id}`, { method: 'DELETE' });
      toast.success('Студент удалён');
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Студенты</h1>
          <p className="text-sm text-muted-foreground">Всего: {total}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-56 rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">ФИО</th>
                <th className="p-4 font-medium">Телефон</th>
                <th className="p-4 font-medium">Язык</th>
                <th className="p-4 font-medium">Группа</th>
                <th className="p-4 font-medium">Начало</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                  <td className="p-4 font-medium">{s.fullName}</td>
                  <td className="p-4 text-muted-foreground">{s.phone ?? '—'}</td>
                  <td className="p-4">{LANG[s.language] ?? s.language}</td>
                  <td className="p-4 text-muted-foreground">{s.enrollments?.[0]?.group?.name ?? '—'}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(s.startDate)}</td>
                  <td className="p-4">
                    <Badge tone={STATUS[s.status]?.tone}>{STATUS[s.status]?.label ?? s.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)} aria-label="Изменить">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(s)} aria-label="Удалить">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Ничего не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? 'Редактировать студента' : 'Новый студент'}
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
              <Input value={form.fullName} onChange={set('fullName')} placeholder="Иванов Иван" />
            </Field>
          </div>
          <Field label="Телефон">
            <Input value={form.phone} onChange={set('phone')} placeholder="+7 ..." />
          </Field>
          <Field label="Язык">
            <Select value={form.language} onChange={set('language')}>
              <option value="CHINESE">Китайский</option>
              <option value="ENGLISH">Английский</option>
            </Select>
          </Field>
          <Field label="Уровень">
            <Input value={form.level} onChange={set('level')} placeholder="HSK2 / B1" />
          </Field>
          <Field label="Тип обучения">
            <Select value={form.studyType} onChange={set('studyType')}>
              <option value="GROUP">Группа</option>
              <option value="INDIVIDUAL">Индивидуально</option>
              <option value="INDIVIDUAL_ONLINE">Индивидуально онлайн</option>
            </Select>
          </Field>
          <Field label="Статус">
            <Select value={form.status} onChange={set('status')}>
              <option value="NEW">Новый</option>
              <option value="TRIAL">Пробный</option>
              <option value="ACTIVE">Активен</option>
              <option value="FROZEN">Заморожен</option>
              <option value="GRADUATED">Выпускник</option>
              <option value="DROPPED">Отток</option>
            </Select>
          </Field>
          <Field label="Дата начала">
            <Input value={form.startDate} onChange={set('startDate')} type="date" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Заметка">
              <Textarea value={form.notesText} onChange={set('notesText')} />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
