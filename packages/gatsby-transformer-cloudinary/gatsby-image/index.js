const fs = require('fs-extra');

const {
  getFixedImageObject,
  getFluidImageObject,
} = require('./get-image-objects');

exports.addFragments = async ({ store, getNodesByType }) => {
  const program = store.getState().program;

  // Check if there are any CloudinaryAsset nodes. If so add fragments for CloudinaryAsset.
  // The fragment will cause an error if there are no CloudinaryAsset nodes.
  if (getNodesByType(`CloudinaryAsset`).length == 0) {
    return;
  }

  // We have CloudinaryAsset nodes so let’s add our fragments to .cache/fragments.
  await fs.copy(
    require.resolve(`./fragments.js`),
    `${program.directory}/.cache/fragments/cloudinary-asset-fragments.js`
  );
};

exports.createGatsbyImageResolvers = ({ createResolvers, reporter }) => {
  const resolvers = {
    CloudinaryAsset: {
      fixed: {
        type: 'CloudinaryAssetFixed!',
        resolve: (
          {
            public_id,
            version,
            cloudName,
            originalHeight,
            originalWidth,
            defaultBase64,
            defaultTracedSVG,
          },
          {
            base64Width,
            base64Transformations,
            ignoreDefaultBase64,
            height,
            width,
            transformations,
            chained,
          },
          _context,
          info
        ) => {
          const fieldsToSelect = info.fieldNodes[0].selectionSet.selections.map(
            (item) => item.name.value
          );
          return getFixedImageObject({
            base64Transformations,
            base64Width,
            chained,
            cloudName,
            defaultBase64,
            fieldsToSelect,
            defaultTracedSVG,
            height,
            ignoreDefaultBase64,
            originalHeight,
            originalWidth,
            public_id,
            reporter,
            transformations,
            version,
            width,
          });
        },
      },
      fluid: {
        type: 'CloudinaryAssetFluid!',
        resolve: (
          {
            breakpoints,
            cloudName,
            defaultBase64,
            defaultTracedSVG,
            originalHeight,
            originalWidth,
            public_id,
            version,
          },
          {
            base64Transformations,
            base64Width,
            chained,
            ignoreDefaultBase64,
            maxWidth,
            transformations,
          },
          _context,
          info
        ) => {
          const fieldsToSelect = info.fieldNodes[0].selectionSet.selections.map(
            (item) => item.name.value
          );
          return getFluidImageObject({
            base64Transformations,
            base64Width,
            breakpoints,
            chained,
            cloudName,
            defaultBase64,
            fieldsToSelect,
            defaultTracedSVG,
            ignoreDefaultBase64,
            maxWidth,
            originalHeight,
            originalWidth,
            public_id,
            reporter,
            transformations,
            version,
          });
        },
      },
    },
  };

  createResolvers(resolvers);
};
