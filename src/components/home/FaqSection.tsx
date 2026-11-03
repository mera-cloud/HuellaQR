import { ChevronDown } from 'lucide-react';

const QUESTIONS = [
  {
    question: '¿HuellaQR tiene algún costo?',
    answer: 'No. Registrar a tus mascotas, generar sus códigos QR y recibir reportes es completamente gratuito.',
  },
  {
    question: '¿Quien encuentra a mi mascota necesita una cuenta?',
    answer: 'No. Solo necesita escanear el código con la cámara de su teléfono. No tiene que registrarse ni instalar nada.',
  },
  {
    question: '¿Quién puede ver mi correo o mi teléfono?',
    answer: 'Nadie en el perfil público. Tus datos de contacto solo se usan para que recibas los reportes en tu panel privado.',
  },
  {
    question: '¿Puedo registrar más de una mascota?',
    answer: 'Sí. Desde tu panel puedes añadir todas las mascotas que necesites, cada una con su propio código QR.',
  },
  {
    question: '¿Qué pasa si alguien encuentra a mi mascota?',
    answer: 'La persona envía un reporte con el lugar del hallazgo y su disponibilidad. Tú lo ves en tu panel y decides cómo contactarla.',
  },
];

export function FaqSection() {
  return (
    <section id="preguntas" className="section scroll-mt-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Resolvemos tus dudas</h2>
        </div>
        <div className="divide-y divide-forest-100 rounded-2xl border border-forest-100 bg-white shadow-soft">
          {QUESTIONS.map((item) => (
            <details key={item.question} className="group px-6 py-5 open:bg-sage-50/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-forest-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-200">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-forest-400 transition duration-300 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 pr-8 text-base leading-relaxed text-forest-500">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
