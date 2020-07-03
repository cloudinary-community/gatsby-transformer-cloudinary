const path = require('path');
const { uploadImageToCloudinary } = require('./upload');
const { createImageNode } = require('./create-image-node');
const { getPluginOptions } = require('./options');

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
  if (!url) {
    throw Error(
      "`url` is a required argument. Pass the URL where the image is currently hosted so it can be downloaded by Cloudinary.",
    );
  }
  if (!parentNode) {
    throw Error(
      "`parentNode` is a required argument. This parameter is used to link a newly created node representing the image to a parent node in Gatsby's GraphQL layer.",
    );
  }
  if (!relationshipName) {
    throw Error(
      "`relationshipName` is a required argument. This parameter sets the name of the relationship between the parent node and the newly created node for this image in Gatsby's GraphQL layer.",
    );
  }
  if (!createContentDigest) {
    throw Error(
      "`createContentDigest` is a required argument. It's available at `CreateNodeArgs.createContentDigest`.",
    );
  }
  if (!createNode) {
    throw Error(
      "`createNode` is a required argument. It's available at `CreateNodeArgs.actions.createNode`.",
    );
  }
  if (!createNodeId) {
    throw Error(
      "`createNodeId` is a required argument. It's available at `CreateNodeArgs.createNodeId`.",
    );
  }
  if (!reporter) {
    throw Error(
      "`reporter` is a required argument. It's available at `CreateNodeArgs.reporter`.",
    );
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
