exports.createGatsbyPluginImageResolver = (
  gatsbyUtils,
  transformTypeConfig,
  defaultValues = {}
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
          defaultValue: defaultValues.transformations,
        },
        chained: '[String]',
        placeholder: {
          type: CloudinaryPlaceholderType,
        },
        secure: {
          type: 'Boolean',
          defaultValue: defaultValues.secure,
        },
        logLevel: {
          type: 'String',
        },
      }
    );

    // Make the resolver nullable
    gatsbyImageResolver.type = 'GatsbyImageData';

    return gatsbyImageResolver;
  } catch (error) {
    reporter.warn(
      '[gatsby-transformer-cloudinary] Install and configure gatsby-plugin-image to use the new GatsbyImage component and gatsbyImageData resolver'
    );
  }
};
