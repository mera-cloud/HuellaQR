const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{6,19}$/;

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  return PHONE_PATTERN.test(trimmed) && trimmed.replace(/\D/g, '').length >= 7;
}

export function validateOwner(input: { fullName: string; phone: string; email: string; password: string }) {
  const errors: FieldErrors<'fullName' | 'phone' | 'email' | 'password'> = {};
  if (input.fullName.trim().length < 2) errors.fullName = 'Escribe tu nombre completo.';
  if (!isValidPhone(input.phone)) errors.phone = 'Escribe un número válido (7 a 20 dígitos).';
  if (!isValidEmail(input.email)) errors.email = 'Escribe un correo electrónico válido.';
  if (input.password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  return errors;
}

export interface PetFormValues {
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  sex: string;
  weight: string;
  distinctiveFeatures: string;
  medicalInfo: string;
}

export function validatePet(values: PetFormValues) {
  const errors: FieldErrors<keyof PetFormValues> = {};
  if (!values.name.trim()) errors.name = 'Escribe el nombre de tu mascota.';
  else if (values.name.trim().length > 60) errors.name = 'El nombre no puede superar 60 caracteres.';
  if (!['perro', 'gato'].includes(values.species)) errors.species = 'Selecciona perro o gato.';
  if (!values.breed.trim()) errors.breed = 'Escribe la raza (o escribe "Mestizo").';
  if (!values.birthDate) errors.birthDate = 'Indica la fecha de nacimiento o una fecha aproximada.';
  else if (new Date(`${values.birthDate}T00:00:00`) > new Date()) errors.birthDate = 'La fecha no puede ser futura.';
  if (!['macho', 'hembra'].includes(values.sex)) errors.sex = 'Selecciona el sexo de tu mascota.';
  if (values.weight.trim()) {
    const weight = Number(values.weight);
    if (!Number.isFinite(weight) || weight <= 0 || weight >= 200) errors.weight = 'Escribe un peso válido en kilos.';
  }
  if (!values.distinctiveFeatures.trim()) errors.distinctiveFeatures = 'Describe al menos una característica distintiva.';
  else if (values.distinctiveFeatures.trim().length > 500) errors.distinctiveFeatures = 'Máximo 500 caracteres.';
  if (values.medicalInfo.length > 1000) errors.medicalInfo = 'Máximo 1000 caracteres.';
  return errors;
}

export interface FoundReportValues {
  finderName: string;
  location: string;
  foundAt: string;
  finderContact: string;
  canMeet: string;
  message: string;
}

export function validateFoundReport(values: FoundReportValues) {
  const errors: FieldErrors<keyof FoundReportValues> = {};
  if (values.finderName.trim().length < 2) errors.finderName = 'Escribe tu nombre.';
  if (values.location.trim().length < 3) errors.location = 'Describe dónde encontraste a la mascota.';
  if (!values.foundAt) errors.foundAt = 'Indica la fecha y hora del hallazgo.';
  else if (new Date(values.foundAt) > new Date()) errors.foundAt = 'La fecha y hora no puede ser futura.';
  if (!isValidEmail(values.finderContact) && !isValidPhone(values.finderContact)) {
    errors.finderContact = 'Escribe un teléfono o correo electrónico válido.';
  }
  if (!['si', 'no', 'acordar'].includes(values.canMeet)) errors.canMeet = 'Selecciona una opción.';
  if (values.message.length > 500) errors.message = 'Máximo 500 caracteres.';
  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
