const KNOWN_MESSAGES: Array<[string, string]> = [
  ['Invalid login credentials', 'Correo o contraseña incorrectos.'],
  ['User already registered', 'Ya existe una cuenta con este correo electrónico.'],
  ['Password should be at least', 'La contraseña debe tener al menos 6 caracteres.'],
  ['rate limit', 'Hiciste demasiados intentos. Espera unos minutos e inténtalo de nuevo.'],
  ['Failed to fetch', 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.'],
  ['NetworkError', 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.'],
  ['pet_not_found', 'Esta mascota ya no está disponible para recibir reportes.'],
  ['invalid_found_at', 'La fecha del hallazgo no es válida.'],
  ['invalid_photo', 'La fotografía no es válida. Vuelve a subirla.'],
  ['requiere configuración adicional', 'Tu cuenta requiere configuración adicional antes de poder usarse.'],
];

function readMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return '';
}

export function toUserMessage(error: unknown, fallback = 'Algo salió mal. Inténtalo de nuevo en unos momentos.'): string {
  const message = readMessage(error);
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : '';

  if (code === '42501') return 'No tienes permiso para realizar esta acción.';
  if (code === '23514') return 'Revisa los datos del formulario: alguno no cumple con el formato requerido.';

  const match = KNOWN_MESSAGES.find(([fragment]) => message.includes(fragment));
  return match ? match[1] : fallback;
}
