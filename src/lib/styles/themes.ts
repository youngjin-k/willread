import { DefaultTheme } from 'styled-components/native';

declare module 'styled-components' {
  export interface DefaultTheme {
    dark: boolean;
    colors: {
      background: string;
      backgroundElevated: string;
      primary: string;
      primaryTender: string;
      danger: string;
      dangerTender: string;
      border: string;
      inputBackground: string;
      buttonDisabled: string;
      typography: {
        primary: string;
        secondary: string;
        point: string;
        disabled: string;
      };
    };
  }
}

const light: DefaultTheme = {
  dark: false,
  colors: {
    background: '#ffffff',
    backgroundElevated: '#ffffff',
    primary: '#6E57FF',
    primaryTender: 'rgba(110, 87, 255, 0.1)',
    danger: '#FF0745',
    dangerTender: 'rgba(255, 7, 69, 0.1)',
    border: '#E4E4EB',
    inputBackground: '#EBEBF1',
    buttonDisabled: '#E4E4EB',
    typography: {
      primary: '#121214',
      secondary: '#81808B',
      point: '#543DE8',
      disabled: '#BAB9C6',
    },
  },
};

const dark: DefaultTheme = {
  dark: true,
  colors: {
    background: '#121214',
    backgroundElevated: '#1B1B1E',
    primary: '#5E4AD9',
    primaryTender: 'rgba(94, 74, 217, 0.1)',
    danger: '#CC3834',
    dangerTender: 'rgba(204, 56, 52, 0.07)',
    border: '#2C2C34',
    inputBackground: '#2C2C34',
    buttonDisabled: '#202027',
    typography: {
      primary: '#F9F9FD',
      secondary: '#81808B',
      point: '#7463D9',
      disabled: '#42424A',
    },
  },
};

export default {
  light,
  dark,
};
