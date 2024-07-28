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

const mapToFunctionForTypeConfig = (config) => {
  if (typeof config === 'function') {
    // Example config: { width: (data) => data.metadata?.width }
    // Return the function as is
    return config;
  } else {
    // Example config: { cloudName: 'my-cloud' }
    // Return a function that returns the configured value
    return () => config;
  }
};

exports._amendTransformTypeMapping = amendTransformTypeMapping;
exports._mapToFunctionForTypeConfig = mapToFunctionForTypeConfig;

exports.createGatsbyImageDataResolver = (gatsbyUtils, pluginOptions) => {
  const { createResolvers } = gatsbyUtils;
  const { transformTypes } = pluginOptions;

  const resolvers = {};

  transformTypes.forEach((transformType) => {
    const transformTypeConfig = {
      type: transformType.type || transformType,
      cloudName: mapToFunctionForTypeConfig(transformType.cloudName),
      secure: mapToFunctionForTypeConfig(transformType.secure),
      cname: mapToFunctionForTypeConfig(transformType.cname),
      secureDistribution: mapToFunctionForTypeConfig(
        transformType.secureDistribution
      ),
      privateCdn: mapToFunctionForTypeConfig(transformType.privateCdn),
      publicId: mapToFunctionForTypeConfig(transformType.publicId),
      height: mapToFunctionForTypeConfig(transformType.height),
      width: mapToFunctionForTypeConfig(transformType.width),
      format: mapToFunctionForTypeConfig(transformType.format),
      base64: mapToFunctionForTypeConfig(transformType.base64),
      tracedSVG: mapToFunctionForTypeConfig(transformType.tracedSVG),
      mapping: amendTransformTypeMapping(transformType.mapping || {}), // Deprecated
    };

    const gatsbyImageResolver = createGatsbyPluginImageResolver(
      gatsbyUtils,
      transformTypeConfig,
      { transformations: pluginOptions.defaultTransformations }
    );

    if (gatsbyImageResolver) {
      resolvers[transformTypeConfig.type] = {
        gatsbyImageData: gatsbyImageResolver,
      };
    }
  });

  createResolvers(resolvers);
};
