import { useEffect, EffectCallback } from 'react';

export default function useMount(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
