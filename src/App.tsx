import { useEffect, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getAnchorFromHash, navigate, parseRoute, useHash } from '@/lib/router';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { PanelLayout } from '@/components/layout/PanelLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { PanelPage } from '@/pages/PanelPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { PetFormPage } from '@/pages/PetFormPage';
import { PetDetailPage } from '@/pages/PetDetailPage';
import { PetQrPage } from '@/pages/PetQrPage';
import { PublicPetPage } from '@/pages/PublicPetPage';
import { ReportFoundPage } from '@/pages/ReportFoundPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function ProtectedPanel({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/iniciar-sesion');
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-500" aria-label="Cargando" />
      </div>
    );
  }

  return <PanelLayout>{children}</PanelLayout>;
}

function renderPanel(segments: string[]): ReactNode {
  const [first, petId, action] = segments;

  if (segments.length === 0) return <ProtectedPanel><PanelPage /></ProtectedPanel>;
  if (first === 'reportes' && segments.length === 1) return <ProtectedPanel><ReportsPage /></ProtectedPanel>;
  if (first !== 'mascotas') return null;
  if (petId === 'nueva' && segments.length === 2) return <ProtectedPanel><PetFormPage /></ProtectedPanel>;
  if (!petId) return null;
  if (segments.length === 2) return <ProtectedPanel><PetDetailPage petId={petId} /></ProtectedPanel>;
  if (action === 'editar' && segments.length === 3) return <ProtectedPanel><PetFormPage petId={petId} /></ProtectedPanel>;
  if (action === 'qr' && segments.length === 3) return <ProtectedPanel><PetQrPage petId={petId} /></ProtectedPanel>;
  return null;
}

function renderPublic(segments: string[]): ReactNode {
  const [first, code, action] = segments;

  if (segments.length === 0) return <SiteLayout><HomePage /></SiteLayout>;
  if (first === 'iniciar-sesion' && segments.length === 1) return <SiteLayout><LoginPage /></SiteLayout>;
  if (first === 'registro' && segments.length === 1) return <SiteLayout><RegisterPage /></SiteLayout>;
  if (first === 'p' && code && segments.length === 2) return <SiteLayout><PublicPetPage code={code} /></SiteLayout>;
  if (first === 'p' && code && action === 'reportar' && segments.length === 3) {
    return <SiteLayout><ReportFoundPage code={code} /></SiteLayout>;
  }
  return null;
}

function renderRoute(segments: string[]): ReactNode {
  if (segments[0] === 'panel') return renderPanel(segments.slice(1)) ?? <NotFoundPage />;
  return renderPublic(segments) ?? <NotFoundPage />;
}

export default function App() {
  const hash = useHash();
  const anchor = getAnchorFromHash(hash);

  useEffect(() => {
    if (anchor) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0 });
  }, [hash, anchor]);

  if (anchor) return <SiteLayout><HomePage /></SiteLayout>;
  return renderRoute(parseRoute(hash));
}
