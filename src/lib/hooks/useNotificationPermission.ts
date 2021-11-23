import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import * as Notifications from 'expo-notifications';
import { AppState } from 'react-native';

export enum PermissionStatus {
  GRANTED = 'granted',
  UNDETERMINED = 'undetermined',
  DENIED = 'denied',
}

export const requestPermissionsAsync = async () => Notifications.requestPermissionsAsync({
  ios: {
    allowAlert: true,
    allowBadge: true,
    allowSound: true,
    allowAnnouncements: true,
  },
});

export default function useNotificationPermission() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>();
  const permissionStatusRef = useRef<PermissionStatus>();

  useEffect(() => {
    const getPermissions = async () => {
      const settings = await Notifications.getPermissionsAsync();
      setPermissionStatus(settings.status);
      permissionStatusRef.current = settings.status;
    };

    getPermissions();
    const subscription = AppState.addEventListener('change', getPermissions);

    return () => {
      subscription.remove();
    };
  }, []);

  const requestPermissions = useCallback(async () => {
    const { status } = await requestPermissionsAsync();
    setPermissionStatus(status);
    permissionStatusRef.current = status;

    return status;
  }, []);

  return {
    permissionStatus,
    permissionStatusRef,
    requestPermissions,
  };
}
