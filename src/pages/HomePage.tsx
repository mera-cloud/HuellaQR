import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { PrivacySection } from '@/components/home/PrivacySection';

function CallToAction() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-forest-600 px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
          Prepara hoy el regreso a casa de tu mascota
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-sage-100">
          Registrarla toma unos minutos y no cuesta nada. Tenerla identificada puede marcar la diferencia.
        </p>
        <a href="#/registro" className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-cream-50 px-7 py-4 text-lg font-semibold text-forest-700 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lift focus:outline-none focus-visible:ring-4 focus-visible:ring-sage-300">
          Registrar a mi mascota
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CallToAction />
      <FaqSection />
      <PrivacySection />
    </>
  );
}
