'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

const WEEKDAYS = [
  { v: 1, l: 'Пн' },
  { v: 2, l: 'Вт' },
  { v: 3, l: 'Ср' },
  { v: 4, l: 'Чт' },
  { v: 5, l: 'Пт' },
  { v: 6, l: 'Сб' },
  { v: 7, l: 'Вс' },
];

const DAY_START = 9 * 60; // 09:00
const DAY_END = 21 * 60; // 21:00
const PX_PER_MIN = 0.8;
const GRID_H = (DAY_END - DAY_START) * PX_PER_MIN;
const HOURS = Array.from({ length: (DAY_END - DAY_START) / 60 + 1 }, (_, i) => 9 + i);

const NO_ROOM = '__none__';

function minutesOf(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const STUDY_STYLE: Record<string, string> = {
  GROUP: 'bg-blue-500/15 border-blue-500/50 text-blue-700 dark:text-blue-300',
  INDIVIDUAL: 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300',
  INDIVIDUAL_ONLINE: 'bg-purple-500/15 border-purple-500/50 text-purple-700 dark:text-purple-300',
};

type Slot = {
  id: string;
  groupName: string;
  studyType: string;
  teacherName: string | null;
  classroomId: string | null;
  weekday: number;
  startTime: string;
  endTime: string;
};

// lane packing within a single day column so overlapping blocks sit side by side
function layoutDay(daySlots: Slot[]) {
  const items = daySlots
    .map((s) => ({ ...s, startMin: minutesOf(s.startTime), endMin: minutesOf(s.endTime) }))
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  const out: (typeof items[number] & { lane: number; cols: number; conflict: boolean })[] = [];
  let cluster: typeof items = [];
  let clusterEnd = -1;

  const flush = () => {
    if (!cluster.length) return;
    const laneEnds: number[] = [];
    const placed = cluster.map((s) => {
      let lane = laneEnds.findIndex((end) => end <= s.startMin);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(s.endMin);
      } else {
        laneEnds[lane] = s.endMin;
      }
      return { ...s, lane };
    });
    const cols = laneEnds.length;
    placed.forEach((s) => {
      const conflict = cluster.some((o) => o.id !== s.id && o.startMin < s.endMin && o.endMin > s.startMin);
      out.push({ ...s, cols, conflict });
    });
    cluster = [];
    clusterEnd = -1;
  };

  for (const s of items) {
    if (cluster.length && s.startMin >= clusterEnd) flush();
    cluster.push(s);
    clusterEnd = Math.max(clusterEnd, s.endMin);
  }
  flush();
  return out;
}

export default function SchedulePage() {
  const [data, setData] = useState<{ classrooms: any[]; slots: Slot[] } | null>(null);
  const [floor, setFloor] = useState<string>('');

  useEffect(() => {
    api('/schedule')
      .then((d: any) => {
        setData(d);
        setFloor(d.classrooms[0]?.id ?? NO_ROOM);
      })
      .catch(() => {});
  }, []);

  const floors = useMemo(() => {
    if (!data) return [];
    const list = data.classrooms.map((c) => ({ id: c.id, name: c.name }));
    if (data.slots.some((s) => !s.classroomId)) list.push({ id: NO_ROOM, name: 'Без аудитории' });
    return list;
  }, [data]);

  const floorSlots = useMemo(() => {
    if (!data) return [];
    return data.slots.filter((s) => (floor === NO_ROOM ? !s.classroomId : s.classroomId === floor));
  }, [data, floor]);

  const occupiedHours = useMemo(
    () => floorSlots.reduce((sum, s) => sum + (minutesOf(s.endTime) - minutesOf(s.startTime)) / 60, 0),
    [floorSlots],
  );
  const conflictsCount = useMemo(() => {
    let c = 0;
    for (const wd of WEEKDAYS) c += layoutDay(floorSlots.filter((s) => s.weekday === wd.v)).filter((x) => x.conflict).length;
    return c;
  }, [floorSlots]);

  if (!data) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Расписание · недельная сетка</h1>
        <p className="text-sm text-muted-foreground">
          Занятость по этажам — видно, где свободно и куда можно посадить группу/индивидуальное
        </p>
      </div>

      {/* Floor tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {floors.map((f) => {
          const count = data.slots.filter((s) => (f.id === NO_ROOM ? !s.classroomId : s.classroomId === f.id)).length;
          return (
            <button
              key={f.id}
              onClick={() => setFloor(f.id)}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm font-medium transition',
                floor === f.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-accent',
              )}
            >
              {f.name} <span className="opacity-70">· {count}</span>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-muted-foreground">
          Занятий в неделю: <span className="font-semibold text-foreground">{floorSlots.length}</span>
        </span>
        <span className="text-muted-foreground">
          Часов/неделю: <span className="font-semibold text-foreground">{occupiedHours.toFixed(1)}</span>
        </span>
        {conflictsCount > 0 && (
          <span className="flex items-center gap-1 font-medium text-red-600">
            <AlertTriangle className="h-4 w-4" /> Пересечений: {conflictsCount}
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <Legend className="bg-blue-500/15 border-blue-500/50" label="Группа" />
        <Legend className="bg-emerald-500/15 border-emerald-500/50" label="Индивидуальное" />
        <Legend className="bg-purple-500/15 border-purple-500/50" label="Онлайн" />
        <Legend className="border-red-500 bg-red-500/10" label="Пересечение" />
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-4">
          <div className="min-w-[760px]">
            {/* header */}
            <div className="grid" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
              <div />
              {WEEKDAYS.map((d) => (
                <div key={d.v} className="pb-2 text-center text-sm font-semibold">
                  {d.l}
                </div>
              ))}
            </div>

            {/* body */}
            <div className="grid" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
              {/* time axis */}
              <div className="relative" style={{ height: GRID_H }}>
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute right-1 -translate-y-1/2 text-xs text-muted-foreground"
                    style={{ top: (h * 60 - DAY_START) * PX_PER_MIN }}
                  >
                    {String(h).padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* day columns */}
              {WEEKDAYS.map((d) => {
                const placed = layoutDay(floorSlots.filter((s) => s.weekday === d.v));
                return (
                  <div key={d.v} className="relative border-l border-border" style={{ height: GRID_H }}>
                    {/* hour gridlines */}
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        className="absolute inset-x-0 border-t border-border/60"
                        style={{ top: (h * 60 - DAY_START) * PX_PER_MIN }}
                      />
                    ))}
                    {/* blocks */}
                    {placed.map((s) => {
                      const top = (s.startMin - DAY_START) * PX_PER_MIN;
                      const height = Math.max((s.endMin - s.startMin) * PX_PER_MIN, 20);
                      const widthPct = 100 / s.cols;
                      return (
                        <div
                          key={s.id}
                          className={cn(
                            'absolute overflow-hidden rounded-md border px-1.5 py-1 text-[11px] leading-tight shadow-sm',
                            STUDY_STYLE[s.studyType] ?? STUDY_STYLE.GROUP,
                            s.conflict && 'ring-2 ring-red-500',
                          )}
                          style={{ top, height, left: `calc(${s.lane * widthPct}% + 2px)`, width: `calc(${widthPct}% - 4px)` }}
                          title={`${s.groupName} · ${s.startTime}–${s.endTime}${s.teacherName ? ' · ' + s.teacherName : ''}`}
                        >
                          <div className="flex items-center gap-1 font-semibold">
                            {s.conflict && <AlertTriangle className="h-3 w-3 shrink-0 text-red-600" />}
                            <span className="truncate">{s.groupName}</span>
                          </div>
                          <div className="opacity-80">
                            {s.startTime}–{s.endTime}
                          </div>
                          {s.teacherName && height > 44 && <div className="truncate opacity-70">{s.teacherName}</div>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('inline-block h-3 w-3 rounded border', className)} />
      {label}
    </span>
  );
}
