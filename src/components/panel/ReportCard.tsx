import { useState } from 'react';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { updateReportStatus } from '@/lib/reports';
import { CAN_MEET_LABELS, REPORT_STATUS_LABELS, formatDateTime } from '@/lib/format';
import type { FoundReport, ReportStatus } from '@/lib/types';
import { toUserMessage } from '@/lib/errors';
import { Alert } from '@/components/ui/Alert';

export function ReportCard({ report, onStatusChange }: { report: FoundReport; onStatusChange: (id: string, status: ReportStatus) => void }) {
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const nextStatus: ReportStatus = report.status === 'nuevo' ? 'atendido' : 'nuevo';
  const contactIsEmail = report.finder_contact.includes('@');
  const contactHref = contactIsEmail ? `mailto:${report.finder_contact}` : `tel:${report.finder_contact.replace(/[^\d+]/g, '')}`;

  const toggleStatus = async () => {
    setSaving(true);
    setActionError(null);
    try {
      await updateReportStatus(report.id, nextStatus);
      onStatusChange(report.id, nextStatus);
    } catch (error) {
      setActionError(toUserMessage(error, 'No pudimos actualizar el reporte. Inténtalo de nuevo.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="card overflow-hidden">
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row">
        {report.photo_url && (
          <a href={report.photo_url} target="_blank" rel="noopener noreferrer" className="shrink-0 overflow-hidden rounded-2xl md:w-44">
            <img src={report.photo_url} alt={`Fotografía enviada por ${report.finder_name}`} className="h-44 w-full object-cover transition duration-300 hover:scale-105 md:w-44" loading="lazy" />
          </a>
        )}

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${report.status === 'nuevo' ? 'bg-clay-100 text-clay-700' : 'bg-sage-100 text-forest-700'}`}>
              {REPORT_STATUS_LABELS[report.status]}
            </span>
            <span className="text-sm text-forest-400">Recibido el {formatDateTime(report.created_at)}</span>
          </div>

          <div>
            <p className="text-sm text-forest-400">Mascota</p>
            <h2 className="text-xl font-bold">{report.pets?.name ?? 'Mascota'}</h2>
          </div>

          <dl className="grid gap-4 text-base sm:grid-cols-2">
            <div>
              <dt className="text-sm text-forest-400">Quien la encontró</dt>
              <dd className="font-semibold text-forest-700">{report.finder_name}</dd>
            </div>
            <div>
              <dt className="text-sm text-forest-400">Fecha y hora del hallazgo</dt>
              <dd className="font-semibold text-forest-700">{formatDateTime(report.found_at)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-forest-400">Lugar del hallazgo</dt>
              <dd className="flex items-start gap-2 font-semibold text-forest-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-400" aria-hidden="true" />
                {report.location}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-forest-400">Contacto</dt>
              <dd>
                <a href={contactHref} className="inline-flex items-center gap-2 font-semibold text-forest-700 underline decoration-sage-400 underline-offset-4 hover:decoration-forest-600">
                  {contactIsEmail ? <Mail className="h-4 w-4" aria-hidden="true" /> : <Phone className="h-4 w-4" aria-hidden="true" />}
                  {report.finder_contact}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-forest-400">Disponibilidad para el reencuentro</dt>
              <dd className="font-semibold text-forest-700">{CAN_MEET_LABELS[report.can_meet]}</dd>
            </div>
          </dl>

          {report.message && (
            <blockquote className="rounded-xl bg-cream-100/70 p-4 text-base leading-relaxed text-forest-600">
              {report.message}
            </blockquote>
          )}

          {actionError && <Alert tone="error">{actionError}</Alert>}

          <div>
            <button type="button" onClick={toggleStatus} disabled={saving} className={report.status === 'nuevo' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {report.status === 'nuevo' ? 'Marcar como atendido' : 'Volver a marcar como nuevo'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
