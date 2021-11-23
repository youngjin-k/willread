import AsyncStorage from '@react-native-community/async-storage';

const PREFIX = '$preference__';

export type PreferenceKeyNames = 'allowExpireNotification';

export const defaultValues: Record<PreferenceKeyNames, string> = {
  allowExpireNotification: 'true',
};

export const getPreference = async (key: PreferenceKeyNames) => {
  const value = await AsyncStorage.getItem(`${PREFIX}key`);

  if (value === null) {
    return defaultValues[key];
  }

  return value;
};

export const setPreference = async (
  key: PreferenceKeyNames,
  value: string,
) => AsyncStorage.setItem(`${PREFIX}key`, value);
