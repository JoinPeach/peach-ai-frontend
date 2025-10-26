import { useEffect, useState } from 'react';
import { Check, Cloud, CloudOff } from 'lucide-react';

interface SaveIndicatorProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  error?: string | null;
}

export function SaveIndicator({ isSaving, lastSaved, error }: SaveIndicatorProps) {
  // Component disabled - no save status messages shown
  return null;
}

// Hook to manage save state
export function useSaveIndicator() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSaving = () => {
    setIsSaving(true);
    setError(null);
  };

  const finishSaving = () => {
    setIsSaving(false);
    setLastSaved(new Date());
  };

  const setSaveError = (errorMessage: string) => {
    setIsSaving(false);
    setError(errorMessage);
    setTimeout(() => setError(null), 3000);
  };

  return {
    isSaving,
    lastSaved,
    error,
    startSaving,
    finishSaving,
    setSaveError,
  };
}
