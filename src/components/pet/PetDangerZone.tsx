import { useState } from 'react';
import { EyeOff, Loader2, Power, Trash2 } from 'lucide-react';
import { deletePet, setPetActive } from '@/lib/pets';
import { toUserMessage } from '@/lib/errors';
import { navigate } from '@/lib/router';
import type { Pet } from '@/lib/types';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface PetDangerZoneProps {
  pet: Pet;
  onActiveChange: (active: boolean) => void;
}

export function PetDangerZone({ pet, onActiveChange }: PetDangerZoneProps) {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const toggleActive = async () => {
    setWorking(true);
    setError(null);
    try {
      await setPetActive(pet.id, !pet.active);
      onActiveChange(!pet.active);
    } catch (err) {
      setError(toUserMessage(err, 'No pudimos cambiar el estado del perfil. Inténtalo de nuevo.'));
    } finally {
      setWorking(false);
    }
  };

  const handleDelete = async () => {
    setWorking(true);
    setError(null);
    try {
      await deletePet(pet.id);
      navigate('/panel');
    } catch (err) {
      setError(toUserMessage(err, 'No pudimos eliminar el perfil. Inténtalo de nuevo.'));
      setWorking(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <section className="rounded-2xl border border-red-100 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-bold">Administrar perfil</h2>
      <p className="mt-1 text-sm text-forest-400">Puedes ocultar el perfil temporalmente o eliminarlo por completo.</p>

      {error && (
        <div className="mt-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-secondary" onClick={toggleActive} disabled={working}>
          {working ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : pet.active ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Power className="h-4 w-4" aria-hidden="true" />}
          {pet.active ? 'Desactivar perfil' : 'Reactivar perfil'}
        </button>
        <button type="button" className="btn-danger" onClick={() => setConfirmingDelete(true)} disabled={working}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Eliminar perfil
        </button>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title={`¿Eliminar el perfil de ${pet.name}?`}
          confirmLabel="Sí, eliminar"
          loading={working}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        >
          Se borrarán el perfil, su código QR y todos los reportes recibidos. Esta acción no se puede deshacer.
        </ConfirmDialog>
      )}
    </section>
  );
}
