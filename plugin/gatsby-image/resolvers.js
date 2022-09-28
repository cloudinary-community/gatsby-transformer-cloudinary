const {
  getFixedImageObject,
  getFluidImageObject,
} = require('./get-image-objects');
const { getBreakpoints } = require('./get-shared-image-data');

exports.createFixedResolver = (gatsbyUtils) => {
  const { reporter } = gatsbyUtils;
  return {
    type: 'CloudinaryAssetFixed!',
    args: {
      base64Width: 'Int',
      base64Transformations: '[String!]',
      chained: '[String!]',
      height: 'Int',
      transformations: '[String!]',
      width: 'Int',
      ignoreDefaultBase64: 'Boolean',
    },
    resolve: (source, args, _context, info) => {
      const fieldsToSelect = info.fieldNodes[0].selectionSet.selections.map(
        (item) => item.name.value
      );
      return getFixedImageObject({
        ...source,
        ...args,
        public_id: source.publicId,
        fieldsToSelect,
        reporter,
      });
    },
  };
};

exports.createFluidResolver = (gatsbyUtils, pluginOptions) => {
  const { reporter } = gatsbyUtils;
  return {
    type: 'CloudinaryAssetFluid!',
    args: {
      base64Width: 'Int',
      base64Transformations: '[String!]',
      chained: '[String!]',
      maxWidth: 'Int',
      transformations: '[String!]',
      ignoreDefaultBase64: 'Boolean',
    },
    resolve: (source, args, _context, info) => {
      const fieldsToSelect = info.fieldNodes[0].selectionSet.selections.map(
        (item) => item.name.value
      );
      return getFluidImageObject({
        ...source,
        ...args,
        public_id: source.publicId,
        breakpoints: getBreakpoints(source, pluginOptions),
        fieldsToSelect,
        reporter,
      });
    },
  };
};
