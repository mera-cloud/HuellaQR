import { Logo } from '@/components/layout/Logo';

export function Footer() {
  return (
    <footer className="bg-forest-700 text-cream-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo tone="dark" />
          <p className="mt-4 max-w-sm text-base leading-relaxed text-cream-100/85">
            Identificación digital gratuita para perros y gatos. Identifica. Protege. Reencuentra.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sage-300">Navegación</h2>
          <ul className="mt-4 space-y-3 text-base">
            <li><a href="#como-funciona" className="transition hover:text-white">Cómo funciona</a></li>
            <li><a href="#/registro" className="transition hover:text-white">Registrar mascota</a></li>
            <li><a href="#/iniciar-sesion" className="transition hover:text-white">Iniciar sesión</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sage-300">Información</h2>
          <ul className="mt-4 space-y-3 text-base">
            <li><a href="#preguntas" className="transition hover:text-white">Preguntas frecuentes</a></li>
            <li><a href="#privacidad" className="transition hover:text-white">Aviso de privacidad</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-600">
        <p className="container-page py-6 text-sm text-cream-100/70">
          © {new Date().getFullYear()} HuellaQR. Un proyecto gratuito para proteger a las mascotas.
        </p>
      </div>
    </footer>
  );
}
