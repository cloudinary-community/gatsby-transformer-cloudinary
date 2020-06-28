const path = require('path');
const { getPluginOptions } = require('./options');
const { uploadImageToCloudinary } = require('./upload');

exports.createRemoteImageNode = async ({
  url,
  parentNode,
  relationshipName,
  createNode,
  createContentDigest,
  createNodeId,
}) => {
  const { cloudName } = getPluginOptions();
  const publicId = path.parse(url).name;

  const result = await uploadImageToCloudinary({
    url,
    publicId,
  });

  const [{ breakpoints }] = result.responsive_breakpoints;

  const imageNode = {
    // These helper fields are only here so the resolvers have access to them.
    // They will *not* be available via Gatsby’s data layer.
    cloudName: cloudName,
    public_id: result.public_id,
    version: result.version,
    originalHeight: result.height,
    originalWidth: result.width,
    breakpoints: breakpoints.map(({ width }) => width),

    // Add the required internal Gatsby node fields.
    id: createNodeId(`${relationshipName}-${result.secure_url}`),
    parent: parentNode.id,
    internal: {
      type: 'CloudinaryAsset',
      // Gatsby uses the content digest to decide when to reprocess a given
      // node. We can use the Cloudinary URL to avoid doing extra work.
      contentDigest: createContentDigest(result.secure_url),
    },
  };

  // Add the new node to Gatsby’s data layer.
  createNode(imageNode, { name: 'gatsby-transformer-cloudinary' });

  // Tell Gatsby to add `${relationshipName}` to the parent node.
  const relationshipKey = `${relationshipName}___NODE`;
  parentNode[relationshipKey] = imageNode.id;

  return imageNode;
};
