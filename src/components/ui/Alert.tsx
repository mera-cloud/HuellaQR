import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

type AlertTone = 'error' | 'success' | 'info';

const TONES: Record<AlertTone, { box: string; icon: typeof Info }> = {
  error: { box: 'border-red-200 bg-red-50 text-red-800', icon: AlertCircle },
  success: { box: 'border-sage-300 bg-sage-50 text-forest-700', icon: CheckCircle2 },
  info: { box: 'border-clay-200 bg-clay-50 text-clay-700', icon: Info },
};

export function Alert({ tone = 'info', children }: { tone?: AlertTone; children: ReactNode }) {
  const { box, icon: Icon } = TONES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${box}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
