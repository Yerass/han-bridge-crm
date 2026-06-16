'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatKZT, formatDate } from '@/lib/utils';
import { MessageCircle, Phone, BellRing } from 'lucide-react';
import { toast } from 'sonner';

function waLink(phone: string | null, name: string, remaining: number, amount: number) {
  const digits = (phone ?? '').replace(/\D/g, '');
  const tail =
    remaining === 0
      ? `Ваш пакет занятий закончился. Просьба оплатить следующий пакет (12 занятий) на сумму ${amount.toLocaleString('ru-RU')} ₸.`
      : `У вас осталось последнее занятие. Просьба оплатить следующий пакет (12 занятий) на сумму ${amount.toLocaleString('ru-RU')} ₸.`;
  const msg = `Здравствуйте, ${name}! ${tail} Спасибо!`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

export default function NotificationsPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [log, setLog] = useState<any[]>([]);
  const [denied, setDenied] = useState(false);

  const load = useCallback(() => {
    api('/notifications/payment-reminders')
      .then(setReminders)
      .catch(() => setDenied(true));
    api('/notifications').then(setLog).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remind(r: any) {
    if (r.phone) window.open(waLink(r.phone, r.fullName, r.remaining, r.amount), '_blank');
    try {
      await api(`/notifications/remind/${r.studentId}`, { method: 'POST' });
      toast.success(`Напоминание зафиксировано: ${r.fullName}`);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  if (denied) return <p className="text-muted-foreground">Доступ только у директора, администратора и бухгалтера.</p>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Уведомления об оплате</h1>
        <p className="text-sm text-muted-foreground">
          Пакет — 12 занятий. Остаток считается по недельной сетке группы (без отметок посещаемости). Уведомление при остатке 1 и 0.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" /> Требуют внимания ({reminders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Студент</th>
                <th className="p-4 font-medium">Группа</th>
                <th className="p-4 font-medium">Осталось</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium">Следующее занятие</th>
                <th className="p-4 font-medium">Телефон</th>
                <th className="p-4 text-right font-medium">Напомнить</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((r) => (
                <tr key={r.studentId} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                  <td className="p-4 font-medium">{r.fullName}</td>
                  <td className="p-4 text-muted-foreground">{r.groupName ?? '—'}</td>
                  <td className="p-4">
                    <Badge tone={r.remaining === 0 ? 'red' : 'amber'}>{r.remaining} из 12</Badge>
                  </td>
                  <td className="p-4">
                    <span className={r.remaining === 0 ? 'font-medium text-red-600' : 'text-amber-600'}>{r.statusLabel}</span>
                    <div className="text-xs text-muted-foreground">{r.message}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">{r.nextLesson ? formatDate(r.nextLesson) : '—'}</td>
                  <td className="p-4 text-muted-foreground">{r.phone ?? '—'}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      {r.phone && (
                        <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent" aria-label="Позвонить">
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      <Button size="sm" onClick={() => remind(r)}>
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {reminders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Нет студентов с остатком 1 или 0 занятий
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Журнал отправленных напоминаний</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Дата</th>
                <th className="p-4 font-medium">Сообщение</th>
                <th className="p-4 font-medium">Получатель</th>
                <th className="p-4 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {log.map((n) => (
                <tr key={n.id} className="border-b border-border/60 last:border-0">
                  <td className="p-4 text-muted-foreground">{new Date(n.createdAt).toLocaleString('ru-RU')}</td>
                  <td className="p-4">{n.message}</td>
                  <td className="p-4 text-muted-foreground">{n.recipient ?? '—'}</td>
                  <td className="p-4"><Badge tone={n.status === 'SENT' ? 'green' : 'amber'}>{n.status}</Badge></td>
                </tr>
              ))}
              {log.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Напоминаний пока не отправляли</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
