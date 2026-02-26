import { createContext, useContext } from 'react';

export const CompactContext = createContext(true);

export function useCompact() {
  return useContext(CompactContext);
}
