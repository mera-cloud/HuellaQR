import { Dog, Plus, QrCode, ChevronRight, Loader2 } from 'lucide-react';
import { listMyPets } from '@/lib/pets';
import { useAsyncData } from '@/lib/useAsyncData';
import { SPECIES_LABELS, calculateAge } from '@/lib/format';
import type { Pet } from '@/lib/types';
import { Alert } from '@/components/ui/Alert';
import { StatusBadge } from '@/components/ui/StatusBadge';

function PetCard({ pet }: { pet: Pet }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] bg-sage-100">
        {pet.photo_url ? (
          <img src={pet.photo_url} alt={`Fotografía de ${pet.name}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-forest-300">
            <Dog className="h-16 w-16" aria-hidden="true" />
          </div>
        )}
        {!pet.active && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-forest-600 shadow-soft">
            Perfil desactivado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold">{pet.name}</h2>
            <p className="mt-1 text-sm text-forest-400">
              {SPECIES_LABELS[pet.species]} · {pet.breed} · {calculateAge(pet.birth_date)}
            </p>
          </div>
        </div>
        <StatusBadge status={pet.status} />

        <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
          <a href={`#/panel/mascotas/${pet.id}`} className="btn-primary btn-sm flex-1">
            Ver detalles
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={`#/panel/mascotas/${pet.id}/qr`} className="btn-secondary btn-sm flex-1">
            <QrCode className="h-4 w-4" aria-hidden="true" />
            Ver QR
          </a>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center px-8 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-100 text-forest-600">
        <Dog className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-2xl font-extrabold">Aún no tienes mascotas registradas</h2>
      <p className="mt-3 max-w-md text-base leading-relaxed text-forest-500">
        Registra a tu primera mascota para obtener su código QR y tenerla identificada desde hoy.
      </p>
      <a href="#/panel/mascotas/nueva" className="btn-primary mt-8">
        <Plus className="h-5 w-5" aria-hidden="true" />
        Registrar mi primera mascota
      </a>
    </div>
  );
}

export function PanelPage() {
  const { data: pets, error, loading, reload } = useAsyncData(listMyPets, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Panel del propietario</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Mis mascotas</h1>
          <p className="mt-2 text-base text-forest-500">Administra los perfiles, estados y códigos QR de tus compañeros.</p>
        </div>
        {pets && pets.length > 0 && (
          <a href="#/panel/mascotas/nueva" className="btn-primary self-start sm:self-auto">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Añadir mascota
          </a>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-forest-500">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          <span className="text-base font-medium">Cargando tus mascotas...</span>
        </div>
      )}

      {!loading && error && (
        <div className="space-y-4">
          <Alert tone="error">{error}</Alert>
          <button type="button" className="btn-secondary" onClick={reload}>Intentar de nuevo</button>
        </div>
      )}

      {!loading && !error && pets && pets.length === 0 && <EmptyState />}

      {!loading && !error && pets && pets.length > 0 && (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => (
            <li key={pet.id}>
              <PetCard pet={pet} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
