import { ExternalLink, Pencil, QrCode } from 'lucide-react';
import { getMyPet } from '@/lib/pets';
import { useAsyncData } from '@/lib/useAsyncData';
import { SEX_LABELS, SPECIES_LABELS, calculateAge, formatDate } from '@/lib/format';
import { buildPublicPetUrl } from '@/lib/qr';
import { BackLink } from '@/components/ui/BackLink';
import { Alert } from '@/components/ui/Alert';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PetStatusPanel } from '@/components/pet/PetStatusPanel';
import { PetDangerZone } from '@/components/pet/PetDangerZone';

interface PetDetailPageProps {
  petId: string;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-forest-100 py-4 last:border-0 sm:flex-row sm:justify-between sm:gap-6">
      <dt className="text-sm text-forest-400">{label}</dt>
      <dd className="text-base font-semibold text-forest-700 sm:text-right">{value}</dd>
    </div>
  );
}

export function PetDetailPage({ petId }: PetDetailPageProps) {
  const { data: pet, error, loading, updateData } = useAsyncData(() => getMyPet(petId), [petId]);

  if (loading) {
    return <p className="py-16 text-center text-base text-forest-500">Cargando la información de tu mascota...</p>;
  }

  if (error || !pet) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <BackLink href="#/panel" label="Volver a mis mascotas" />
        <Alert tone="error">{error ?? 'No encontramos esta mascota en tu cuenta.'}</Alert>
      </div>
    );
  }

  const publicUrl = buildPublicPetUrl(pet.public_code);

  return (
    <div className="space-y-8">
      <BackLink href="#/panel" label="Volver a mis mascotas" />

      <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
        <aside className="card overflow-hidden lg:sticky lg:top-8">
          <div className="aspect-[4/3] bg-sage-100">
            {pet.photo_url && <img src={pet.photo_url} alt={`Fotografía de ${pet.name}`} className="h-full w-full object-cover" />}
          </div>
          <div className="space-y-5 p-6">
            <div>
              <h1 className="text-3xl font-extrabold">{pet.name}</h1>
              <p className="mt-1 text-base text-forest-400">
                {SPECIES_LABELS[pet.species]} · {pet.breed}
              </p>
            </div>
            <StatusBadge status={pet.status} />
            {!pet.active && (
              <p className="rounded-xl bg-clay-50 px-4 py-3 text-sm font-medium text-clay-700">
                Este perfil está desactivado. Quien escanee su código no podrá ver su información.
              </p>
            )}
            <div className="grid gap-3">
              <a href={`#/panel/mascotas/${pet.id}/qr`} className="btn-primary">
                <QrCode className="h-5 w-5" aria-hidden="true" />
                Ver código QR
              </a>
              <a href={`#/panel/mascotas/${pet.id}/editar`} className="btn-secondary">
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Editar información
              </a>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-forest-500 transition hover:text-forest-700">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Ver perfil público
              </a>
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <section className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold">Datos de identificación</h2>
            <dl className="mt-4">
              <DetailRow label="Edad" value={calculateAge(pet.birth_date)} />
              <DetailRow label="Fecha de nacimiento" value={pet.birth_date ? formatDate(pet.birth_date) : 'No indicada'} />
              <DetailRow label="Sexo" value={SEX_LABELS[pet.sex]} />
              <DetailRow label="Peso" value={pet.weight_kg === null ? 'No indicado' : `${pet.weight_kg} kg`} />
              <DetailRow label="Características distintivas" value={pet.distinctive_features} />
              <DetailRow label="Información médica" value={pet.medical_info ?? 'Sin información'} />
              <DetailRow label="Visibilidad médica" value={pet.medical_public ? 'Visible en el perfil público' : 'Solo visible para ti'} />
            </dl>
            <p className="mt-4 text-sm text-forest-400">
              Registrada el {formatDate(pet.created_at)} · ID público del QR: {pet.public_code}
            </p>
          </section>

          <PetStatusPanel pet={pet} onSaved={(status) => updateData((current) => current && { ...current, status })} />

          <PetDangerZone pet={pet} onActiveChange={(active) => updateData((current) => current && { ...current, active })} />
        </div>
      </div>
    </div>
  );
}
