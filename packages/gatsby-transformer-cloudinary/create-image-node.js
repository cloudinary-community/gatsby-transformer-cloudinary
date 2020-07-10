const { getPluginOptions } = require('./options');

function getDefaultBreakpoints(imageWidth) {
  const {
    breakpointsMaxImages,
    fluidMinWidth,
    fluidMaxWidth,
  } = getPluginOptions();

  const max = Math.min(imageWidth, fluidMaxWidth);
  const min = fluidMinWidth;

  if (max <= min) {
    return [max];
  }

  const breakpoints = [max];
  for (let i = 1; i < breakpointsMaxImages; i++) {
    const breakpoint = max - (i * (max - min)) / (breakpointsMaxImages - 1);
    breakpoints.push(Math.round(breakpoint));
  }
  return breakpoints;
}

exports.createImageNode = ({
  cloudinaryUploadResult: {
    responsive_breakpoints,
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

  let breakpoints = getDefaultBreakpoints(width);
  if (
    responsive_breakpoints &&
    responsive_breakpoints[0] &&
    responsive_breakpoints[0].breakpoints &&
    responsive_breakpoints[0].breakpoints.length > 0
  ) {
    breakpoints = responsive_breakpoints[0].breakpoints.map(
      ({ width }) => width,
    );
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
    id: createNodeId(`CloudinaryAsset-${secure_url}`),
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
