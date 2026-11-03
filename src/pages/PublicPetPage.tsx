import { AlertTriangle, HeartHandshake, Home, PawPrint } from 'lucide-react';
import { getPublicPet } from '@/lib/pets';
import { useAsyncData } from '@/lib/useAsyncData';
import { SEX_LABELS, SPECIES_LABELS, calculateAge } from '@/lib/format';
import type { PetStatus } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Alert } from '@/components/ui/Alert';

interface PublicPetPageProps {
  code: string;
}

const PUBLIC_CODE_PATTERN = /^[a-f0-9]{16}$/;

const STATUS_BANNERS: Record<PetStatus, { icon: typeof Home; text: string; tone: string }> = {
  en_casa: {
    icon: Home,
    text: 'Esta mascota está en casa. Gracias por ayudar a que siga protegida.',
    tone: 'bg-sage-50 text-forest-700',
  },
  extraviada: {
    icon: AlertTriangle,
    text: 'Esta mascota está extraviada. Si la encontraste, ayúdale a volver a casa.',
    tone: 'bg-clay-50 text-clay-700',
  },
  en_reencuentro: {
    icon: HeartHandshake,
    text: 'Su familia ya está coordinando el reencuentro. Gracias por tu ayuda.',
    tone: 'bg-cream-100 text-forest-700',
  },
};

function NotAvailable() {
  return (
    <div className="card mx-auto max-w-xl px-8 py-14 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-100 text-forest-600">
        <PawPrint className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold">Este perfil no está disponible</h1>
      <p className="mt-3 text-base leading-relaxed text-forest-500">
        Es posible que el código sea incorrecto o que el propietario haya desactivado el perfil.
      </p>
    </div>
  );
}

export function PublicPetPage({ code }: PublicPetPageProps) {
  const validCode = PUBLIC_CODE_PATTERN.test(code);
  const { data: pet, error, loading, reload } = useAsyncData(
    () => (validCode ? getPublicPet(code) : Promise.resolve(null)),
    [code, validCode],
  );

  if (loading) {
    return <p className="py-24 text-center text-base text-forest-500">Cargando el perfil de la mascota...</p>;
  }

  if (error) {
    return (
      <div className="container-page mx-auto max-w-xl space-y-4 py-20">
        <Alert tone="error">{error}</Alert>
        <button type="button" className="btn-secondary" onClick={reload}>Intentar de nuevo</button>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container-page py-20">
        <NotAvailable />
      </div>
    );
  }

  const banner = STATUS_BANNERS[pet.pet_status];
  const BannerIcon = banner.icon;

  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
        <div className="card overflow-hidden lg:sticky lg:top-28">
          <div className="aspect-[4/3] bg-sage-100">
            {pet.pet_photo_url ? (
              <img src={pet.pet_photo_url} alt={`Fotografía de ${pet.pet_name}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-forest-300">
                <PawPrint className="h-20 w-20" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 animate-fade-up">
          <div className="space-y-4">
            <p className="eyebrow">{SPECIES_LABELS[pet.pet_species]} con identificación HuellaQR</p>
            <h1 className="text-4xl font-extrabold sm:text-5xl">{pet.pet_name}</h1>
            <StatusBadge status={pet.pet_status} />
          </div>

          <div className={`flex items-start gap-3 rounded-2xl px-5 py-4 text-base font-medium ${banner.tone}`}>
            <BannerIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{banner.text}</p>
          </div>

          <dl className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <dt className="text-sm text-forest-400">Raza</dt>
              <dd className="text-base font-semibold text-forest-700">{pet.pet_breed}</dd>
            </div>
            <div>
              <dt className="text-sm text-forest-400">Edad</dt>
              <dd className="text-base font-semibold text-forest-700">{calculateAge(pet.pet_birth_date)}</dd>
            </div>
            <div>
              <dt className="text-sm text-forest-400">Sexo</dt>
              <dd className="text-base font-semibold text-forest-700">{SEX_LABELS[pet.pet_sex]}</dd>
            </div>
            <div>
              <dt className="text-sm text-forest-400">Propietario</dt>
              <dd className="text-base font-semibold text-forest-700">{pet.owner_first_name}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-forest-400">Características físicas</dt>
              <dd className="text-base leading-relaxed text-forest-700">{pet.pet_distinctive_features}</dd>
            </div>
            {pet.pet_medical_info && (
              <div className="sm:col-span-2">
                <dt className="text-sm text-forest-400">Información médica relevante</dt>
                <dd className="text-base leading-relaxed text-forest-700">{pet.pet_medical_info}</dd>
              </div>
            )}
          </dl>

          <div className="sticky bottom-4 z-10 rounded-2xl bg-white/95 p-3 shadow-lift backdrop-blur sm:static sm:bg-transparent sm:p-0 sm:shadow-none">
            <a href={`#/p/${code}/reportar`} className="btn-accent w-full px-6 py-5 text-lg tracking-wide">
              ENCONTRÉ A ESTA MASCOTA
            </a>
            <p className="mt-3 text-center text-sm text-forest-400">
              No necesitas crear una cuenta. Tus datos solo los recibe el propietario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
