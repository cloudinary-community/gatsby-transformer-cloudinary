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

exports.createAssetNodesFromData = async ({
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
      cloudName: assetData.cloudName,
      createContentDigest,
      createNode,
      createNodeId,
      originalHeight: assetData.originalHeight,
      originalWidth: assetData.originalWidth,
      parentNode: node,
      publicId: assetData.publicId,
      relationshipName: assetDataKey,
      version: assetData.version,
    });
  });
};
