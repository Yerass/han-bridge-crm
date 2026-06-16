import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
            <Construction className="h-7 w-7 text-primary" />
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground">
            Модель данных и API-основа уже готовы в backend — модуль подключается следующим этапом.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
