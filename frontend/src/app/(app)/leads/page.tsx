'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';
import { Plus, Pencil, Trash2, UserCheck, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

const STAGES = [
  { v: 'NEW', l: 'Новая заявка' },
  { v: 'CONSULTATION', l: 'Консультация' },
  { v: 'TRIAL_LESSON', l: 'Пробный урок' },
  { v: 'AWAITING_PAYMENT', l: 'Ожидание оплаты' },
  { v: 'ACTIVE', l: 'Активный студент' },
  { v: 'GRADUATE', l: 'Выпускник' },
];
const ALL_STAGES = [...STAGES, { v: 'LOST', l: 'Потерян' }];

const SOURCES: [string, string][] = [
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
const SOURCE_LABEL = Object.fromEntries(SOURCES);

const EMPTY = { fullName: '', phone: '', source: 'INSTAGRAM', stage: 'NEW', language: 'CHINESE', acquisitionCost: 0, comment: '' };

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);

  function load() {
    api('/leads')
      .then((d: any) => setLeads(d.board.flatMap((b: any) => b.leads)))
      .catch(() => {});
  }
  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(lead: any) {
    setEditingId(lead.id);
    setForm({
      fullName: lead.fullName ?? '',
      phone: lead.phone ?? '',
      source: lead.source ?? 'OTHER',
      stage: lead.stage ?? 'NEW',
      language: lead.language ?? 'CHINESE',
      acquisitionCost: Number(lead.acquisitionCost) || 0,
      comment: lead.comment ?? '',
    });
    setOpen(true);
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  async function save() {
    if (!form.fullName.trim()) {
      toast.error('Введите имя');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, acquisitionCost: Number(form.acquisitionCost) };
      if (editingId) {
        await api(`/leads/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
        toast.success('Лид обновлён');
      } else {
        await api('/leads', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Лид создан');
      }
      setOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!editingId || !confirm('Удалить лид?')) return;
    try {
      await api(`/leads/${editingId}`, { method: 'DELETE' });
      toast.success('Лид удалён');
      setOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function convert(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api(`/leads/${id}/convert`, { method: 'POST' });
      toast.success('Лид сконвертирован в студента');
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  // ── drag & drop ──────────────────────────────────────────
  async function dropTo(stage: string) {
    setOverStage(null);
    const id = draggingId;
    setDraggingId(null);
    if (!id) return;
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.stage === stage) return;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l))); // optimistic
    try {
      await api(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ stage }) });
    } catch (e: any) {
      toast.error(e.message);
      load(); // rollback
    }
  }

  const total = leads.length;
  const converted = leads.filter((l) => l.stage === 'ACTIVE' || l.stage === 'GRADUATE').length;
  const conversion = total ? ((converted / total) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Воронка продаж</h1>
          <p className="text-sm text-muted-foreground">
            Лидов: {total} · Конверсия: {conversion}% · перетаскивайте карточки между этапами
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Добавить лид
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        {STAGES.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.v);
          return (
            <div
              key={col.v}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(col.v);
              }}
              onDragLeave={() => setOverStage((s) => (s === col.v ? null : s))}
              onDrop={() => dropTo(col.v)}
              className="flex flex-col"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">{col.l}</span>
                <span className="rounded-full bg-accent px-2 text-xs">{colLeads.length}</span>
              </div>
              <div
                className={`flex-1 space-y-2 rounded-lg p-2 transition ${
                  overStage === col.v ? 'bg-primary/10 ring-2 ring-primary/40' : 'bg-accent/30'
                }`}
              >
                {colLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => setDraggingId(lead.id)}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => openEdit(lead)}
                    className={`cursor-pointer transition hover:border-primary/50 ${draggingId === lead.id ? 'opacity-40' : ''}`}
                  >
                    <CardContent className="space-y-1 p-3">
                      <div className="flex items-start gap-1">
                        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{lead.fullName}</p>
                          <p className="text-xs text-muted-foreground">{SOURCE_LABEL[lead.source] ?? lead.source}</p>
                          {lead.phone && <p className="text-xs text-muted-foreground">{lead.phone}</p>}
                        </div>
                      </div>
                      {col.v === 'AWAITING_PAYMENT' && (
                        <button
                          onClick={(e) => convert(lead.id, e)}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          <UserCheck className="h-3 w-3" /> В студенты
                        </button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {colLeads.length === 0 && <p className="px-2 py-6 text-center text-xs text-muted-foreground">—</p>}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? 'Карточка лида' : 'Новый лид'}
        footer={
          <>
            {editingId && (
              <Button variant="destructive" onClick={remove} className="mr-auto">
                <Trash2 className="h-4 w-4" /> Удалить
              </Button>
            )}
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
            <Field label="Имя *">
              <Input value={form.fullName} onChange={set('fullName')} />
            </Field>
          </div>
          <Field label="Телефон">
            <Input value={form.phone} onChange={set('phone')} />
          </Field>
          <Field label="Язык">
            <Select value={form.language} onChange={set('language')}>
              <option value="CHINESE">Китайский</option>
              <option value="ENGLISH">Английский</option>
            </Select>
          </Field>
          <Field label="Этап">
            <Select value={form.stage} onChange={set('stage')}>
              {ALL_STAGES.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Источник">
            <Select value={form.source} onChange={set('source')}>
              {SOURCES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Стоимость привлечения (₸)">
            <Input type="number" value={form.acquisitionCost} onChange={set('acquisitionCost')} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Комментарий">
              <Textarea value={form.comment} onChange={set('comment')} />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
