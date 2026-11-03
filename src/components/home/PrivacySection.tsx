import { ShieldCheck } from 'lucide-react';

const POINTS = [
  'Usamos tu nombre, correo, teléfono y contraseña solo para gestionar tu cuenta y enviarte los reportes de tus mascotas.',
  'El perfil público muestra únicamente el nombre de pila del propietario. Tu correo, teléfono y domicilio nunca aparecen públicamente.',
  'Quien reporta una mascota acepta que sus datos de contacto se compartan con el propietario para facilitar el reencuentro.',
  'Puedes editar, desactivar o eliminar los perfiles de tus mascotas en cualquier momento desde tu panel.',
  'La información médica solo se muestra si decides compartirla expresamente en el perfil de tu mascota.',
];

export function PrivacySection() {
  return (
    <section id="privacidad" className="section scroll-mt-24 bg-cream-100/60">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600 text-white">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="eyebrow mt-6">Aviso de privacidad</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Tus datos, bajo tu control</h2>
        </div>
        <ul className="space-y-4">
          {POINTS.map((point) => (
            <li key={point} className="flex gap-4 rounded-2xl bg-white p-5 text-base leading-relaxed text-forest-600 shadow-soft">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sage-600" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
