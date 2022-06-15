const fs = require('fs-extra');

const {
  getFixedImageObject,
  getFluidImageObject,
} = require('./get-image-objects');
const { gatsbyImageTypes } = require('./types');

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

exports.createGatsbyImageTypes = ({ actions }) => {
  actions.createTypes(gatsbyImageTypes);
};

exports.createGatsbyImageResolvers = ({ createResolvers, reporter }) => {
  const resolvers = {
    CloudinaryAsset: {
      fixed: {
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
      },
      fluid: {
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
            fieldsToSelect,
            reporter,
          });
        },
      },
    },
  };

  createResolvers(resolvers);
};
