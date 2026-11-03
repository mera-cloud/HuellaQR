import { useState } from 'react';
import { Check, Copy, Download, ExternalLink, Printer } from 'lucide-react';
import { getMyPet } from '@/lib/pets';
import { useAsyncData } from '@/lib/useAsyncData';
import { buildPublicPetUrl, createQrDataUrl, qrFileName } from '@/lib/qr';
import { BackLink } from '@/components/ui/BackLink';
import { Alert } from '@/components/ui/Alert';

interface PetQrPageProps {
  petId: string;
}

async function loadPetQr(petId: string) {
  const pet = await getMyPet(petId);
  if (!pet) return null;
  const publicUrl = buildPublicPetUrl(pet.public_code);
  const qrDataUrl = await createQrDataUrl(publicUrl);
  return { pet, publicUrl, qrDataUrl };
}

const TIPS = [
  'Imprímelo a un tamaño de al menos 3 cm para que se pueda escanear con facilidad.',
  'Colócalo en la placa del collar o en una etiqueta resistente al agua.',
  'Revisa de vez en cuando que el código siga limpio y legible para que se pueda escanear sin problemas.',
];

export function PetQrPage({ petId }: PetQrPageProps) {
  const { data, error, loading } = useAsyncData(() => loadPetQr(petId), [petId]);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return <p className="py-16 text-center text-base text-forest-500">Generando el código QR...</p>;
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <BackLink href="#/panel" label="Volver a mis mascotas" />
        <Alert tone="error">{error ?? 'No encontramos esta mascota en tu cuenta.'}</Alert>
      </div>
    );
  }

  const { pet, publicUrl, qrDataUrl } = data;

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <BackLink href={`#/panel/mascotas/${pet.id}`} label="Volver al perfil de la mascota" />

      <div>
        <p className="eyebrow">Registro completado</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">El código QR de {pet.name}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-forest-500">
          Cualquier persona que escanee este código verá el perfil de {pet.name} y podrá reportar que la encontró.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[auto_1fr]">
        <section className="card flex flex-col items-center gap-6 p-8">
          <img src={qrDataUrl} alt={`Código QR del perfil de ${pet.name}`} className="h-64 w-64 rounded-xl sm:h-72 sm:w-72" />
          <a href={qrDataUrl} download={qrFileName(pet.name)} className="btn-accent w-full sm:w-auto">
            <Download className="h-5 w-5" aria-hidden="true" />
            Descargar PNG
          </a>
        </section>

        <div className="space-y-6">
          <section className="card space-y-4 p-6 sm:p-8">
            <h2 className="text-lg font-bold">Enlace del perfil</h2>
            <p className="break-all rounded-xl bg-cream-100/70 px-4 py-3 font-mono text-sm text-forest-600">{publicUrl}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn-secondary" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4 text-forest-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? 'Enlace copiado' : 'Copiar enlace'}
              </button>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Ver perfil público
              </a>
            </div>
          </section>

          <section className="rounded-2xl bg-sage-50 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Printer className="h-5 w-5 text-forest-600" aria-hidden="true" />
              Recomendaciones para imprimirlo
            </h2>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-forest-600">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
