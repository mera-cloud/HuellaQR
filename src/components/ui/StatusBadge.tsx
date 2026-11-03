import type { PetStatus } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/format';

const STATUS_STYLES: Record<PetStatus, string> = {
  en_casa: 'bg-sage-100 text-forest-700 ring-sage-300',
  extraviada: 'bg-clay-100 text-clay-700 ring-clay-300',
  en_reencuentro: 'bg-cream-100 text-forest-700 ring-cream-200',
};

const STATUS_DOTS: Record<PetStatus, string> = {
  en_casa: 'bg-forest-500',
  extraviada: 'bg-clay-500',
  en_reencuentro: 'bg-sage-600',
};

export function StatusBadge({ status }: { status: PetStatus }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}>
      <span className={`h-2 w-2 rounded-full ${STATUS_DOTS[status]}`} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
