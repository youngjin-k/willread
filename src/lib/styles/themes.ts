const base = {

};

const light = {
  ...base,
  colors: {
    background: '#ffffff',
    primary: '#4B2FFF',
    secondary: '#EDEFF4',
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

const dark = {
  ...base,
  colors: {
    background: '#121214',
    primary: '#4B2FFF',
    secondary: '#111111',
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
