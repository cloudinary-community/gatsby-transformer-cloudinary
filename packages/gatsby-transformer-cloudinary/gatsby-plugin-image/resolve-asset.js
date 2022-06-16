const {
  getLowResolutionImageURL,
  generateImageData,
} = require('gatsby-plugin-image');

const { generateCloudinaryAssetUrl } = require('./generate-asset-url');
const {
  getAssetAsTracedSvg,
  getUrlAsBase64Image,
  getAssetMetadata,
} = require('./asset-data');

exports._generateCloudinaryAssetSource = (
  filename,
  width,
  height,
  format,
  fit,
  options
) => {
  const [cloudName, publicId] = filename.split('>>>');
  const cloudinarySrcUrl = generateCloudinaryAssetUrl({
    cloudName: cloudName,
    publicId: publicId,
    width,
    height,
    format,
    options,
  });

  const imageSource = {
    src: cloudinarySrcUrl,
    width: width,
    height: height,
    format: format,
  };

  return imageSource;
};

exports.resolveCloudinaryAssetData = async (source, args) => {
  let metadata = {
    width: source.originalWidth,
    height: source.originalHeight,
    format: source.originalFormat,
  };

  const hasSizingMetadata = metadata.width && metadata.height;
  const hasSizingAndFormatMetadata = hasSizingMetadata && metadata.format;

  if (!hasSizingAndFormatMetadata) {
    // Lacking metadata, so lets request and override it from Cloudinary
    metadata = await getAssetMetadata({ source, args });
  }

  const assetDataArgs = {
    ...args,
    filename: source.cloudName + '>>>' + source.publicId,
    // Passing the plugin name allows for better error messages
    pluginName: `gatsby-transformer-cloudinary`,
    sourceMetadata: metadata,
    generateImageSource: this._generateCloudinaryAssetSource,
    options: args,
  };

  // Generating placeholders is optional, but recommended
  if (args.placeholder === 'blurred') {
    if (source.defaultBase64) {
      assetDataArgs.placeholderURL = source.defaultBase64;
    } else {
      const lowResolutionUrl = getLowResolutionImageURL(assetDataArgs);
      const base64 = await getUrlAsBase64Image(lowResolutionUrl);
      assetDataArgs.placeholderURL = base64;
    }
  } else if (args.placeholder === 'tracedSVG') {
    if (source.defaultTracedSVG) {
      assetDataArgs.placeholderURL = source.defaultTracedSVG;
    } else {
      const tracedSvg = await getAssetAsTracedSvg({ source, args });
      assetDataArgs.placeholderURL = tracedSvg;
    }
  }

  return generateImageData(assetDataArgs);
};
