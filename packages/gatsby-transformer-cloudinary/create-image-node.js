const { getPluginOptions } = require('./options');

exports.createImageNode = ({
  cloudinaryUploadResult: {
    responsive_breakpoints = [{ breakpoints: [] }],
    public_id,
    version,
    height,
    width,
    secure_url,
  },
  parentNode,
  createContentDigest,
  createNode,
  createNodeId,
  createParentChildLink,
  relationshipName = 'CloudinaryAsset',
}) => {
  const [{ breakpoints }] = responsive_breakpoints;
  const { cloudName } = getPluginOptions();

  const imageNode = {
    // These helper fields are only here so the resolvers have access to them.
    // They will *not* be available via Gatsby’s data layer.
    cloudName: cloudName,
    public_id: public_id,
    version: version,
    originalHeight: height,
    originalWidth: width,
    breakpoints: breakpoints.map(({ width }) => width),

    // Add the required internal Gatsby node fields.
    id: createNodeId(`${relationshipName}-${secure_url}`),
    parent: parentNode.id,
    internal: {
      type: 'CloudinaryAsset',
      // Gatsby uses the content digest to decide when to reprocess a given
      // node. We can use the Cloudinary URL to avoid doing extra work.
      contentDigest: createContentDigest(secure_url),
    },
  };

  // If no relationshipName is given, that means we're automatically
  // creating a CloudinaryAsset node from a File node created by
  // `gatsby-source-filesystem`. If a relationshipName is given, that means
  // we're creating a CloudinaryAsset node from a provided URL.
  if (relationshipName == 'CloudinaryAsset') {
    // Add the new node to Gatsby’s data layer.
    createNode(imageNode);

    // Tell Gatsby to add `childCloudinaryAsset` to the parent `File` node.
    createParentChildLink({
      parent: parentNode,
      child: imageNode,
    });
  } else {
    // Add the new node to Gatsby’s data layer.
    createNode(imageNode, { name: 'gatsby-transformer-cloudinary' });

    // Tell Gatsby to add `${relationshipName}` to the parent node.
    const relationshipKey = `${relationshipName}___NODE`;
    parentNode[relationshipKey] = imageNode.id;
  }

  return imageNode;
};
