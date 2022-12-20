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

const generateCloudinaryAssetSource = (
  filename,
  width,
  height,
  format,
  _fit,
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

exports._generateCloudinaryAssetSource = generateCloudinaryAssetSource;

exports.createResolveCloudinaryAssetData =
  (gatsbyUtils) => async (source, args, _context, info) => {
    const { reporter } = gatsbyUtils;
    const transformType = info.parentType || 'UnknownTransformType';

    const hasRequiredData = source.cloudName && source.publicId;

    if (!hasRequiredData) {
      reporter.error(
        `[gatsby-transformer-cloudinary] Missing required fields on ${transformType}: cloudName=${source.cloudName}, publicId=${source.cloudName}`
      );
      return null;
    }

    let metadata = {
      width: source.originalWidth,
      height: source.originalHeight,
      format: source.originalFormat,
    };

    const hasSizingMetadata = metadata.width && metadata.height;
    const hasSizingAndFormatMetadata = hasSizingMetadata && metadata.format;

    if (!hasSizingAndFormatMetadata) {
      // Lacking metadata, so lets request it from Cloudinary
      try {
        metadata = await getAssetMetadata({ source, args });
        reporter.verbose(
          `[gatsby-transformer-cloudinary] Missing metadata fields on ${transformType} for ${source.cloudName} > ${source.publicId}
          >>> To save on network requests add originalWidth, originalHeight and originalFormat to ${transformType}`
        );
      } catch (error) {
        reporter.error(
          `[gatsby-transformer-cloudinary] Could not get metadata for ${transformType} for ${source.cloudName} > ${source.publicId}: ${error.message}`
        );
        return null;
      }
    }

    const assetDataArgs = {
      ...args,
      filename: source.cloudName + '>>>' + source.publicId,
      // Passing the plugin name allows for better error messages
      pluginName: `gatsby-transformer-cloudinary`,
      sourceMetadata: metadata,
      generateImageSource: generateCloudinaryAssetSource,
      options: args,
    };

    try {
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
    } catch (error) {
      reporter.error(
        `[gatsby-transformer-cloudinary] Could not generate placeholder (${args.placeholder}) for ${source.cloudName} > ${source.publicId}: ${error.message}`
      );
    }

    return generateImageData(assetDataArgs);
  };
