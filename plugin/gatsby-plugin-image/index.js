const { createGatsbyPluginImageResolver } = require('./resolvers');

exports.createGatsbyImageDataResolver = (gatsbyUtils, pluginOptions) => {
  const { createResolvers } = gatsbyUtils;
  const { transformTypes } = pluginOptions;

  const resolvers = {};
  // Make the resolver nullable, createGatsbyPluginImageResolver sets the type to 'GatsbyImageData!'

  transformTypes.forEach((transformType) => {
    const transformTypeConfig = [
      'cloudName',
      'publicId',
      'height',
      'width',
      'format',
      'base64',
      'tracedSVG',
    ].reduce(
      (acc, key) => {
        if (typeof transformType[key] === 'function') {
          // Example config: { publicId: (data) => data['a_public_id'] }
          // Use the configued function to get the field value
          acc[key] = transformType[key];
        } else if (typeof transformType[key] === 'string') {
          // Example config: { publicId: 'a_public_id' }
          // Use the configured key as the field name
          acc[key] = (source) => source[transformType[key]];
        } else {
          // Use the key as the field name
          acc[key] = (source) => source[key];
        }
        return acc;
      },
      {
        type: transformType.type || transformType,
      }
    );

    transformTypeConfig.transformations = pluginOptions.defaultTransformations;

    const gatsbyImageResolver = createGatsbyPluginImageResolver(
      gatsbyUtils,
      transformTypeConfig
    );

    if (gatsbyImageResolver) {
      resolvers[transformTypeConfig.type] = {
        gatsbyImageData: gatsbyImageResolver,
      };
    }
  });

  createResolvers(resolvers);
};
