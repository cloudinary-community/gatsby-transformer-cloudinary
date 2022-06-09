const { flatMap, get, set, unset } = require('lodash');

const { createImageNode } = require('./create-image-node');

exports.createAssetNodesFromData = ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  createContentDigest,
}) => {
  const assetDataPaths = getAssetDataPaths({ node });
  assetDataPaths.forEach((assetDataPath) => {
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
        createNodeField,
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
    assetData.publicId
  );
}

function getAssetDataKeys(node) {
  return Object.keys(node).filter((key) => {
    return node[key] && node[key].cloudinaryAssetData === true;
  });
}

function getAssetDataPaths({ node, basePath = '' }) {
  const currentNode = basePath === '' ? node : get(node, basePath);

  const directAssetDataPaths = Object.keys(currentNode)
    .filter((key) => {
      return currentNode[key] && currentNode[key].cloudinaryAssetData === true;
    })
    .map((subPath) => {
      return basePath === '' ? subPath : `${basePath}.${subPath}`;
    });

  const objectPaths = Object.keys(currentNode)
    .filter((key) => {
      return isObject(currentNode[key]);
    })
    .map((subPath) => {
      return basePath === '' ? subPath : `${basePath}.${subPath}`;
    });

  const indirectAssetDataPaths = flatMap(objectPaths, (objectPath) => {
    return getAssetDataPaths({ node, basePath: objectPath });
  });

  const assetDataPaths = [...directAssetDataPaths, ...indirectAssetDataPaths];
  return assetDataPaths;
}

function isObject(thing) {
  return typeof thing === 'object' && thing != null;
}

function createCloudinaryAssetNode({
  assetData: {
    cloudName,
    defaultBase64,
    defaultTracedSVG,
    originalHeight,
    originalWidth,
    originalFormat,
    publicId,
    version,
  },
  assetDataPath = null,
  createContentDigest,
  createNode,
  createNodeField,
  createNodeId,
  parentNode,
  relationshipName,
}) {
  const cloudinaryUploadResult = {
    public_id: publicId,
    height: originalHeight,
    width: originalWidth,
    format: originalFormat,
    version,
  };

  const imageNode = createImageNode({
    cloudinaryUploadResult,
    cloudName,
    createContentDigest,
    createNodeId,
    parentNode,
    defaultBase64,
    defaultTracedSVG,
  });

  // Add the new node to Gatsby’s data layer.
  createNode(imageNode, { name: 'gatsby-transformer-cloudinary' });

  //Use createNodeField to store the id of the CloudinaryAsset node the Gatsby-v4-Way
  let relationshipKey = `${assetDataPath || relationshipName}`;

  createNodeField({
    node: parentNode,
    name: relationshipKey,
    value: imageNode.id,
  });

  // Add relationship by mutating, does not work in Gatsby-v4
  relationshipKey = `${assetDataPath || relationshipName}___NODE`;
  set(parentNode, relationshipKey, imageNode.id);
}
