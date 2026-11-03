import { SearchX } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-100 text-forest-600">
        <SearchX className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold">No encontramos esta página</h1>
      <p className="mt-3 max-w-md text-base text-forest-500">Es posible que el enlace haya cambiado o que la página ya no exista.</p>
      <a href="#/" className="btn-primary mt-8">Volver al inicio</a>
    </div>
  );
}
