const { setPluginOptions, getPluginOptions } = require('./options');
const {
  createAssetNodesFromData,
  createAssetNodeFromFile,
} = require('./node-creation');
const {
  createGatsbyImageResolvers,
  addFragments,
  createGatsbyImageTypes,
} = require('./gatsby-image');

//import plugin options, used to check for API key before uploading assets to Cloudinary
const pluginOptions = getPluginOptions();

exports.onPreInit = ({ reporter }, pluginOptions) => {
  setPluginOptions({ pluginOptions, reporter });
};

exports.onPreExtractQueries = async (gatsbyUtils) => {
  // Fragments to be used with gatsby-image
  await addFragments(gatsbyUtils);
};

exports.createSchemaCustomization = (gatsbyUtils) => {
  // Types to be used with gatsby-image
  createGatsbyImageTypes(gatsbyUtils);
};

exports.createResolvers = (gatsbyUtils) => {
  // Resolvers to be used with gatsby-image
  createGatsbyImageResolvers(gatsbyUtils);
};

exports.onCreateNode = async ({
  node,
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  // Create nodes from existing cloudinary data
  createAssetNodesFromData({
    node,
    actions,
    createNodeId,
    createContentDigest,
    reporter,
  });

  // Create nodes for files to be uploaded to cloudinary
  if (
    pluginOptions.apiKey &&
    pluginOptions.apiSecret &&
    pluginOptions.cloudName
  ) {
    await createAssetNodeFromFile({
      node,
      actions,
      createNodeId,
      createContentDigest,
      reporter,
    });
  }
};
