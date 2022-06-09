const path = require('path');
const { uploadImageToCloudinary } = require('./upload');
const { createImageNode } = require('./create-image-node');
const { getPluginOptions } = require('../options');

exports.createRemoteImageNode = async ({
  url,
  overwriteExisting,
  parentNode,
  relationshipName,
  createContentDigest,
  createNode,
  createNodeField,
  createNodeId,
  reporter,
}) => {
  if (!reporter) {
    throw Error(
      "`reporter` is a required argument. It's available at `CreateNodeArgs.reporter`."
    );
  }
  if (!url) {
    reporter.panic(
      '`url` is a required argument. Pass the URL where the image is currently hosted so it can be downloaded by Cloudinary.'
    );
  }
  if (!parentNode) {
    reporter.panic(
      "`parentNode` is a required argument. This parameter is used to link a newly created node representing the image to a parent node in Gatsby's GraphQL layer."
    );
  }
  if (!relationshipName) {
    reporter.panic(
      "`relationshipName` is a required argument. This parameter sets the name of the relationship between the parent node and the newly created node for this image in Gatsby's GraphQL layer."
    );
  }
  if (!createContentDigest) {
    reporter.panic(
      "`createContentDigest` is a required argument. It's available at `CreateNodeArgs.createContentDigest`."
    );
  }
  if (!createNode) {
    reporter.panic(
      "`createNode` is a required argument. It's available at `CreateNodeArgs.actions.createNode`."
    );
  }
  if (!createNodeId) {
    reporter.panic(
      "`createNodeId` is a required argument. It's available at `CreateNodeArgs.createNodeId`."
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
    cloudinaryUploadResult,
    parentNode,
    createContentDigest,
    createNodeId,
  });

  // Add the new node to Gatsby’s data layer.
  createNode(imageNode, { name: 'gatsby-transformer-cloudinary' });

  //Use createNodeField to store the id of the CloudinaryAsset node the Gatsby-v4-Way
  let relationshipKey = `${relationshipName}`;

  createNodeField({
    node: parentNode,
    name: relationshipKey,
    value: imageNode.id,
  });

  // Add relationship by mutating, does not work in Gatsby-v4
  relationshipKey = `${relationshipName}___NODE`;
  parentNode[relationshipKey] = imageNode.id;
  return imageNode;
};
