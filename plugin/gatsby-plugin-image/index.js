const { createGatsbyPluginImageResolver } = require('./resolvers');

const amendTransformTypeConfig = (transformType) => {
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
  return transformTypeConfig;
};

exports._amendTransformTypeConfig = amendTransformTypeConfig;

exports.createGatsbyImageDataResolver = (gatsbyUtils, pluginOptions) => {
  const { createResolvers } = gatsbyUtils;
  const { transformTypes } = pluginOptions;

  const resolvers = {};

  transformTypes.forEach((transformType) => {
    const transformTypeConfig = amendTransformTypeConfig(transformType);
    const gatsbyImageResolver = createGatsbyPluginImageResolver(
      gatsbyUtils,
      transformTypeConfig,
      { transformations: pluginOptions.defaultTransformations, secure: true }
    );

    if (gatsbyImageResolver) {
      resolvers[transformTypeConfig.type] = {
        gatsbyImageData: gatsbyImageResolver,
      };
    }
  });

  createResolvers(resolvers);
};
