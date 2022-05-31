const {
  getFixedImageObject,
  getFluidImageObject,
} = require('./get-image-objects');

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
