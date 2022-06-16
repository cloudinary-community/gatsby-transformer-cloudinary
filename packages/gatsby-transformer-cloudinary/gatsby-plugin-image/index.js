exports.createGatsbyImageDataResolver = (gatsbyUtils) => {
  const { createResolvers, reporter } = gatsbyUtils;
  try {
    const {
      getGatsbyImageResolver,
    } = require('gatsby-plugin-image/graphql-utils');
    const { resolveCloudinaryAssetData } = require('./resolve-asset');
    const { CloudinaryPlaceholderType } = require('./types');

    createResolvers({
      CloudinaryAsset: {
        // loadImageData is your custom resolver, defined in step 2
        gatsbyImageData: getGatsbyImageResolver(resolveCloudinaryAssetData, {
          gravity: 'String',
          x: 'Float',
          y: 'Float',
          zoom: 'Float',
          crop: 'String',
          quality: {
            type: 'String',
            defaultValue: 'auto',
          },
          transformations: '[String]',
          chained: '[String]',
          placeholder: {
            type: CloudinaryPlaceholderType,
          },
        }),
      },
    });
  } catch (error) {
    reporter.warn(
      '[gatsby-transformer-cloudinary] Install and configure gatsby-plugin-image to use the new GatsbyImage component and gatsbyImageData resolver'
    );
  }
};
