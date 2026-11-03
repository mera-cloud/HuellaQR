import QRCode from 'qrcode';

export function buildPublicPetUrl(publicCode: string): string {
  return `${window.location.origin}${window.location.pathname}#/p/${publicCode}`;
}

export function createQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 720,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#344A40', light: '#FFFFFF' },
  });
}

export function qrFileName(petName: string): string {
  const slug = petName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `huellaqr-${slug || 'mascota'}.png`;
}
