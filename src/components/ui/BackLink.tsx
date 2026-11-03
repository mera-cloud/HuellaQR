import { ArrowLeft } from 'lucide-react';

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-forest-500 transition hover:text-forest-700">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  );
}
