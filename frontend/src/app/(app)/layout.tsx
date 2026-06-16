'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearToken, getToken } from '@/lib/api';
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Супер-админ',
  DIRECTOR: 'Директор',
  ADMINISTRATOR: 'Администратор',
  ACCOUNTANT: 'Бухгалтер',
  SALES_MANAGER: 'Менеджер продаж',
  TEACHER: 'Преподаватель',
  STUDENT: 'Студент',
  PARENT: 'Родитель',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    api('/auth/me')
      .then((u: any) => {
        setUser(u);
        setReady(true);
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  function logout() {
    clearToken();
    router.replace('/login');
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="text-sm text-muted-foreground">
            {user && (
              <>
                <span className="font-medium text-foreground">{user.fullName}</span>
                <span className="mx-2">·</span>
                <span>{ROLE_LABELS[user.role] ?? user.role}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" /> Выйти
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
