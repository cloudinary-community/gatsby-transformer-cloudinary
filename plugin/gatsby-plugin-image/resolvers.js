exports.createGatsbyPluginImageResolver = (
  gatsbyUtils,
  transformTypeConfig
) => {
  const { reporter } = gatsbyUtils;
  try {
    const {
      getGatsbyImageResolver,
    } = require('gatsby-plugin-image/graphql-utils');
    const { createResolveCloudinaryAssetData } = require('./resolve-asset');
    const { CloudinaryPlaceholderType } = require('./types');

    const gatsbyImageResolver = getGatsbyImageResolver(
      createResolveCloudinaryAssetData(gatsbyUtils, transformTypeConfig),
      {
        transformations: {
          type: '[String]',
          defaultValue: transformTypeConfig.Transformations,
        },
        chained: '[String]',
        placeholder: {
          type: CloudinaryPlaceholderType,
        },
        secure: {
          type: 'Boolean',
          defaultValue: true,
        },
        logLevel: {
          type: 'String',
        },
      }
    );

    gatsbyImageResolver.type = 'GatsbyImageData';

    return gatsbyImageResolver;
  } catch (error) {
    reporter.warn(
      '[gatsby-transformer-cloudinary] Install and configure gatsby-plugin-image to use the new GatsbyImage component and gatsbyImageData resolver'
    );
  }
};
