import { useState } from 'react';
import { HeartHandshake, PawPrint } from 'lucide-react';
import { getPublicPet } from '@/lib/pets';
import { useAsyncData } from '@/lib/useAsyncData';
import { STATUS_LABELS } from '@/lib/format';
import { Alert } from '@/components/ui/Alert';
import { BackLink } from '@/components/ui/BackLink';
import { FoundReportForm } from '@/components/report/FoundReportForm';

interface ReportFoundPageProps {
  code: string;
}

const PUBLIC_CODE_PATTERN = /^[a-f0-9]{16}$/;

export function ReportFoundPage({ code }: ReportFoundPageProps) {
  const validCode = PUBLIC_CODE_PATTERN.test(code);
  const [sent, setSent] = useState(false);
  const { data: pet, error, loading, reload } = useAsyncData(
    () => (validCode ? getPublicPet(code) : Promise.resolve(null)),
    [code, validCode],
  );

  if (loading) {
    return <p className="py-24 text-center text-base text-forest-500">Preparando el formulario...</p>;
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
        <div className="card mx-auto max-w-xl px-8 py-14 text-center">
          <h1 className="text-2xl font-extrabold">Este perfil no está disponible</h1>
          <p className="mt-3 text-base leading-relaxed text-forest-500">
            Ya no es posible enviar reportes para esta mascota.
          </p>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="container-page py-20">
        <div className="card mx-auto max-w-xl animate-fade-up px-8 py-14 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-100 text-forest-600">
            <HeartHandshake className="h-8 w-8" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold">¡Gracias por ayudar!</h1>
          <p className="mt-4 text-base leading-relaxed text-forest-600">
            Hemos enviado tu reporte al propietario de la mascota. Ahora podrá ponerse en contacto contigo.
          </p>
          <a href={`#/p/${code}`} className="btn-secondary mt-8">
            Volver al perfil de {pet.pet_name}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <BackLink href={`#/p/${code}`} label="Volver al perfil" />

        <div className="flex items-center gap-5">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sage-100">
            {pet.pet_photo_url ? (
              <img src={pet.pet_photo_url} alt={pet.pet_name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-forest-300">
                <PawPrint className="h-8 w-8" aria-hidden="true" />
              </div>
            )}
          </div>
          <div>
            <p className="eyebrow">Reportar mascota encontrada</p>
            <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{pet.pet_name}</h1>
            <p className="mt-1 text-sm text-forest-400">Estado: {STATUS_LABELS[pet.pet_status]}</p>
          </div>
        </div>

        <FoundReportForm publicCode={code} petName={pet.pet_name} onSubmitted={() => setSent(true)} />
      </div>
    </div>
  );
}
