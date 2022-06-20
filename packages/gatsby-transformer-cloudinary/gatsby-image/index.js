const fs = require('fs-extra');
const {
  CloudinaryAssetFluidType,
  CloudinaryAssetFixedType,
} = require('./types');
const { createFixedResolver, createFluidResolver } = require('./resolvers');

exports.addGatsbyImageFragments = async ({ store, getNodesByType }) => {
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

exports.createGatsbyImageTypes = (gatsbyUtils) => {
  const { actions } = gatsbyUtils;

  actions.createTypes([CloudinaryAssetFluidType, CloudinaryAssetFixedType]);
};

exports.createGatsbyImageResolvers = (gatsbyUtils, pluginOptions) => {
  const { createResolvers } = gatsbyUtils;
  const { transformTypes } = pluginOptions;
  const resolvers = {};

  transformTypes.forEach((type) => {
    // Add fixed and fluid resolvers
    // to all types that should be transformed
    resolvers[type] = {
      fixed: createFixedResolver(gatsbyUtils, pluginOptions),
      fluid: createFluidResolver(gatsbyUtils, pluginOptions),
    };
  });

  createResolvers(resolvers);
};
