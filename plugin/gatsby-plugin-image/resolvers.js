exports.createGatsbyPluginImageResolver = (
  gatsbyUtils,
  transformTypeConfig,
  defaultConfigValues = {}
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
          defaultValue: defaultConfigValues.transformations,
          description: 'Cloudinary transformations to apply to the image',
        },
        chained: '[String]',
        placeholder: {
          type: CloudinaryPlaceholderType,
        },
        logLevel: {
          type: 'String',
        },
        secure: {
          type: 'Boolean',
        },
        cname: {
          type: 'String',
          description:
            'Advanced Cloudinary configuration, see Private CDNs and custom delivery hostnames docs.',
        },
        secureDistribution: {
          type: 'String',
          description:
            'Advanced Cloudinary configuration, see Private CDNs and custom delivery hostnames docs.',
        },
        privateCdn: {
          type: 'Boolean',
          // defaultValue: false,
          description:
            'Advanced Cloudinary configuration, see Private CDNs and custom delivery hostnames docs.',
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
