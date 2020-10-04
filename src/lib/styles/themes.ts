import { DefaultTheme } from 'styled-components/native';

declare module 'styled-components' {
  export interface DefaultTheme {
    dark: boolean;
    colors: {
      background: string;
      primary: string;
      primaryTender: string;
      secondary: string;
      grey1: string,
      grey2: string,
      border: string;
      typography: {
        title: string;
        secondary: string;
      },
      category: {
        default: string;
        red: string;
        blue: string;
        orange: string;
        green: string;
        yellow: string;
        pink: string;
      },
    },
  }
}

const light: DefaultTheme = {
  dark: false,
  colors: {
    background: '#ffffff',
    primary: '#4B2FFF',
    primaryTender: 'rgba(75, 47, 255, 0.1)',
    secondary: '#F0F1F3',
    grey1: '#DFDFE6',
    grey2: '#72717D',
    border: '#DCDCDC',
    typography: {
      title: '#121214',
      secondary: '#81808B',
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
    primary: '#745DFF',
    primaryTender: 'rgba(116, 93, 255, 0.1)',
    secondary: '#212126',
    grey1: '#333338',
    grey2: '#82808B',
    border: '#232323',
    typography: {
      title: '#F9F9FD',
      secondary: '#81808B',
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
