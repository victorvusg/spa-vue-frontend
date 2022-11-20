const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
  transpileDependencies: ['vuetify'],
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve('src'),
        '@assets': path.resolve('src/assets'),
        '@helpers': path.resolve('src/helpers'),
        '@layout': path.resolve('src/layout'),
        '@mixins': path.resolve('src/mixins'),
        '@plugins': path.resolve('src/plugins'),
        '@store': path.resolve('src/store'),
        '@views': path.resolve('src/views'),
        '@filters': path.resolve('src/filters'),
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {},
    },
  },
};
