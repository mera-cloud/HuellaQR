import type { ReactNode } from 'react';
import { Inbox, LogOut, PawPrint } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { navigate, useHash } from '@/lib/router';
import { Logo } from '@/components/layout/Logo';

const TABS = [
  { href: '#/panel', label: 'Mis mascotas', icon: PawPrint, match: (hash: string) => hash === '#/panel' || hash.startsWith('#/panel/mascotas') },
  { href: '#/panel/reportes', label: 'Reportes recibidos', icon: Inbox, match: (hash: string) => hash.startsWith('#/panel/reportes') },
];

export function PanelLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const hash = useHash();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-forest-100 bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <a href="#/panel" aria-label="Ir a mi panel">
            <Logo />
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-forest-500 sm:inline">
              Hola, <span className="font-semibold text-forest-700">{profile?.full_name.split(' ')[0] ?? 'propietario'}</span>
            </span>
            <button type="button" onClick={handleSignOut} className="btn-secondary btn-sm">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Salir
            </button>
          </div>
        </div>
        <nav className="container-page" aria-label="Panel">
          <ul className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const active = tab.match(hash);
              const Icon = tab.icon;
              return (
                <li key={tab.href}>
                  <a
                    href={tab.href}
                    aria-current={active ? 'page' : undefined}
                    className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition ${
                      active ? 'border-forest-600 text-forest-700' : 'border-transparent text-forest-400 hover:text-forest-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {tab.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main className="container-page animate-fade-up py-10 sm:py-12">{children}</main>
    </div>
  );
}
