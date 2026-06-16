import { ComingSoon } from '@/components/ui/coming-soon';

export default function SchedulePage() {
  return (
    <ComingSoon
      title="Расписание"
      description="Календарь занятий с поддержкой переносов, отмен и замены преподавателей. Недельная нагрузка хранится в ScheduleSlot, конкретные занятия — в Lesson (с проверкой пересечений по аудиториям)."
    />
  );
}
