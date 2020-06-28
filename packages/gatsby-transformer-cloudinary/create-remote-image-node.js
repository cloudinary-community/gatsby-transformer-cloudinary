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

  // console.log('relationshipName', relationshipName);
  // console.log('url', url);
  // console.log('publicId', publicId);

  const result = await uploadImageToCloudinary({
    url,
    publicId,
  });
  // console.log('result', result);

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
  // console.log('imageNode', imageNode);

  // Add the new node to Gatsby’s data layer.
  createNode(imageNode, { name: 'gatsby-transformer-cloudinary' });

  // Tell Gatsby to add `childCloudinaryAsset` to the parent `File` node.
  const relationshipKey = `${relationshipName}___NODE`;
  parentNode[relationshipKey] = imageNode.id;
  // console.log('parentNode', parentNode);
};
