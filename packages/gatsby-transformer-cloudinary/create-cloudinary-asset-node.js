const { createImageNode } = require('./create-image-node');

exports.createCloudinaryAssetNode = ({
  cloudName,
  createContentDigest,
  createNode,
  createNodeId,
  originalHeight,
  originalWidth,
  parentNode,
  publicId,
  relationshipName,
  version,
}) => {
  if (!cloudName) {
    throw Error(
      '`cloudName` is a required argument. Pass the name of the Cloudinary cloud where the image is stored.',
    );
  }
  if (!createContentDigest) {
    throw Error('`createContentDigest` is a required argument.');
  }
  if (!createNode) {
    throw Error('`createNode` is a required argument.');
  }
  if (!createNodeId) {
    throw Error('`createNodeId` is a required argument.');
  }
  if (!originalHeight) {
    throw Error(
      '`originalHeight` is a required argument. Pass the original height of the image stored on Cloudinary.',
    );
  }
  if (!originalWidth) {
    throw Error(
      '`originalWidth` is a required argument. Pass the original width of the image stored on Cloudinary.',
    );
  }
  if (!parentNode) {
    throw Error(
      '`parentNode` is a required argument. Pass the parent node that this Cloudinary image should be a child of.',
    );
  }
  if (!publicId) {
    throw Error(
      '`publicId` is a required argument. Pass the Cloudinary public_id under which the image is stored.',
    );
  }
  if (!relationshipName) {
    throw Error(
      '`relationshipName` is a required argument. Pass a name for how this image is related to its parent (e.g. "coverPhoto").',
    );
  }

  const cloudinaryUploadResult = {
    public_id: publicId,
    height: originalHeight,
    width: originalWidth,
    version,
  };

  const imageNode = createImageNode({
    cloudinaryUploadResult,
    parentNode,
    createContentDigest,
    createNodeId,
    cloudName,
  });

  // Add the new node to Gatsby’s data layer.
  createNode(imageNode, { name: 'gatsby-transformer-cloudinary' });

  // Tell Gatsby to add `${relationshipName}` to the parent node.
  const relationshipKey = `${relationshipName}___NODE`;
  parentNode[relationshipKey] = imageNode.id;
  return imageNode;
};
