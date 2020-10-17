const flatMap = require('lodash/flatMap');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');
const { createImageNode } = require('../create-image-node');

exports.createAssetNodesFromData = ({
  node,
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  const assetDataPaths = getAssetDataPaths({ node });
  assetDataPaths.forEach(assetDataPath => {
    const assetData = {
      ...get(node, assetDataPath),
    };
    unset(node, assetDataPath);
    const assetDataPathParts = assetDataPath.split('.');
    const relationshipName = assetDataPathParts[assetDataPathParts.length - 1];
    if (verifyAssetData(assetData)) {
      createCloudinaryAssetNode({
        assetData,
        createContentDigest,
        createNode,
        createNodeId,
        parentNode: node,
        relationshipName,
        assetDataPath,
      });
    }
  });
};

function verifyAssetData(assetData) {
  return (
    assetData &&
    assetData.cloudinaryAssetData === true &&
    assetData.cloudName &&
    assetData.publicId &&
    assetData.originalHeight &&
    assetData.originalWidth
  );
}

function getAssetDataKeys(node) {
  return Object.keys(node).filter(key => {
    return node[key] && node[key].cloudinaryAssetData === true;
  });
}

function getAssetDataPaths({ node, basePath = '' }) {
  const currentNode = basePath === '' ? node : get(node, basePath);

  const directAssetDataPaths = Object.keys(currentNode)
    .filter(key => {
      return currentNode[key] && currentNode[key].cloudinaryAssetData === true;
    })
    .map(subPath => {
      return basePath === '' ? subPath : `${basePath}.${subPath}`;
    });

  const objectPaths = Object.keys(currentNode)
    .filter(key => {
      return isObject(currentNode[key]);
    })
    .map(subPath => {
      return basePath === '' ? subPath : `${basePath}.${subPath}`;
    });

  const indirectAssetDataPaths = flatMap(objectPaths, objectPath => {
    return getAssetDataPaths({ node, basePath: objectPath });
  });

  const assetDataPaths = [...directAssetDataPaths, ...indirectAssetDataPaths];
  return assetDataPaths;
}

function isObject(thing) {
  return typeof thing === 'object' && thing != null;
}

function createCloudinaryAssetNode({
  assetData: { cloudName, originalHeight, originalWidth, publicId, version },
  assetDataPath = null,
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
  const relationshipKey = `${assetDataPath || relationshipName}___NODE`;
  set(parentNode, relationshipKey, imageNode.id);
}
