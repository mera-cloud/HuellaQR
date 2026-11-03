import { useCallback, useEffect, useState, type DependencyList } from 'react';
import { toUserMessage } from '@/lib/errors';

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));
    loader()
      .then((data) => {
        if (active) setState({ data, error: null, loading: false });
      })
      .catch((error: unknown) => {
        if (active) setState({ data: null, error: toUserMessage(error), loading: false });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  const updateData = useCallback((updater: (current: T) => T) => {
    setState((current) => (current.data === null ? current : { ...current, data: updater(current.data) }));
  }, []);

  return { ...state, reload, updateData };
}
