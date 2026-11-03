import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toUserMessage } from '@/lib/errors';
import { navigate } from '@/lib/router';
import { isValidEmail } from '@/lib/validation';
import { Alert } from '@/components/ui/Alert';
import { FormField, fieldInputClass } from '@/components/ui/FormField';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!isValidEmail(email)) nextErrors.email = 'Escribe un correo electrónico válido.';
    if (!password) nextErrors.password = 'Escribe tu contraseña.';
    setErrors(nextErrors);
    setServerError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate('/panel');
    } catch (error) {
      setServerError(toUserMessage(error, 'No pudimos iniciar sesión. Inténtalo de nuevo.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-page flex justify-center py-14 sm:py-24">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Bienvenido de nuevo</h1>
          <p className="mt-3 text-base text-forest-500">Entra a tu panel para ver tus mascotas y sus reportes.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="card mt-10 space-y-5 p-6 sm:p-8">
          {serverError && <Alert tone="error">{serverError}</Alert>}

          <FormField id="login-email" label="Correo electrónico" error={errors.email}>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={fieldInputClass(Boolean(errors.email))}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
            />
          </FormField>

          <FormField id="login-password" label="Contraseña" error={errors.password}>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={fieldInputClass(Boolean(errors.password))}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormField>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
            {submitting ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-8 text-center text-base text-forest-500">
          ¿Aún no tienes cuenta?{' '}
          <a href="#/registro" className="font-semibold text-forest-700 underline decoration-sage-400 underline-offset-4 hover:decoration-forest-600">
            Regístrate gratis
          </a>
        </p>
      </div>
    </section>
  );
}
