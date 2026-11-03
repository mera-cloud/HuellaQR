import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toUserMessage } from '@/lib/errors';
import { navigate } from '@/lib/router';
import { validateOwner } from '@/lib/validation';
import { Alert } from '@/components/ui/Alert';
import { FormField, fieldInputClass } from '@/components/ui/FormField';

type OwnerForm = { fullName: string; phone: string; email: string; password: string };
type OwnerErrors = Partial<Record<keyof OwnerForm, string>>;

const EMPTY_FORM: OwnerForm = { fullName: '', phone: '', email: '', password: '' };

export function RegisterPage() {
  const { signUp } = useAuth();
  const [form, setForm] = useState<OwnerForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<OwnerErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof OwnerForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateOwner(form);
    setErrors(nextErrors);
    setServerError(null);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await signUp({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/panel/mascotas/nueva');
    } catch (error) {
      setServerError(toUserMessage(error, 'No pudimos crear tu cuenta. Revisa tus datos e inténtalo de nuevo.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-20">
      <div className="animate-fade-up lg:pt-8">
        <p className="eyebrow">Crea tu cuenta gratuita</p>
        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Registra a tu mascota en minutos</h1>
        <p className="mt-6 text-lg leading-relaxed text-forest-500">
          Primero crea tu cuenta de propietario. Después podrás añadir a tu mascota y obtener su código QR.
        </p>
        <div className="mt-8 flex gap-3 rounded-2xl bg-sage-50 p-5 text-base text-forest-600">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-forest-600" aria-hidden="true" />
          <p>Tu correo y tu teléfono nunca se muestran en el perfil público de tu mascota.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="card animate-fade-up space-y-5 p-6 sm:p-8 [animation-delay:100ms]">
        <h2 className="text-xl font-bold">Datos del propietario</h2>
        {serverError && <Alert tone="error">{serverError}</Alert>}

        <FormField id="owner-name" label="Nombre completo" error={errors.fullName}>
          <input id="owner-name" autoComplete="name" className={fieldInputClass(Boolean(errors.fullName))} value={form.fullName} onChange={updateField('fullName')} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="owner-email" label="Correo electrónico" error={errors.email}>
            <input id="owner-email" type="email" autoComplete="email" className={fieldInputClass(Boolean(errors.email))} value={form.email} onChange={updateField('email')} placeholder="tu@correo.com" />
          </FormField>
          <FormField id="owner-phone" label="Número de teléfono" error={errors.phone} hint="Solo lo verás tú y quien reporte a tu mascota.">
            <input id="owner-phone" type="tel" autoComplete="tel" className={fieldInputClass(Boolean(errors.phone))} value={form.phone} onChange={updateField('phone')} placeholder="+52 55 1234 5678" />
          </FormField>
        </div>

        <FormField id="owner-password" label="Contraseña" error={errors.password} hint="Mínimo 6 caracteres.">
          <input id="owner-password" type="password" autoComplete="new-password" className={fieldInputClass(Boolean(errors.password))} value={form.password} onChange={updateField('password')} />
        </FormField>

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {submitting ? 'Creando tu cuenta...' : 'Crear cuenta y registrar mascota'}
        </button>

        <p className="text-center text-sm text-forest-500">
          ¿Ya tienes cuenta?{' '}
          <a href="#/iniciar-sesion" className="font-semibold text-forest-700 underline decoration-sage-400 underline-offset-4">
            Inicia sesión
          </a>
        </p>
      </form>
    </section>
  );
}
