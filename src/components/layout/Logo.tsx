import { PawPrint } from 'lucide-react';

export function Logo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const isDark = tone === 'dark';
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? 'bg-sage-400 text-forest-800' : 'bg-forest-600 text-cream-50'}`}>
        <PawPrint className="h-[22px] w-[22px]" aria-hidden="true" />
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-cream-50' : 'text-forest-700'}`}>
        HuellaQR
      </span>
    </span>
  );
}
