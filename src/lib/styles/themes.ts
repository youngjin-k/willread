import { DefaultTheme } from 'styled-components/native';

declare module 'styled-components' {
  export interface DefaultTheme {
    dark: boolean;
    colors: {
      background: string;
      primary: string;
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
    primary: '#4B2FFF',
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
      red: '#CE4C4C',
      blue: '#2155DC',
      orange: '#DC7F4A',
      green: '#239C62',
      yellow: '#E5D332',
      pink: '#DD48B3',
    },
  },
};

export default {
  light,
  dark,
};
