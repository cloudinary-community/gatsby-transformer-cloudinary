const { getGatsbyImageResolver } = require('gatsby-plugin-image/graphql-utils');
const { resolveCloudinaryAssetData } = require('./cloudinary-image-utils');
const { CloudinaryPlaceholderType } = require('./types');

exports.createGatsbyImageDataResolver = ({ createResolvers }) => {
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
};
