import { useColorScheme } from 'react-native';
import themes from './themes';

function useTheme() {
  const scheme = useColorScheme();
  const appearance = scheme === 'dark' ? 'dark' : 'light';

  return themes[appearance];
}

export default useTheme;
