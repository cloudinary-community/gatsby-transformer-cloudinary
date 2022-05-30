const fs = require('fs-extra');
const {
  getFixedImageObject,
  getFluidImageObject,
} = require('./get-image-objects');
const { uploadImageNodeToCloudinary } = require('./upload');
const { setPluginOptions } = require('./options');
const { createImageNode } = require('./create-image-node');
const {
  createAssetNodesFromData,
} = require('./gatsby-node/create-asset-nodes-from-data');

//import plugin options, used to check for API key before uploading assets to Cloudinary
const { getPluginOptions } = require('./options');
const pluginOptions = getPluginOptions();

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

exports.createResolvers = ({ createResolvers, reporter }) => {
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

async function createAssetNodeFromFile({
  node,
  actions: { createNode, createParentChildLink },
  createNodeId,
  createContentDigest,
  reporter,
}) {
  if (!ALLOWED_MEDIA_TYPES.includes(node.internal.mediaType)) {
    return;
  }

  const cloudinaryUploadResult = await uploadImageNodeToCloudinary({
    node,
    reporter,
  });

  const imageNode = createImageNode({
    cloudinaryUploadResult,
    parentNode: node,
    createContentDigest,
    createNode,
    createNodeId,
  });

  // Add the new node to Gatsby’s data layer.
  createNode(imageNode);

  // Tell Gatsby to add `childCloudinaryAsset` to the parent `File` node.
  createParentChildLink({
    parent: node,
    child: imageNode,
  });

  return imageNode;
}

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
