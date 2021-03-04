exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('http-browserify'),
        https: require.resolve('https-browserify'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
      },
      fallback: {
        fs: false,
      },
    },
  });
};
