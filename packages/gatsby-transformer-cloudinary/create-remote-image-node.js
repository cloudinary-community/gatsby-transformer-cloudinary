const path = require('path');
const { uploadImageToCloudinary } = require('./upload');
const { createImageNode } = require('./create-image-node');

let totalImages = 0;
let uploadedImages = 0;

exports.createRemoteImageNode = async ({
  url,
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

  const publicId = path.parse(url).name;

  totalImages++;

  const cloudinaryUploadResult = await uploadImageToCloudinary({
    url,
    publicId,
  });

  uploadedImages++;

  reporter.info(
    `Uploaded ${uploadedImages} of ${totalImages} images to Cloudinary.`,
  );

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
