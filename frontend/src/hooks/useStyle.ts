import {useMemo} from 'react';

export const useStyle = (style: object, deps: any[] = []) => {
  return useMemo(() => style, deps);
};
