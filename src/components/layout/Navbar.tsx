import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { navigate } from '@/lib/router';
import { Logo } from '@/components/layout/Logo';

const NAV_LINKS = [
  { href: '#/', label: 'Inicio' },
  { href: '#como-funciona', label: 'Cómo funciona' },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate('/');
  };

  const linkClass = 'rounded-lg px-3 py-2 text-sm font-semibold text-forest-600 transition hover:bg-forest-50 hover:text-forest-800';

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100/80 bg-cream-50/95 backdrop-blur">
      <nav className="container-page flex items-center justify-between py-4" aria-label="Principal">
        <a href="#/" aria-label="HuellaQR, ir al inicio" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
          {user ? (
            <>
              <a href="#/panel" className={linkClass}>Mi panel</a>
              <button type="button" onClick={handleSignOut} className="btn-secondary btn-sm ml-2">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a href="#/iniciar-sesion" className={linkClass}>Iniciar sesión</a>
              <a href="#/registro" className="btn-primary btn-sm ml-2">Registrar mascota</a>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-secondary btn-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="animate-fade-up border-t border-forest-100 bg-cream-50 md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-forest-700 hover:bg-forest-50">
                {link.label}
              </a>
            ))}
            {user ? (
              <>
                <a href="#/panel" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-forest-700 hover:bg-forest-50">Mi panel</a>
                <button type="button" onClick={handleSignOut} className="btn-secondary mt-2">Cerrar sesión</button>
              </>
            ) : (
              <>
                <a href="#/iniciar-sesion" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-forest-700 hover:bg-forest-50">Iniciar sesión</a>
                <a href="#/registro" onClick={() => setOpen(false)} className="btn-primary mt-2">Registrar mascota</a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
