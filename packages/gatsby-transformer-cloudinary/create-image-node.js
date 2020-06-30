const { getPluginOptions } = require('./options');

function getDefaultBreakpoints({ width }) {
  const { fluidMinWidth, fluidMaxWidth } = getPluginOptions();

  const max = Math.min(width, fluidMaxWidth);
  const min = fluidMinWidth;

  return [min, Math.round((min + max) / 2)];
}

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
  createNodeId,
}) => {
  const { cloudName } = getPluginOptions();

  let breakpoints = getDefaultBreakpoints({ width });
  if (responsive_breakpoints) {
    breakpoints = responsive_breakpoints
      .shift()
      .breakpoints.map(({ width }) => width);
  }

  const imageNode = {
    // These helper fields are only here so the resolvers have access to them.
    // They will *not* be available via Gatsby’s data layer.
    cloudName: cloudName,
    public_id: public_id,
    version: version,
    originalHeight: height,
    originalWidth: width,
    breakpoints,

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

  return imageNode;
};
