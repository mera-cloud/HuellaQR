import { useEffect, useState, type ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import { validatePhotoFile } from '@/lib/photos';

interface PhotoUploadProps {
  id: string;
  label: string;
  currentUrl: string | null;
  onFileChange: (file: File | null) => void;
  hint?: string;
}

export function PhotoUpload({ id, label, currentUrl, onFileChange, hint }: PhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    const problem = validatePhotoFile(file);
    if (problem) {
      setError(problem);
      onFileChange(null);
      event.target.value = '';
      return;
    }
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  };

  const imageUrl = previewUrl ?? currentUrl;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sage-100 ring-1 ring-inset ring-sage-300">
        {imageUrl ? (
          <img src={imageUrl} alt="Vista previa de la fotografía" className="h-full w-full object-cover" />
        ) : (
          <Camera className="h-10 w-10 text-forest-400" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="btn-secondary cursor-pointer">
          <Camera className="h-4 w-4" aria-hidden="true" />
          {label}
        </label>
        <input id={id} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleChange} />
        <p className="mt-2 text-sm text-forest-400">{hint ?? 'JPG, PNG o WebP. Máximo 5 MB.'}</p>
        {error && (
          <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
