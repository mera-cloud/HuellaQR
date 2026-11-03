import { ArrowRight, QrCode } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="animate-fade-up">
          <p className="eyebrow">Identifica. Protege. Reencuentra.</p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Una huella siempre encuentra su camino a casa.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest-500 sm:text-xl">
            Identifica a tu mascota con un código QR gratuito y facilita su regreso a casa si alguna vez se extravía.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#/registro" className="btn-primary px-7 py-4 text-lg">
              Registrar a mi mascota
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href="#como-funciona" className="btn-secondary px-7 py-4 text-lg">
              Cómo funciona
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-forest-500">
            <li>Gratis para siempre</li>
            <li>Sin instalar aplicaciones</li>
            <li>Tus datos protegidos</li>
          </ul>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src="https://images.pexels.com/photos/7210460/pexels-photo-7210460.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Una persona abrazando a sus perros al aire libre"
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-6 left-4 flex items-center gap-4 rounded-2xl border border-forest-100 bg-white px-5 py-4 shadow-lift sm:left-auto sm:-right-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100 text-forest-600">
              <QrCode className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-forest-700">Luna, en casa</p>
              <p className="text-sm text-forest-400">Escanea y contacta al instante</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
