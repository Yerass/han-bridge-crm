'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Field } from '@/components/ui/field';
import { formatKZT } from '@/lib/utils';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const WEEKDAYS = [
  { v: 1, l: 'Пн' }, { v: 2, l: 'Вт' }, { v: 3, l: 'Ср' }, { v: 4, l: 'Чт' }, { v: 5, l: 'Пт' }, { v: 6, l: 'Сб' }, { v: 7, l: 'Вс' },
];

const LEVELS: Record<string, string[]> = {
  CHINESE: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'],
  ENGLISH: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
};

const TYPE_LABEL: Record<string, string> = { GROUP: 'групповые', INDIVIDUAL: 'индивидуальные', INDIVIDUAL_ONLINE: 'индивидуальные' };

// студент подходит группе по типу обучения
function typeMatches(groupType: string, studentType: string) {
  if (groupType === 'GROUP') return studentType === 'GROUP';
  return studentType === 'INDIVIDUAL' || studentType === 'INDIVIDUAL_ONLINE';
}

const EMPTY = {
  name: '',
  language: 'CHINESE',
  level: '',
  studyType: 'GROUP',
  monthlyPrice: 48000,
  teacherId: '',
  classroomId: '',
  isActive: true,
  schedule: [] as { weekday: number; startTime: string; endTime: string }[],
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [freeStudents, setFreeStudents] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [selected, setSelected] = useState<{ id: string; fullName: string }[]>([]); // студенты группы (staged)
  const [picks, setPicks] = useState<string[]>([]); // отмеченные в списке доступных
  const [saving, setSaving] = useState(false);

  function loadGroups() {
    api('/groups').then(setGroups).catch(() => {});
  }
  function loadFree() {
    api('/students/available').then(setFreeStudents).catch(() => {});
  }
  useEffect(() => {
    loadGroups();
    api('/teachers').then(setTeachers).catch(() => {});
    api('/classrooms').then(setClassrooms).catch(() => {});
    loadFree();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setSelected([]);
    setPicks([]);
    setOpen(true);
  }
  function openEdit(g: any) {
    setEditingId(g.id);
    setForm({
      name: g.name ?? '',
      language: g.language ?? 'CHINESE',
      level: g.level ?? '',
      studyType: g.studyType ?? 'GROUP',
      monthlyPrice: Number(g.monthlyPrice) || 0,
      teacherId: g.teacher?.id ?? '',
      classroomId: g.classroom?.id ?? '',
      isActive: g.isActive ?? true,
      schedule: (g.scheduleSlots ?? []).map((s: any) => ({ weekday: s.weekday, startTime: s.startTime, endTime: s.endTime })),
    });
    setSelected((g.students ?? []).map((s: any) => ({ id: s.id, fullName: s.fullName })));
    setPicks([]);
    setOpen(true);
  }

  function buildPayload() {
    return {
      name: form.name,
      language: form.language,
      level: form.level || undefined,
      studyType: form.studyType,
      monthlyPrice: Number(form.monthlyPrice),
      teacherId: form.teacherId || undefined,
      classroomId: form.classroomId || undefined,
      isActive: form.isActive,
      schedule: form.schedule.filter((s: any) => s.startTime && s.endTime),
      studentIds: selected.map((s) => s.id),
    };
  }

  async function save() {
    if (!form.name.trim()) {
      toast.error('Введите название группы');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api(`/groups/${editingId}`, { method: 'PATCH', body: JSON.stringify(buildPayload()) });
        toast.success('Группа обновлена');
      } else {
        await api('/groups', { method: 'POST', body: JSON.stringify(buildPayload()) });
        toast.success('Группа создана');
      }
      setOpen(false);
      loadGroups();
      loadFree();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(g: any) {
    if (!confirm(`Удалить группу «${g.name}»?`)) return;
    try {
      await api(`/groups/${g.id}`, { method: 'DELETE' });
      toast.success('Группа удалена');
      loadGroups();
      loadFree();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  // ── студенты: staged выбор ──
  const availableToAdd = useMemo(
    () => freeStudents.filter((s) => typeMatches(form.studyType, s.studyType) && !selected.some((x) => x.id === s.id)),
    [freeStudents, form.studyType, selected],
  );
  function togglePick(id: string) {
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }
  function addPicked() {
    const toAdd = availableToAdd.filter((s) => picks.includes(s.id)).map((s) => ({ id: s.id, fullName: s.fullName }));
    setSelected((prev) => [...prev, ...toAdd]);
    setPicks([]);
  }
  function removeSelected(id: string) {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  }

  // ── расписание ──
  function addSlot() {
    setForm((f: any) => ({ ...f, schedule: [...f.schedule, { weekday: 1, startTime: '17:00', endTime: '18:00' }] }));
  }
  function updateSlot(i: number, key: string, value: any) {
    setForm((f: any) => {
      const schedule = [...f.schedule];
      schedule[i] = { ...schedule[i], [key]: key === 'weekday' ? Number(value) : value };
      return { ...f, schedule };
    });
  }
  function removeSlot(i: number) {
    setForm((f: any) => ({ ...f, schedule: f.schedule.filter((_: any, idx: number) => idx !== i) }));
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));
  const setLanguage = (e: any) => {
    const language = e.target.value;
    setForm((f: any) => ({ ...f, language, level: LEVELS[language]?.includes(f.level) ? f.level : '' }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Группы · Доходность</h1>
          <p className="text-sm text-muted-foreground">Прибыль = Доход − Зарплата − Расходы группы</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Добавить
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{g.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.teacher?.fullName ?? 'Без преподавателя'} · {g.classroom?.name ?? '—'}
                  </p>
                </div>
                <Badge tone={g.margin >= 50 ? 'green' : g.margin >= 0 ? 'amber' : 'red'}>{g.margin}%</Badge>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <Row label="Студентов" value={g.studentsCount} />
                <Row label="Цена/мес" value={formatKZT(g.monthlyPrice)} />
                <Row label="Часов/мес" value={g.hoursPerMonth} />
                <Row label="Доход" value={formatKZT(g.income)} tone="text-emerald-600" />
                <Row label="Зарплата" value={formatKZT(g.teacherCost)} tone="text-red-600" />
                <Row label="Прибыль" value={formatKZT(g.netProfit)} tone="font-semibold text-primary" />
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(g)}>
                  <Pencil className="h-3.5 w-3.5" /> Изменить
                </Button>
                <Button variant="outline" size="sm" onClick={() => remove(g)} aria-label="Удалить">
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? 'Редактировать группу' : 'Новая группа'}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Закрыть</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Название *"><Input value={form.name} onChange={set('name')} placeholder="HSK 2A" /></Field>
          </div>
          <Field label="Язык">
            <Select value={form.language} onChange={setLanguage}>
              <option value="CHINESE">Китайский</option>
              <option value="ENGLISH">Английский</option>
            </Select>
          </Field>
          <Field label="Уровень">
            <Select value={form.level} onChange={set('level')}>
              <option value="">— не указан —</option>
              {LEVELS[form.language]?.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              {form.level && !LEVELS[form.language]?.includes(form.level) && <option value={form.level}>{form.level} (старое)</option>}
            </Select>
          </Field>
          <Field label="Тип">
            <Select value={form.studyType} onChange={set('studyType')}>
              <option value="GROUP">Групповое</option>
              <option value="INDIVIDUAL">Индивидуальное</option>
              <option value="INDIVIDUAL_ONLINE">Индивидуально онлайн</option>
            </Select>
          </Field>
          <Field label="Стоимость/мес (₸)"><Input value={form.monthlyPrice} onChange={set('monthlyPrice')} type="number" min="0" /></Field>
          <Field label="Преподаватель">
            <Select value={form.teacherId} onChange={set('teacherId')}>
              <option value="">— не назначен —</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </Select>
          </Field>
          <Field label="Аудитория">
            <Select value={form.classroomId} onChange={set('classroomId')}>
              <option value="">— не выбрана —</option>
              {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>

          {/* Расписание */}
          <div className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Расписание (влияет на часы и зарплату)</span>
              <Button variant="outline" size="sm" onClick={addSlot} type="button"><Plus className="h-3.5 w-3.5" /> Слот</Button>
            </div>
            <div className="space-y-2">
              {form.schedule.length === 0 && <p className="text-xs text-muted-foreground">Слотов нет — добавьте занятия.</p>}
              {form.schedule.map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Select value={s.weekday} onChange={(e) => updateSlot(i, 'weekday', e.target.value)} className="w-24">
                    {WEEKDAYS.map((w) => <option key={w.v} value={w.v}>{w.l}</option>)}
                  </Select>
                  <Input type="time" value={s.startTime} onChange={(e) => updateSlot(i, 'startTime', e.target.value)} />
                  <span className="text-muted-foreground">—</span>
                  <Input type="time" value={s.endTime} onChange={(e) => updateSlot(i, 'endTime', e.target.value)} />
                  <Button variant="ghost" size="icon" type="button" onClick={() => removeSlot(i)} aria-label="Удалить слот">
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Студенты группы — показывается сразу, и при создании */}
          <div className="sm:col-span-2 border-t border-border pt-4">
            <span className="mb-2 block text-sm font-medium">Студенты группы ({selected.length})</span>
            <div className="mb-3 flex flex-wrap gap-2">
              {selected.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs">
                  {s.fullName}
                  <button onClick={() => removeSelected(s.id)} className="text-destructive" aria-label="Убрать"><X className="h-3 w-3" /></button>
                </span>
              ))}
              {selected.length === 0 && <span className="text-xs text-muted-foreground">Пока никого</span>}
            </div>

            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Свободные студенты ({TYPE_LABEL[form.studyType]}):
            </p>
            <div className="max-h-44 space-y-1 overflow-auto rounded-md border border-border p-2">
              {availableToAdd.map((s) => (
                <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent">
                  <input type="checkbox" checked={picks.includes(s.id)} onChange={() => togglePick(s.id)} />
                  <span>{s.fullName}</span>
                  {s.level && <span className="text-xs text-muted-foreground">· {s.level}</span>}
                </label>
              ))}
              {availableToAdd.length === 0 && (
                <p className="px-2 py-3 text-center text-xs text-muted-foreground">Нет свободных студентов этого типа</p>
              )}
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm" type="button" onClick={addPicked} disabled={picks.length === 0}>
                <Plus className="h-3.5 w-3.5" /> Добавить выбранных ({picks.length})
              </Button>
            </div>
          </div>
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
