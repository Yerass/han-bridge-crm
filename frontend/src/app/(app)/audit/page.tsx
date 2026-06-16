'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ACTION_TONE: Record<string, any> = { CREATE: 'green', UPDATE: 'amber', DELETE: 'red' };

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [denied, setDenied] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api('/audit-logs')
      .then(setLogs)
      .catch(() => setDenied(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function factoryReset() {
    if (!confirm('СБРОС ДО ЗАВОДСКИХ удалит ВСЕ текущие данные и восстановит исходный демо-набор школы (8 групп, 3 преподавателя, 19 студентов). Это действие необратимо. Продолжить?')) return;
    setBusy(true);
    try {
      await api('/maintenance/factory-reset', { method: 'POST' });
      toast.success('Восстановлены заводские демо-данные');
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function clearAll() {
    if (!confirm('ОЧИСТИТЬ ВСЁ: будут удалены студенты, группы, преподаватели, оплаты, операции и лиды. Логины и аудитории сохранятся. Продолжить?')) return;
    setBusy(true);
    try {
      await api('/maintenance/clear', { method: 'POST' });
      toast.success('Все данные очищены — можно начинать с нуля');
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (denied) return <p className="text-muted-foreground">Доступ к аудиту только у директора и супер-админа.</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Журнал действий</h1>
          <p className="text-sm text-muted-foreground">Кто / что / когда изменил — история действий пользователей</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearAll} disabled={busy}>
            <Trash2 className="h-4 w-4" /> Очистить всё
          </Button>
          <Button variant="destructive" onClick={factoryReset} disabled={busy}>
            <RotateCcw className="h-4 w-4" /> {busy ? 'Выполняется...' : 'Сброс до заводских'}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Дата</th>
                <th className="p-4 font-medium">Пользователь</th>
                <th className="p-4 font-medium">Действие</th>
                <th className="p-4 font-medium">Объект</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-border/60 last:border-0">
                  <td className="p-4 text-muted-foreground">{new Date(l.createdAt).toLocaleString('ru-RU')}</td>
                  <td className="p-4">{l.user?.fullName ?? 'Система'}</td>
                  <td className="p-4">
                    <Badge tone={ACTION_TONE[l.action]}>{l.action}</Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {l.entity}
                    {l.entityId ? ` · ${l.entityId.slice(0, 8)}` : ''}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Записей пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
