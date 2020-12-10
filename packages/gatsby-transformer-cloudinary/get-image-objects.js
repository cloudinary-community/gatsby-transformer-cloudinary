const { getPluginOptions } = require('./options');
const {
  getAspectRatio,
  getBase64,
  getImageURL,
} = require('./get-image-objects/get-shared-image-data');
const {
  getDisplayDimensions,
} = require('./get-image-objects/get-display-dimensions');
// Define default width values for fluid, fixed and base64 images
const DEFAULT_BASE64_WIDTH = 30;

exports.getFixedImageObject = async ({
  public_id,
  cloudName,
  originalHeight,
  originalWidth,
  version = false,
  height,
  width,
  base64Width = DEFAULT_BASE64_WIDTH,
  base64Transformations = [],
  defaultBase64,
  ignoreDefaultBase64 = false,
  transformations = [],
  chained = [],
}) => {
  const base64 = await getBase64({
    defaultBase64,
    ignoreDefaultBase64,
    public_id,
    version,
    cloudName,
    base64Transformations,
    transformations,
    base64Width,
    chained,
  });

  const src = getImageURL({
    public_id,
    version,
    cloudName,
    transformations,
    chained,
  });

  const aspectRatio = getAspectRatio(
    transformations,
    originalWidth / originalHeight,
  );

  const { displayWidth, displayHeight } = getDisplayDimensions({
    aspectRatio,
    width,
    height,
    originalWidth,
    originalHeight,
  });

  const sizes = [1, 1.5, 2, 3].map(size => ({
    resolution: size,
    width: Math.round(displayWidth * size),
    height: Math.round(displayHeight * size),
  }));

  const srcSet = sizes
    .filter(size => size.width <= originalWidth)
    .map(size => {
      const finalTransformations = [...transformations];
      if (!width && !height) {
        finalTransformations.push(`w_${size.width}`);
      } else if (!!width && !height) {
        finalTransformations.push(`w_${size.width}`);
      } else if (!!height && !width) {
        finalTransformations.push(`h_${size.height}`);
      } else if (!!height && !!width) {
        finalTransformations.push(`w_${size.width}`);
        finalTransformations.push(`h_${size.height}`);
      } else {
        throw Error('This should never happen.');
      }
      // Get URL for each image including user-defined transformations.
      const url = getImageURL({
        // Add the size at the end to override width for srcSet support.
        transformations: finalTransformations,
        chained,
        public_id,
        version,
        cloudName,
      });

      return `${url} ${size.resolution}x`;
    })
    .join();

  return {
    base64,
    height: Math.round(displayHeight),
    src,
    srcSet,
    width: Math.round(displayWidth),
  };
};

exports.getFluidImageObject = async ({
  public_id,
  cloudName,
  originalWidth,
  originalHeight,
  breakpoints = [200, 400, 600],
  version = false,
  maxWidth,
  base64Width = DEFAULT_BASE64_WIDTH,
  base64Transformations = [],
  defaultBase64,
  ignoreDefaultBase64 = false,
  transformations = [],
  chained = [],
}) => {
  const aspectRatio = getAspectRatio(
    transformations,
    originalWidth / originalHeight,
  );
  const { fluidMaxWidth } = getPluginOptions();
  const max = Math.min(maxWidth ? maxWidth : fluidMaxWidth, originalWidth);
  const sizes = `(max-width: ${max}px) 100vw, ${max}px`;
  const base64 = await getBase64({
    defaultBase64,
    ignoreDefaultBase64,
    public_id,
    version,
    cloudName,
    base64Transformations,
    base64Width,
    transformations,
    chained,
  });
  const src = getImageURL({
    public_id,
    version,
    cloudName,
    transformations,
    chained,
  });

  const breakpointWidths = breakpoints
    .concat(max) // make sure we get the max size
    .filter(w => w <= max) // don’t add larger sizes
    .sort((a, b) => a - b) // sort in ascending order
    .filter(onlyUnique); // remove duplicates

  const srcSet = breakpointWidths
    .map(breakpointWidth => {
      // Get URL for each image including user-defined transformations.
      const url = getImageURL({
        // Add the size at the end to override width for srcSet support.
        transformations: transformations.concat(`w_${breakpointWidth}`),
        chained,
        public_id,
        version,
        cloudName,
      });

      return `${url} ${breakpointWidth}w`;
    })
    .join();

  const presentationWidth = max;
  const presentationHeight = Math.round(
    (presentationWidth * originalHeight) / originalWidth,
  );

  return {
    aspectRatio,
    base64,
    presentationWidth,
    presentationHeight,
    sizes,
    src,
    srcSet,
  };
};

function onlyUnique(element, index, array) {
  return array.indexOf(element) === index;
}
