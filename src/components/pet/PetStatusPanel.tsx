import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updatePetStatus } from '@/lib/pets';
import { toUserMessage } from '@/lib/errors';
import type { Pet, PetStatus } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/format';
import { Alert } from '@/components/ui/Alert';

const STATUS_OPTIONS: Array<{ value: PetStatus; label: string; hint: string }> = [
  { value: 'en_casa', label: STATUS_LABELS.en_casa, hint: 'Tu mascota está segura contigo.' },
  { value: 'extraviada', label: STATUS_LABELS.extraviada, hint: 'Se muestra un aviso visible a quien escanee el QR.' },
  { value: 'en_reencuentro', label: STATUS_LABELS.en_reencuentro, hint: 'Ya estás en contacto con quien la encontró.' },
];

interface PetStatusPanelProps {
  pet: Pet;
  onSaved: (status: PetStatus) => void;
}

export function PetStatusPanel({ pet, onSaved }: PetStatusPanelProps) {
  const [selected, setSelected] = useState<PetStatus>(pet.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const changed = selected !== pet.status;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updatePetStatus(pet.id, selected);
      onSaved(selected);
      setSaved(true);
    } catch (err) {
      setError(toUserMessage(err, 'No pudimos cambiar el estado. Inténtalo de nuevo.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card space-y-5 p-6 sm:p-8">
      <div>
        <h2 className="text-lg font-bold">Estado de la mascota</h2>
        <p className="mt-1 text-sm text-forest-400">Así aparecerá en su perfil público.</p>
      </div>

      <fieldset className="grid gap-3">
        <legend className="sr-only">Estado</legend>
        {STATUS_OPTIONS.map((option) => {
          const checked = selected === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition duration-200 focus-within:ring-4 focus-within:ring-sage-200 ${
                checked ? 'border-forest-600 bg-sage-50' : 'border-forest-200 bg-white hover:border-forest-400'
              }`}
            >
              <input
                type="radio"
                name="pet-status"
                value={option.value}
                checked={checked}
                onChange={() => {
                  setSelected(option.value);
                  setSaved(false);
                }}
                className="mt-1 h-4 w-4 border-forest-300 text-forest-600 focus:ring-sage-300"
              />
              <span>
                <span className="block font-semibold text-forest-700">{option.label}</span>
                <span className="block text-sm text-forest-400">{option.hint}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {error && <Alert tone="error">{error}</Alert>}
      {saved && !changed && <Alert tone="success">Estado actualizado correctamente.</Alert>}

      <button type="button" className="btn-primary" onClick={handleSave} disabled={!changed || saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Guardar estado
      </button>
    </section>
  );
}
