'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api, setToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { GraduationCap } from 'lucide-react';

const DEMO = [
  { label: 'Директор', email: 'director@hanbridge.kz' },
  { label: 'Администратор', email: 'manager@hanbridge.kz' },
  { label: 'Бухгалтер', email: 'accountant@hanbridge.kz' },
  { label: 'Менеджер', email: 'sales@hanbridge.kz' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('director@hanbridge.kz');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.accessToken);
      toast.success('Добро пожаловать!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Han Bridge CRM</h1>
          <p className="text-sm text-muted-foreground">Система управления языковой школой</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <div className="mt-6">
          <p className="mb-2 text-center text-xs text-muted-foreground">Демо-доступы (пароль: password123)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {DEMO.map((d) => (
              <button
                key={d.email}
                onClick={() => setEmail(d.email)}
                className="rounded-full border border-border px-3 py-1 text-xs transition hover:bg-accent"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
