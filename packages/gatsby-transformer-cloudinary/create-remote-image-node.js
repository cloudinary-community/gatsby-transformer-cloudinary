const path = require('path');
const { uploadImageToCloudinary } = require('./upload');
const { createImageNode } = require('./create-image-node');

exports.createRemoteImageNode = async ({
  url,
  overwriteExisting,
  parentNode,
  relationshipName,
  createContentDigest,
  createNode,
  createNodeId,
  reporter,
}) => {
  if (!relationshipName) {
    throw Error("'relationshipName' is a required argument.");
  }

  const overwrite =
    overwriteExisting == null
      ? getPluginOptions().overwriteExisting
      : overwriteExisting;

  const publicId = path.parse(url).name;

  const cloudinaryUploadResult = await uploadImageToCloudinary({
    url,
    publicId,
    overwrite,
    reporter,
  });

  const imageNode = createImageNode({
    relationshipName,
    cloudinaryUploadResult,
    parentNode,
    createContentDigest,
    createNode,
    createNodeId,
  });

  // Add the new node to Gatsby’s data layer.
  createNode(imageNode, { name: 'gatsby-transformer-cloudinary' });

  // Tell Gatsby to add `${relationshipName}` to the parent node.
  const relationshipKey = `${relationshipName}___NODE`;
  parentNode[relationshipKey] = imageNode.id;
  return imageNode;
};
