const { createGatsbyPluginImageResolver } = require('./resolvers');

exports.createGatsbyImageDataResolver = (gatsbyUtils, pluginOptions) => {
  const { createResolvers } = gatsbyUtils;
  const gatsbyImageResolver = createGatsbyPluginImageResolver(
    gatsbyUtils,
    pluginOptions
  );

  if (gatsbyImageResolver) {
    createResolvers({
      CloudinaryAsset: {
        gatsbyImageData: gatsbyImageResolver,
      },
    });
  }
};
