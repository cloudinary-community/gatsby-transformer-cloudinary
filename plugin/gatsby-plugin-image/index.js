const { createGatsbyPluginImageResolver } = require('./resolvers');

const amendTransformTypeMapping = (mapping) => {
  return [
    'cloudName',
    'publicId',
    'height',
    'width',
    'format',
    'base64',
    'tracedSVG',
  ].reduce((acc, key) => {
    if (typeof mapping[key] === 'function') {
      // Example config: { publicId: (data) => data['a_public_id'] }
      // Use the configued function to get the field value
      acc[key] = mapping[key];
    } else if (typeof mapping[key] === 'string') {
      // Example config: { publicId: 'a_public_id' }
      // Use the configured key as the field name
      acc[key] = (source) => source[mapping[key]];
    } else {
      // Use the key as the field name
      acc[key] = (source) => source[key];
    }
    return acc;
  }, {});
};

exports._amendTransformTypeMapping = amendTransformTypeMapping;

exports.createGatsbyImageDataResolver = (gatsbyUtils, pluginOptions) => {
  const { createResolvers } = gatsbyUtils;
  const { transformTypes } = pluginOptions;

  const resolvers = {};

  transformTypes.forEach((transformType) => {
    const transformTypeConfig = {
      type: transformType.type || transformType,
      mapping: amendTransformTypeMapping(transformType.mapping || {}),
    };

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
