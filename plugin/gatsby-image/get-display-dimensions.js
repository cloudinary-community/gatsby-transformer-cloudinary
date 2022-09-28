const DEFAULT_FIXED_WIDTH = 400;

exports.getDisplayDimensions = ({
  aspectRatio,
  width,
  height,
  originalWidth,
  originalHeight,
}) => {
  let displayWidth;
  let displayHeight;
  if (!width && !height) {
    displayWidth = Math.min(DEFAULT_FIXED_WIDTH, originalWidth);
  }
  if (!!width) {
    displayWidth = Math.min(width, originalWidth);
  }
  if (!!height) {
    displayHeight = Math.min(height, originalHeight);
  }
  if (!displayWidth) {
    displayWidth = displayHeight * aspectRatio;
  }
  if (!displayHeight) {
    displayHeight = displayWidth / aspectRatio;
  }

  // displayWidth = Math.round(displayWidth);
  // displayHeight = Math.round(displayHeight);

  return { displayWidth, displayHeight };
};
