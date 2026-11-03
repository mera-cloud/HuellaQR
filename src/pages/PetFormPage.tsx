import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toUserMessage } from '@/lib/errors';
import { navigate } from '@/lib/router';
import { createPet, getMyPet, updatePet, type PetInput } from '@/lib/pets';
import { uploadPhoto } from '@/lib/photos';
import { useAsyncData } from '@/lib/useAsyncData';
import type { Pet } from '@/lib/types';
import { PetForm, EMPTY_PET_FORM, type PetFormState } from '@/components/pet/PetForm';
import { Alert } from '@/components/ui/Alert';
import { BackLink } from '@/components/ui/BackLink';

interface PetFormPageProps {
  petId?: string;
}

function toPetFormState(pet: Pet): PetFormState {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    birthDate: pet.birth_date ?? '',
    sex: pet.sex,
    weight: pet.weight_kg === null ? '' : String(pet.weight_kg),
    distinctiveFeatures: pet.distinctive_features,
    medicalInfo: pet.medical_info ?? '',
    medicalPublic: pet.medical_public,
  };
}

function toPetInput(values: PetFormState, photoUrl: string | null): PetInput {
  const weight = values.weight.trim() ? Number(values.weight) : null;
  return {
    name: values.name.trim(),
    species: values.species as PetInput['species'],
    breed: values.breed.trim(),
    birth_date: values.birthDate,
    sex: values.sex as PetInput['sex'],
    weight_kg: weight,
    distinctive_features: values.distinctiveFeatures.trim(),
    medical_info: values.medicalInfo.trim() || null,
    medical_public: values.medicalPublic,
    photo_url: photoUrl,
  };
}

export function PetFormPage({ petId }: PetFormPageProps) {
  const { user } = useAuth();
  const isEdit = Boolean(petId);
  const { data: pet, error: loadError, loading, updateData } = useAsyncData(
    () => (petId ? getMyPet(petId) : Promise.resolve(null)),
    [petId],
  );
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (isEdit && loading) {
    return <Loader2 className="mx-auto mt-16 h-8 w-8 animate-spin text-forest-500" aria-label="Cargando" />;
  }

  if (isEdit && (loadError || !pet)) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <BackLink href="#/panel" label="Volver a mis mascotas" />
        <Alert tone="error">{loadError ?? 'No encontramos esta mascota en tu cuenta.'}</Alert>
      </div>
    );
  }

  const handleSubmit = async (values: PetFormState, photoFile: File | null) => {
    if (!user) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const currentPhoto = pet?.photo_url ?? null;
      const photoUrl = photoFile ? await uploadPhoto(photoFile, `pets/${user.id}`) : currentPhoto;
      const input = toPetInput(values, photoUrl);

      if (pet) {
        const saved = await updatePet(pet.id, input);
        updateData(() => saved);
        navigate(`/panel/mascotas/${saved.id}`);
      } else {
        const created = await createPet(user.id, input);
        navigate(`/panel/mascotas/${created.id}/qr`);
      }
    } catch (error) {
      setServerError(toUserMessage(error, 'No pudimos guardar los datos de tu mascota. Inténtalo de nuevo.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-4">
        <BackLink href={pet ? `#/panel/mascotas/${pet.id}` : '#/panel'} label={pet ? 'Volver al perfil de la mascota' : 'Volver a mis mascotas'} />
        <div>
          <p className="eyebrow">{isEdit ? 'Editar perfil' : 'Nueva mascota'}</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            {pet ? `Editar a ${pet.name}` : 'Registra a tu mascota'}
          </h1>
          <p className="mt-3 text-base text-forest-500">
            {isEdit
              ? 'Actualiza los datos. Los cambios se reflejarán en su perfil público al guardarlos.'
              : 'Completa los datos. Al terminar obtendrás el código QR de tu mascota.'}
          </p>
        </div>
      </div>

      <PetForm
        key={pet?.id ?? 'new'}
        initialValues={pet ? toPetFormState(pet) : EMPTY_PET_FORM}
        currentPhotoUrl={pet?.photo_url ?? null}
        submitLabel={isEdit ? 'Guardar cambios' : 'Registrar y obtener QR'}
        submitting={submitting}
        serverError={serverError}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
