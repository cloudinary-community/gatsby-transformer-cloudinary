exports.createGatsbyImageDataResolver = (gatsbyUtils, pluginOptions) => {
  const { createResolvers, reporter } = gatsbyUtils;
  try {
    const {
      getGatsbyImageResolver,
    } = require('gatsby-plugin-image/graphql-utils');
    const { createResolveCloudinaryAssetData } = require('./resolve-asset');
    const { CloudinaryPlaceholderType } = require('./types');

    createResolvers({
      CloudinaryAsset: {
        gatsbyImageData: getGatsbyImageResolver(
          createResolveCloudinaryAssetData(gatsbyUtils),
          {
            transformations: {
              type: '[String]',
              defaultValue: pluginOptions.defaultTransformations,
            },
            chained: '[String]',
            placeholder: {
              type: CloudinaryPlaceholderType,
            },
          }
        ),
      },
    });
  } catch (error) {
    reporter.warn(
      '[gatsby-transformer-cloudinary] Install and configure gatsby-plugin-image to use the new GatsbyImage component and gatsbyImageData resolver'
    );
  }
};
