const base = {

};

const light = {
  ...base,
  colors: {
    background: '#ffffff',
    primary: '#332FFF',
    secondary: '#EDEFF4',
    border: '#DCDCDC',
    typography: {
      title: '#333333',
      primary: '#332FFF',
      secondary: '#888888',
    },
    category: {
      default: '#EAEAEA',
      red: '#FF7B7B',
      blue: '#5484FF',
      orange: '#FFAB7B',
      green: '#60D29B',
      yellow: '#F2E787',
      purple: '#DD7BFF',
    },
  },
};

const dark = {
  ...base,
  colors: {
    background: '#000000',
    primary: '#5484FF',
    secondary: '#111111',
    border: '#232323',
    typography: {
      title: 'rgba(255, 255, 255, 0.8)',
      primary: '#5484FF',
      secondary: 'rgba(255, 255, 255, 0.4)',
    },
    category: {
      default: '#B4B4B4',
      red: '#FF7B7B',
      blue: '#5484FF',
      orange: '#FFAB7B',
      green: '#60D29B',
      yellow: '#F2E787',
      purple: '#DD7BFF',
    },
  },
};

export default {
  light,
  dark,
};
