import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Cat, Dog, Loader2 } from 'lucide-react';
import { toDateInputValue } from '@/lib/format';
import { validatePet, hasErrors, type FieldErrors, type PetFormValues } from '@/lib/validation';
import { Alert } from '@/components/ui/Alert';
import { FormField, fieldInputClass } from '@/components/ui/FormField';
import { PhotoUpload } from '@/components/ui/PhotoUpload';

export interface PetFormState extends PetFormValues {
  medicalPublic: boolean;
}

export const EMPTY_PET_FORM: PetFormState = {
  name: '',
  species: '',
  breed: '',
  birthDate: '',
  sex: '',
  weight: '',
  distinctiveFeatures: '',
  medicalInfo: '',
  medicalPublic: false,
};

interface PetFormProps {
  initialValues: PetFormState;
  currentPhotoUrl: string | null;
  submitLabel: string;
  submitting: boolean;
  serverError: string | null;
  onSubmit: (values: PetFormState, photoFile: File | null) => void;
}

const inputClass = (error?: string) => fieldInputClass(Boolean(error));

function ChoiceGroup({ legend, error, children }: { legend: string; error?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function ChoiceCard({ name, value, checked, onChange, children }: { name: string; value: string; checked: boolean; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-base font-semibold transition duration-200 focus-within:ring-4 focus-within:ring-sage-200 ${
        checked ? 'border-forest-600 bg-sage-50 text-forest-700' : 'border-forest-200 bg-white text-forest-500 hover:border-forest-400'
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {children}
    </label>
  );
}

export function PetForm({ initialValues, currentPhotoUrl, submitLabel, submitting, serverError, onSubmit }: PetFormProps) {
  const [values, setValues] = useState<PetFormState>(initialValues);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors<keyof PetFormState>>({});

  const setField = <K extends keyof PetFormState>(field: K, value: PetFormState[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const textField = (field: keyof PetFormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setField(field, event.target.value as never);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validatePet(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSubmit(values, photoFile);
  };

  const maxDate = toDateInputValue(new Date());

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {serverError && <Alert tone="error">{serverError}</Alert>}

      <section className="card space-y-6 p-6 sm:p-8">
        <h2 className="text-lg font-bold">Identidad</h2>
        <PhotoUpload
          id="pet-photo"
          label={currentPhotoUrl || photoFile ? 'Cambiar fotografía' : 'Subir fotografía'}
          currentUrl={currentPhotoUrl}
          onFileChange={setPhotoFile}
          hint="Una foto clara de cara y cuerpo ayuda a identificarla. JPG, PNG o WebP, máximo 5 MB."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="pet-name" label="Nombre" error={errors.name}>
            <input id="pet-name" className={inputClass(errors.name)} value={values.name} onChange={textField('name')} maxLength={60} placeholder="Luna" />
          </FormField>
          <FormField id="pet-breed" label="Raza" error={errors.breed} hint='Si es mestizo, escribe "Mestizo".'>
            <input id="pet-breed" className={inputClass(errors.breed)} value={values.breed} onChange={textField('breed')} maxLength={60} placeholder="Labrador" />
          </FormField>
        </div>

        <ChoiceGroup legend="Especie" error={errors.species}>
          <ChoiceCard name="species" value="perro" checked={values.species === 'perro'} onChange={(value) => setField('species', value)}>
            <Dog className="h-5 w-5" aria-hidden="true" /> Perro
          </ChoiceCard>
          <ChoiceCard name="species" value="gato" checked={values.species === 'gato'} onChange={(value) => setField('species', value)}>
            <Cat className="h-5 w-5" aria-hidden="true" /> Gato
          </ChoiceCard>
        </ChoiceGroup>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="pet-birth" label="Fecha de nacimiento" error={errors.birthDate} hint="Puede ser aproximada.">
            <input id="pet-birth" type="date" max={maxDate} className={inputClass(errors.birthDate)} value={values.birthDate} onChange={textField('birthDate')} />
          </FormField>
          <FormField id="pet-weight" label="Peso en kilos" error={errors.weight} optional>
            <input id="pet-weight" type="number" inputMode="decimal" step="0.1" min="0" className={inputClass(errors.weight)} value={values.weight} onChange={textField('weight')} placeholder="8.5" />
          </FormField>
        </div>

        <ChoiceGroup legend="Sexo" error={errors.sex}>
          <ChoiceCard name="sex" value="macho" checked={values.sex === 'macho'} onChange={(value) => setField('sex', value as PetFormState['sex'])}>
            Macho
          </ChoiceCard>
          <ChoiceCard name="sex" value="hembra" checked={values.sex === 'hembra'} onChange={(value) => setField('sex', value as PetFormState['sex'])}>
            Hembra
          </ChoiceCard>
        </ChoiceGroup>
      </section>

      <section className="card space-y-6 p-6 sm:p-8">
        <h2 className="text-lg font-bold">Señas y salud</h2>
        <FormField id="pet-features" label="Características físicas distintivas" error={errors.distinctiveFeatures} hint="Color, manchas, collar, cicatrices, tamaño. Máximo 500 caracteres.">
          <textarea id="pet-features" rows={4} className={`${inputClass(errors.distinctiveFeatures)} resize-y`} value={values.distinctiveFeatures} onChange={textField('distinctiveFeatures')} maxLength={500} placeholder="Pelaje atigrado café, mancha blanca en la pata derecha delantera..." />
        </FormField>

        <FormField id="pet-medical" label="Información médica relevante" error={errors.medicalInfo} optional hint="Alergias, medicamentos o condiciones importantes. Máximo 1000 caracteres.">
          <textarea id="pet-medical" rows={3} className={`${inputClass(errors.medicalInfo)} resize-y`} value={values.medicalInfo} onChange={textField('medicalInfo')} maxLength={1000} />
        </FormField>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream-100/60 p-4 text-base text-forest-600">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 rounded border-forest-300 text-forest-600 focus:ring-sage-300"
            checked={values.medicalPublic}
            onChange={(event) => setField('medicalPublic', event.target.checked)}
          />
          <span>
            <span className="block font-semibold text-forest-700">Mostrar la información médica en el perfil público</span>
            Si lo dejas desmarcado, la información médica solo la verás tú.
          </span>
        </label>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <a href="#/panel" className="btn-secondary">
          Cancelar
        </a>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
