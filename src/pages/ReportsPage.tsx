import { Loader2 } from 'lucide-react';
import { listMyReports } from '@/lib/reports';
import { useAsyncData } from '@/lib/useAsyncData';
import type { ReportStatus } from '@/lib/types';
import { Alert } from '@/components/ui/Alert';
import { ReportCard } from '@/components/panel/ReportCard';

export function ReportsPage() {
  const { data: reports, error, loading, reload, updateData } = useAsyncData(listMyReports, []);

  const handleStatusChange = (id: string, status: ReportStatus) => {
    updateData((current) => current.map((report) => (report.id === id ? { ...report, status } : report)));
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Reportes</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Mascotas encontradas</h1>
        <p className="mt-2 max-w-2xl text-base text-forest-500">
          Aquí llegan los avisos de quienes encontraron a tus mascotas. Contacta a la persona para acordar el reencuentro.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-forest-500">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          <span className="text-base font-medium">Cargando reportes...</span>
        </div>
      )}

      {!loading && error && (
        <div className="space-y-4">
          <Alert tone="error">{error}</Alert>
          <button type="button" className="btn-secondary" onClick={reload}>Intentar de nuevo</button>
        </div>
      )}

      {!loading && !error && reports && reports.length === 0 && (
        <div className="card mx-auto max-w-xl px-8 py-14 text-center">
          <h2 className="text-2xl font-extrabold">Sin reportes por ahora</h2>
          <p className="mt-3 text-base leading-relaxed text-forest-500">
            Cuando alguien escanee el código QR de una de tus mascotas y la reporte, el aviso aparecerá aquí.
          </p>
        </div>
      )}

      {!loading && !error && reports && reports.length > 0 && (
        <ul className="space-y-6">
          {reports.map((report) => (
            <li key={report.id}>
              <ReportCard report={report} onStatusChange={handleStatusChange} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
