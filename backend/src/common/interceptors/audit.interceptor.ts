import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

const METHOD_ACTION: Record<string, string> = {
  POST: 'CREATE',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
  DELETE: 'DELETE',
};

/**
 * Writes an AuditLog entry for every mutating request (who / what / when),
 * satisfying the "История действий пользователей" requirement.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const action = METHOD_ACTION[req.method];

    return next.handle().pipe(
      tap(async (result) => {
        if (!action) return; // skip GET
        // derive entity from route, e.g. /students/:id -> "students"
        const entity = (req.route?.path || req.url || '').split('/').filter(Boolean)[0] || 'unknown';
        try {
          await this.prisma.auditLog.create({
            data: {
              userId: req.user?.id ?? null,
              action,
              entity,
              entityId: result?.id ?? req.params?.id ?? null,
              changes: action === 'DELETE' ? undefined : (req.body ?? undefined),
              ipAddress: req.ip,
            },
          });
        } catch {
          // never block the request because of audit logging
        }
      }),
    );
  }
}
