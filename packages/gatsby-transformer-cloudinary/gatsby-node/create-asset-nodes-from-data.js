const { createImageNode } = require('../create-image-node');

exports.createAssetNodesFromData = ({
  node,
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const assetDataKeys = getAssetDataKeys(node);

  assetDataKeys.forEach(assetDataKey => {
    const assetData = { ...node[assetDataKey] };
    delete node[assetDataKey];
    createCloudinaryAssetNode({
      assetData,
      createContentDigest,
      createNode,
      createNodeId,
      parentNode: node,
      relationshipName: assetDataKey,
    });
  });
};

function getAssetDataKeys(node) {
  return Object.keys(node).filter(key => {
    return (
      node[key] &&
      node[key].cloudinaryAssetData === true &&
      node[key].cloudName &&
      node[key].publicId &&
      node[key].originalHeight &&
      node[key].originalWidth
    );
  });
}

function createCloudinaryAssetNode({
  assetData: { cloudName, originalHeight, originalWidth, publicId, version },
  createContentDigest,
  createNode,
  createNodeId,
  parentNode,
  relationshipName,
}) {
  const cloudinaryUploadResult = {
    public_id: publicId,
    height: originalHeight,
    width: originalWidth,
    version,
  };

  const imageNode = createImageNode({
    cloudinaryUploadResult,
    cloudName,
    createContentDigest,
    createNodeId,
    parentNode,
  });

  // Add the new node to Gatsby’s data layer.
  createNode(imageNode, { name: 'gatsby-transformer-cloudinary' });

  // Tell Gatsby to add `${relationshipName}` to the parent node.
  const relationshipKey = `${relationshipName}___NODE`;
  parentNode[relationshipKey] = imageNode.id;
}
