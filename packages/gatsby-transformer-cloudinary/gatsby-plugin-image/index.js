const {
  getGatsbyImageResolver,
  ImagePlaceholderType,
} = require('gatsby-plugin-image/graphql-utils');
const { resolveCloudinaryAssetData } = require('./cloudinary-image-utils');

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
          type: ImagePlaceholderType.name,
        },
      }),
    },
  });
};
