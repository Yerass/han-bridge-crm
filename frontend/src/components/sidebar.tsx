'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  Wallet,
  TrendingUp,
  CalendarDays,
  Megaphone,
  ShieldCheck,
  Bell,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/students', label: 'Студенты', icon: Users },
  { href: '/teachers', label: 'Преподаватели', icon: GraduationCap },
  { href: '/groups', label: 'Группы', icon: Layers },
  { href: '/leads', label: 'Воронка продаж', icon: TrendingUp },
  { href: '/finance', label: 'Финансы', icon: Wallet },
  { href: '/schedule', label: 'Расписание', icon: CalendarDays },
  { href: '/notifications', label: 'Уведомления', icon: Bell },
  { href: '/marketing', label: 'Маркетинг', icon: Megaphone },
  { href: '/audit', label: 'Аудит', icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">Han Bridge</p>
          <p className="text-xs text-muted-foreground">CRM / ERP</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
