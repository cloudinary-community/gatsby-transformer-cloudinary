const fs = require('fs-extra');
const {
  getFixedImageObject,
  getFluidImageObject,
} = require('./get-image-objects');
const { setPluginOptions } = require('./options');
const { createAssetNodeFromFile } = require('./gatsby-node/create-asset-node-from-file');

const ALLOWED_MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

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
    `${program.directory}/.cache/fragments/cloudinary-asset-fragments.js`,
  );
};

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type CloudinaryAsset implements Node @dontInfer {
      fixed(
        base64Width: Int
        base64Transformations: [String!]
        chained: [String!]
        transformations: [String!]
        width: Int
      ): CloudinaryAssetFixed!

      fluid(
        base64Width: Int
        base64Transformations: [String!]
        chained: [String!]
        maxWidth: Int
        transformations: [String!]
      ): CloudinaryAssetFluid!
    }

    type CloudinaryAssetFixed {
      aspectRatio: Float
      base64: String!
      height: Float
      src: String
      srcSet: String
      width: Float
    }

    type CloudinaryAssetFluid {
      aspectRatio: Float!
      base64: String!
      presentationHeight: Float
      presentationWidth: Float
      sizes: String!
      src: String!
      srcSet: String!
    }
  `);
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    CloudinaryAsset: {
      fixed: {
        type: 'CloudinaryAssetFixed!',
        resolve: (
          { public_id, version, cloudName, originalHeight, originalWidth },
          {
            base64Width,
            base64Transformations,
            width,
            transformations,
            chained,
          },
        ) =>
          getFixedImageObject({
            public_id,
            version,
            cloudName,
            originalHeight,
            originalWidth,
            width,
            base64Width,
            base64Transformations,
            transformations,
            chained,
          }),
      },
      fluid: {
        type: 'CloudinaryAssetFluid!',
        resolve: (
          {
            public_id,
            version,
            cloudName,
            originalHeight,
            originalWidth,
            breakpoints,
          },
          {
            base64Width,
            base64Transformations,
            maxWidth,
            transformations,
            chained,
          },
        ) =>
          getFluidImageObject({
            public_id,
            version,
            cloudName,
            maxWidth,
            breakpoints,
            originalHeight,
            originalWidth,
            base64Width,
            base64Transformations,
            transformations,
            chained,
          }),
      },
    },
  };

  createResolvers(resolvers);
};

exports.onCreateNode = async ({
  node,
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  createAssetNodesFromData({
    node,
    actions,
    createNodeId,
    createContentDigest,
    reporter,
  });
  await createAssetNodeFromFile({
    node,
    actions,
    createNodeId,
    createContentDigest,
    reporter,
  });
};

exports.onPreInit = ({ reporter }, pluginOptions) => {
  setPluginOptions({ pluginOptions, reporter });
};
