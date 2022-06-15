const { createAssetNodesFromData } = require('./create-asset-nodes-from-data');
const { createAssetNodeFromFile } = require('./create-asset-node-from-file');

const { CloudinaryAssetType } = require('./types');

exports.createCloudinaryAssetType = (gatsbyUtils) => {
  const { actions } = gatsbyUtils;
  actions.createTypes(CloudinaryAssetType);
};

exports.createCloudinaryAssetNodes = async (gatsbyUtils, pluginOptions) => {
  // Create nodes from existing cloudinary data
  createAssetNodesFromData(gatsbyUtils);

  // Create nodes for files to be uploaded to cloudinary
  if (
    pluginOptions.apiKey &&
    pluginOptions.apiSecret &&
    pluginOptions.cloudName
  ) {
    await createAssetNodeFromFile(gatsbyUtils, pluginOptions);
  }
};
