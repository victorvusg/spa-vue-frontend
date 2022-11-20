import 'material-design-icons-iconfont/dist/material-design-icons.css'; // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: 'md',
  },
  breakpoint: {
    thresholds: {
      xs: 600, // below 600: xs
      sm: 1025, // 600-1024: sm
      md: 1280, // 1025-1263: md
      lg: 1920, // 1264-1903: lg
    },
  },
  theme: {
    light: true,
    themes: {
      options: {
        customProperties: true,
      },
      light: {
        // primary: '#295F49',
        primary: '#2f573d',
        secondary: '#ffbe8a',
        accent: '#F1EFE6',
        // accent: '#8c9eff',
        error: '#AB3330',
        warning: '#F2853A',
      },
    },
  },
};
export default new Vuetify(opts);
