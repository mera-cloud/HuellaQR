import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { CAN_MEET_LABELS, toDateTimeLocalValue } from '@/lib/format';
import { toUserMessage } from '@/lib/errors';
import { uploadPhoto } from '@/lib/photos';
import { submitFoundReport, type FoundReportInput } from '@/lib/reports';
import { validateFoundReport, hasErrors, type FieldErrors, type FoundReportValues } from '@/lib/validation';
import type { CanMeet } from '@/lib/types';
import { Alert } from '@/components/ui/Alert';
import { FormField, fieldInputClass } from '@/components/ui/FormField';
import { PhotoUpload } from '@/components/ui/PhotoUpload';

interface FoundReportFormProps {
  publicCode: string;
  petName: string;
  onSubmitted: () => void;
}

const CAN_MEET_OPTIONS: CanMeet[] = ['si', 'no', 'acordar'];

function initialValues(): FoundReportValues {
  return {
    finderName: '',
    location: '',
    foundAt: toDateTimeLocalValue(new Date()),
    finderContact: '',
    canMeet: '',
    message: '',
  };
}

export function FoundReportForm({ publicCode, petName, onSubmitted }: FoundReportFormProps) {
  const [values, setValues] = useState<FoundReportValues>(initialValues);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors<keyof FoundReportValues>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof FoundReportValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateFoundReport(values);
    setErrors(nextErrors);
    setServerError(null);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    try {
      const photoUrl = photoFile ? await uploadPhoto(photoFile, 'found') : null;
      const input: FoundReportInput = {
        finderName: values.finderName.trim(),
        location: values.location.trim(),
        foundAt: values.foundAt,
        photoUrl,
        finderContact: values.finderContact.trim(),
        canMeet: values.canMeet as CanMeet,
        message: values.message.trim(),
      };
      await submitFoundReport(publicCode, input);
      onSubmitted();
    } catch (error) {
      setServerError(toUserMessage(error, 'No pudimos enviar tu reporte. Revisa tu conexión e inténtalo de nuevo.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {serverError && <Alert tone="error">{serverError}</Alert>}

      <section className="card space-y-6 p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-bold">Sobre ti</h2>
          <p className="mt-1 text-sm text-forest-400">El propietario de {petName} sabrá cómo contactarte para acordar el reencuentro.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="finder-name" label="Tu nombre" error={errors.finderName}>
            <input id="finder-name" autoComplete="name" className={fieldInputClass(Boolean(errors.finderName))} value={values.finderName} onChange={updateField('finderName')} />
          </FormField>
          <FormField id="finder-contact" label="Teléfono o correo electrónico" error={errors.finderContact} hint="Para que el propietario pueda responderte.">
            <input id="finder-contact" autoComplete="tel" className={fieldInputClass(Boolean(errors.finderContact))} value={values.finderContact} onChange={updateField('finderContact')} />
          </FormField>
        </div>
      </section>

      <section className="card space-y-6 p-6 sm:p-8">
        <h2 className="text-lg font-bold">Sobre el hallazgo</h2>
        <FormField id="found-location" label="Lugar donde la encontraste" error={errors.location} hint="Calle, colonia o un punto de referencia cercano.">
          <input id="found-location" className={fieldInputClass(Boolean(errors.location))} value={values.location} onChange={updateField('location')} />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="found-at" label="Fecha y hora del hallazgo" error={errors.foundAt}>
            <input id="found-at" type="datetime-local" max={toDateTimeLocalValue(new Date())} className={fieldInputClass(Boolean(errors.foundAt))} value={values.foundAt} onChange={updateField('foundAt')} />
          </FormField>
        </div>
        <PhotoUpload
          id="found-photo"
          label="Añadir fotografía"
          currentUrl={null}
          onFileChange={setPhotoFile}
          hint="Opcional. Una foto ayuda al propietario a confirmar que es su mascota."
        />
      </section>

      <section className="card space-y-6 p-6 sm:p-8">
        <fieldset>
          <legend className="field-label">¿Puedes trasladarte para acordar un punto de encuentro?</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {CAN_MEET_OPTIONS.map((option) => {
              const checked = values.canMeet === option;
              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3.5 text-center text-base font-semibold transition duration-200 focus-within:ring-4 focus-within:ring-sage-200 ${
                    checked ? 'border-forest-600 bg-sage-50 text-forest-700' : 'border-forest-200 bg-white text-forest-500 hover:border-forest-400'
                  }`}
                >
                  <input type="radio" name="can-meet" value={option} checked={checked} onChange={() => setValues((current) => ({ ...current, canMeet: option }))} className="sr-only" />
                  {CAN_MEET_LABELS[option]}
                </label>
              );
            })}
          </div>
          {errors.canMeet && (
            <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
              {errors.canMeet}
            </p>
          )}
        </fieldset>

        <FormField id="found-message" label="Mensaje adicional" error={errors.message} optional>
          <textarea id="found-message" rows={3} maxLength={500} className={`${fieldInputClass(Boolean(errors.message))} resize-y`} value={values.message} onChange={updateField('message')} placeholder="Está con agua y tranquila. Puedo esperar aquí unos minutos." />
        </FormField>
      </section>

      <div className="flex items-start gap-3 rounded-2xl bg-sage-50 p-5 text-sm leading-relaxed text-forest-600">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
        <p>
          Tus datos de contacto se compartirán únicamente con el propietario de {petName} para facilitar el reencuentro. No se mostrarán públicamente.
        </p>
      </div>

      <button type="submit" className="btn-accent w-full px-6 py-5 text-lg tracking-wide" disabled={submitting}>
        {submitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        {submitting ? 'ENVIANDO...' : 'ENVIAR NOTIFICACIÓN AL PROPIETARIO'}
      </button>
    </form>
  );
}
