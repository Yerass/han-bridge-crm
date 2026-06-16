'use client';

import { useEffect, useState } from 'react';
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
  { v: 1, l: 'Пн' },
  { v: 2, l: 'Вт' },
  { v: 3, l: 'Ср' },
  { v: 4, l: 'Чт' },
  { v: 5, l: 'Пт' },
  { v: 6, l: 'Сб' },
  { v: 7, l: 'Вс' },
];

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
  const [allStudents, setAllStudents] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [currentStudents, setCurrentStudents] = useState<any[]>([]);
  const [addStudentId, setAddStudentId] = useState('');
  const [saving, setSaving] = useState(false);

  function loadGroups() {
    api('/groups').then(setGroups).catch(() => {});
  }

  useEffect(() => {
    loadGroups();
    api('/teachers').then(setTeachers).catch(() => {});
    api('/classrooms').then(setClassrooms).catch(() => {});
    api('/students?pageSize=200').then((r: any) => setAllStudents(r.items)).catch(() => {});
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setCurrentStudents([]);
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
    setCurrentStudents(g.students ?? []);
    setAddStudentId('');
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
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function refreshEditing() {
    if (!editingId) return;
    const g = await api<any>(`/groups/${editingId}`);
    setCurrentStudents(g.students ?? []);
    loadGroups();
  }

  async function enroll() {
    if (!addStudentId) return;
    try {
      await api(`/groups/${editingId}/enroll`, { method: 'POST', body: JSON.stringify({ studentId: addStudentId }) });
      setAddStudentId('');
      await refreshEditing();
      toast.success('Студент зачислен');
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function unenroll(studentId: string) {
    try {
      await api(`/groups/${editingId}/students/${studentId}`, { method: 'DELETE' });
      await refreshEditing();
      toast.success('Студент отчислен');
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  // schedule editor helpers
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
  const enrolledIds = new Set(currentStudents.map((s) => s.id));

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
                <div className="flex items-center gap-1">
                  <Badge tone={g.margin >= 50 ? 'green' : g.margin >= 0 ? 'amber' : 'red'}>{g.margin}%</Badge>
                </div>
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
            <Button variant="outline" onClick={() => setOpen(false)}>
              Закрыть
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Название *">
              <Input value={form.name} onChange={set('name')} placeholder="HSK 2A" />
            </Field>
          </div>
          <Field label="Язык">
            <Select value={form.language} onChange={set('language')}>
              <option value="CHINESE">Китайский</option>
              <option value="ENGLISH">Английский</option>
            </Select>
          </Field>
          <Field label="Уровень">
            <Input value={form.level} onChange={set('level')} placeholder="HSK2 / B1" />
          </Field>
          <Field label="Тип">
            <Select value={form.studyType} onChange={set('studyType')}>
              <option value="GROUP">Группа</option>
              <option value="INDIVIDUAL">Индивидуально</option>
              <option value="INDIVIDUAL_ONLINE">Индивидуально онлайн</option>
            </Select>
          </Field>
          <Field label="Стоимость/мес (₸)">
            <Input value={form.monthlyPrice} onChange={set('monthlyPrice')} type="number" min="0" />
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
          <Field label="Аудитория">
            <Select value={form.classroomId} onChange={set('classroomId')}>
              <option value="">— не выбрана —</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>

          {/* Schedule editor */}
          <div className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Расписание (влияет на часы и зарплату)</span>
              <Button variant="outline" size="sm" onClick={addSlot} type="button">
                <Plus className="h-3.5 w-3.5" /> Слот
              </Button>
            </div>
            <div className="space-y-2">
              {form.schedule.length === 0 && (
                <p className="text-xs text-muted-foreground">Слотов нет — добавьте занятия.</p>
              )}
              {form.schedule.map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Select value={s.weekday} onChange={(e) => updateSlot(i, 'weekday', e.target.value)} className="w-24">
                    {WEEKDAYS.map((w) => (
                      <option key={w.v} value={w.v}>
                        {w.l}
                      </option>
                    ))}
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

          {/* Enrollment (edit mode only) */}
          {editingId && (
            <div className="sm:col-span-2 border-t border-border pt-4">
              <span className="mb-2 block text-sm font-medium">Студенты группы ({currentStudents.length})</span>
              <div className="mb-3 flex flex-wrap gap-2">
                {currentStudents.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs">
                    {s.fullName}
                    <button onClick={() => unenroll(s.id)} className="text-destructive" aria-label="Отчислить">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {currentStudents.length === 0 && <span className="text-xs text-muted-foreground">Пока никого</span>}
              </div>
              <div className="flex gap-2">
                <Select value={addStudentId} onChange={(e) => setAddStudentId(e.target.value)}>
                  <option value="">— выберите студента —</option>
                  {allStudents
                    .filter((s) => !enrolledIds.has(s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName}
                      </option>
                    ))}
                </Select>
                <Button variant="outline" onClick={enroll} type="button" disabled={!addStudentId}>
                  Зачислить
                </Button>
              </div>
            </div>
          )}
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
