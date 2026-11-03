import { BellRing, ClipboardList, QrCode } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Registra a tu mascota',
    text: 'Crea tu cuenta y añade la fotografía, la raza y las señas particulares de tu compañero en menos de cinco minutos.',
  },
  {
    icon: QrCode,
    title: 'Obtén su código QR',
    text: 'Generamos un código único para tu mascota. Descárgalo e imprímelo en su placa o collar.',
  },
  {
    icon: BellRing,
    title: 'Recibe avisos si la encuentran',
    text: 'Quien la encuentre escanea el código, envía un reporte y tú recibes sus datos para acordar el reencuentro.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="section scroll-mt-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Tres pasos para proteger a tu mascota</h2>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card group relative p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="absolute right-6 top-6 text-sm font-bold text-sage-500">0{index + 1}</span>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 text-forest-600 transition group-hover:bg-forest-600 group-hover:text-white">
                <step.icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-forest-500">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
