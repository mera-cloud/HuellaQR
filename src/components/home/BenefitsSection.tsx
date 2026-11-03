import { Fingerprint, MessageCircle, ShieldCheck, Smartphone } from 'lucide-react';

const BENEFITS = [
  {
    icon: Fingerprint,
    title: 'Identificación digital',
    text: 'Un perfil con la foto, la raza y las señas de tu mascota, disponible con un solo escaneo.',
  },
  {
    icon: ShieldCheck,
    title: 'Protección de datos personales',
    text: 'Tu correo y tu teléfono nunca se muestran en el perfil público. Solo tú decides qué compartir.',
  },
  {
    icon: MessageCircle,
    title: 'Comunicación directa y segura',
    text: 'Quien la encuentre envía un reporte privado y tú lo recibes en tu panel para responder.',
  },
  {
    icon: Smartphone,
    title: 'Sin instalar aplicaciones',
    text: 'Cualquier persona puede consultar el perfil desde su teléfono, sin descargar nada ni crear una cuenta.',
  },
];

export function BenefitsSection() {
  return (
    <section className="section bg-cream-100/60">
      <div className="container-page grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">Beneficios</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Pensado para la tranquilidad de quienes los quieren</h2>
          <p className="mt-5 text-lg leading-relaxed text-forest-500">
            Una herramienta gratuita y sencilla que une a las mascotas perdidas con sus familias en el menor tiempo posible.
          </p>
          <img
            src="https://images.pexels.com/photos/6897077/pexels-photo-6897077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Un gato blanco y gris descansando sobre una manta suave"
            className="mt-10 hidden aspect-[4/3] w-full rounded-3xl object-cover shadow-soft lg:block"
            loading="lazy"
          />
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600 text-white">
                <benefit.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{benefit.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-forest-500">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
