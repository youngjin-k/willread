const base = {

};

const light = {
  ...base,
  colors: {
    background: '#ffffff',
    primary: '#5484FF',
    secondary: '#ffffff',
    typography: {
      title: '#333333',
      primary: '#332FFF',
      secondary: '#888888',
    },
  },
};

const dark = {
  ...base,
  colors: {
    background: '#000000',
    primary: '#5484FF',
    secondary: '#111111',
    typography: {
      title: 'rgba(255, 255, 255, 0.9)',
      primary: '#5484FF',
      secondary: 'rgba(255, 255, 255, 0.6)',
    },
  },
};

export default {
  light,
  dark,
};
