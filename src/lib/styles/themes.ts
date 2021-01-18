import { DefaultTheme } from 'styled-components/native';

declare module 'styled-components' {
  // export interface DefaultTheme {
  //   dark: boolean;
  //   colors: {
  //     background: string;
  //     primary: string;
  //     primaryTender: string;
  //     secondary: string;
  //     grey1: string;
  //     grey2: string;
  //     danger: string;
  //     dangerTender: string;
  //     border: string;
  //     typography: {
  //       title: string;
  //       secondary: string;
  //     };
  //     category: {
  //       default: string;
  //       red: string;
  //       blue: string;
  //       orange: string;
  //       green: string;
  //       yellow: string;
  //       pink: string;
  //     };
  //   };
  // }

  export interface DefaultTheme {
    dark: boolean;
    colors: {
      background: string;
      primary: string;
      primaryTender: string;
      secondary: string;
      grey1: string;
      grey2: string;
      danger: string;
      dangerTender: string;
      border: string;
      inputBackground: string;
      typography: {
        primary: string;
        secondary: string;
        point: string;
        disabled: string;
      };
      category: {
        default: string;
        red: string;
        blue: string;
        orange: string;
        green: string;
        yellow: string;
        pink: string;
      };
    };
  }
}

const light: DefaultTheme = {
  dark: false,
  colors: {
    background: '#ffffff',
    primary: '#6E57FF',
    primaryTender: 'rgba(110, 87, 255, 0.1)',
    secondary: '#F0F1F3',
    grey1: '#DFDFE6',
    grey2: '#72717D',
    danger: '#FF0745',
    dangerTender: 'rgba(255, 7, 69, 0.1)',
    border: '#E4E4EB',
    inputBackground: '#EBEBF1',
    typography: {
      primary: '#121214',
      secondary: '#81808B',
      point: '#543DE8',
      disabled: '#BAB9C6',
    },
    category: {
      default: '#EAEAEA',
      red: '#FF7B7B',
      blue: '#5484FF',
      orange: '#FFA16C',
      green: '#60D29B',
      yellow: '#FAEB69',
      pink: '#FF85DD',
    },
  },
};

const dark: DefaultTheme = {
  dark: true,
  colors: {
    background: '#121214',
    primary: '#5E4AD9',
    primaryTender: 'rgba(94, 74, 217, 0.1)',
    secondary: '#212126',
    grey1: '#333338',
    grey2: '#82808B',
    danger: '#CC3834',
    dangerTender: 'rgba(204, 56, 52, 0.07)',
    border: '#2C2C34',
    inputBackground: '#2C2C34',
    typography: {
      primary: '#F9F9FD',
      secondary: '#81808B',
      point: '#7463D9',
      disabled: '#42424A',
    },
    category: {
      default: '#B4B4B4',
      red: '#DF7575',
      blue: '#7DA1FD',
      orange: '#F3A980',
      green: '#6FDAA6',
      yellow: '#F1E579',
      pink: '#E493CE',
    },
  },
};

export default {
  light,
  dark,
};
