import type { CanMeet, PetSex, PetSpecies, PetStatus, ReportStatus } from '@/lib/types';

export const SPECIES_LABELS: Record<PetSpecies, string> = {
  perro: 'Perro',
  gato: 'Gato',
};

export const SEX_LABELS: Record<PetSex, string> = {
  macho: 'Macho',
  hembra: 'Hembra',
};

export const STATUS_LABELS: Record<PetStatus, string> = {
  en_casa: 'En casa',
  extraviada: 'Extraviada',
  en_reencuentro: 'En proceso de reencuentro',
};

export const CAN_MEET_LABELS: Record<CanMeet, string> = {
  si: 'Sí, puedo trasladarme',
  no: 'No puedo trasladarme',
  acordar: 'Podemos acordarlo',
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  nuevo: 'Nuevo',
  atendido: 'Atendido',
};

export function calculateAge(birthDate: string | null): string {
  if (!birthDate) return 'No indicada';
  const birth = new Date(`${birthDate}T00:00:00`);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years <= 0) {
    const totalMonths = Math.max(months, 0);
    return totalMonths === 1 ? '1 mes' : `${totalMonths} meses`;
  }
  return years === 1 ? '1 año' : `${years} años`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toDateInputValue(value: Date): string {
  const offset = value.getTimezoneOffset();
  return new Date(value.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function toDateTimeLocalValue(value: Date): string {
  const offset = value.getTimezoneOffset();
  return new Date(value.getTime() - offset * 60_000).toISOString().slice(0, 16);
}
