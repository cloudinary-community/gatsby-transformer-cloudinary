const fs = require('fs-extra');
const { setPluginOptions, getPluginOptions } = require('./options');
const {
  createAssetNodesFromData,
  createAssetNodeFromFile,
} = require('./node-creation');
const { createGatsbyImageResolvers } = require('./gatsby-image');

//import plugin options, used to check for API key before uploading assets to Cloudinary
const pluginOptions = getPluginOptions();

exports.onPreExtractQueries = async ({ store, getNodesByType }) => {
  const program = store.getState().program;

  // Check if there are any ImageSharp nodes. If so add fragments for ImageSharp.
  // The fragment will cause an error if there are no ImageSharp nodes.
  if (getNodesByType(`CloudinaryAsset`).length == 0) {
    return;
  }

  // We have CloudinaryAsset nodes so let’s add our fragments to .cache/fragments.
  await fs.copy(
    require.resolve(`./fragments.js`),
    `${program.directory}/.cache/fragments/cloudinary-asset-fragments.js`
  );
};

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type CloudinaryAsset implements Node @dontInfer {
      fixed(
        base64Width: Int
        base64Transformations: [String!]
        chained: [String!]
        height: Int
        transformations: [String!]
        width: Int
        ignoreDefaultBase64: Boolean
      ): CloudinaryAssetFixed!

      fluid(
        base64Width: Int
        base64Transformations: [String!]
        chained: [String!]
        maxWidth: Int
        transformations: [String!]
        ignoreDefaultBase64: Boolean
      ): CloudinaryAssetFluid!
    }

    type CloudinaryAssetFixed {
      aspectRatio: Float
      base64: String
      height: Float
      src: String
      srcSet: String
      tracedSVG: String
      width: Float
    }

    type CloudinaryAssetFluid {
      aspectRatio: Float!
      base64: String
      presentationHeight: Float
      presentationWidth: Float
      sizes: String!
      src: String!
      srcSet: String!
      tracedSVG: String
    }
  `);
};

exports.createResolvers = (gatsbyUtils) => {
  // To be used with gatsby-image
  createGatsbyImageResolvers(gatsbyUtils);
};

exports.onCreateNode = async ({
  node,
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  // Create nodes from existing data with CloudinaryAssetData node type
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

exports.onPreInit = ({ reporter }, pluginOptions) => {
  setPluginOptions({ pluginOptions, reporter });
};
