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
const { Joi } = require('gatsby-plugin-utils/joi');

const { resolverReporter } = require('./resolver-reporter');

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

const generateMetadata = async (cldAsset, args, transformType, reporter) => {
  const schema = Joi.object({
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    format: Joi.string().default('auto'),
  }).required();

  const { value, error } = schema.validate(cldAsset);

  if (!error) {
    // Original metadata is valid,
    // use validated value
    return value;
  }

  try {
    // Lacking metadata, so let's fetch it
    reporter.verbose(
      `[gatsby-transformer-cloudinary] Missing metadata fields on ${transformType}: cloudName=${cldAsset.cloudName}, publicId=${cldAsset.publicId} >>> To save on network requests add width, height and format to ${transformType}`
    );

    const fetchedMetadata = await getAssetMetadata({ source: cldAsset, args });
    const { value, error } = schema.validate(fetchedMetadata);

    if (!error) {
      // Fetched metadata is valid,
      // use validated value
      return value;
    } else {
      // Fetched metadata is not valid
      reporter.verbose(
        `[gatsby-transformer-cloudinary] Invalid fetched metadata for ${transformType}: cloudName=${cldAsset.cloudName}, publicId=${cldAsset.publicId} >>> ${error.message}`
      );
      return null;
    }
  } catch (error) {
    // Error fetching
    reporter.verbose(
      `[gatsby-transformer-cloudinary] Could not fetch metadata for ${transformType}: cloudName=${cldAsset.cloudName}, publicId=${cldAsset.publicId} >>> ${error.message}`
    );
    return null;
  }
};

// Make it testable
exports._generateCloudinaryAssetSource = generateCloudinaryAssetSource;

exports.createResolveCloudinaryAssetData =
  (gatsbyUtils, transformTypeConfig) => async (source, args, _context) => {
    let { reporter } = gatsbyUtils;
    reporter = resolverReporter({ reporter, logLevel: args.logLevel });

    const cldAssetData = {
      cloudName: transformTypeConfig['cloudName'](source),
      publicId: transformTypeConfig['publicId'](source),
      height: transformTypeConfig['height'](source) || source['originalHeight'],
      width: transformTypeConfig['width'](source) || source['originalWidth'],
      format: transformTypeConfig['format'](source) || source['originalFormat'],
      base64: transformTypeConfig['base64'](source) || source['defaultBase64'],
      tracedSVG:
        transformTypeConfig['tracedSVG'](source) || source['defaultTracedSVG'],
    };

    console.log(transformTypeConfig.type, source, cldAssetData);

    const schema = Joi.object({
      cloudName: Joi.string().required(),
      publicId: Joi.string().required(),
    }).required();

    const { error } = schema.validate(cldAssetData, {
      allowUnknown: true,
      abortEarly: false,
    });

    if (error) {
      if (error.details.length < 2 && error.details[0].path.length > 0) {
        reporter.warn(
          `[gatsby-transformer-cloudinary] Missing required field on ${transformTypeConfig.type}: cloudName=${cldAssetData?.cloudName}, publicId=${cldAssetData?.publicId} >>> gatsbyImageData will resolve to null`
        );
      } else {
        reporter.verbose(
          `[gatsby-transformer-cloudinary] Missing cloudName and publicId on ${transformTypeConfig.type} >>> gatsbyImageData will resolve to null`
        );
      }

      return null;
    }

    const metadata = await generateMetadata(
      cldAssetData,
      args,
      transformTypeConfig.type,
      reporter
    );

    if (!metadata) {
      reporter.warn(
        `[gatsby-transformer-cloudinary] No metadata for ${transformTypeConfig.type}: cloudName=${cldAssetData.cloudName}, publicId=${cldAssetData.publicId} >>> gatsbyImageData will resolve to null`
      );
      return null;
    }

    const gatsbyAssetDataArgs = {
      ...args,
      filename: cldAssetData.cloudName + '>>>' + cldAssetData.publicId,
      // Passing the plugin name allows for better error messages
      pluginName: `gatsby-transformer-cloudinary`,
      sourceMetadata: metadata,
      generateImageSource: generateCloudinaryAssetSource,
      options: args,
    };

    try {
      if (args.placeholder === 'blurred') {
        if (cldAssetData.defaultBase64) {
          gatsbyAssetDataArgs.placeholderURL = cldAssetData.defaultBase64;
        } else {
          const lowResolutionUrl =
            getLowResolutionImageURL(gatsbyAssetDataArgs);
          const base64 = await getUrlAsBase64Image(lowResolutionUrl);
          gatsbyAssetDataArgs.placeholderURL = base64;
        }
      } else if (args.placeholder === 'tracedSVG') {
        if (cldAssetData.defaultTracedSVG) {
          gatsbyAssetDataArgs.placeholderURL = cldAssetData.defaultTracedSVG;
        } else {
          const tracedSvg = await getAssetAsTracedSvg({ cldAssetData, args });
          gatsbyAssetDataArgs.placeholderURL = tracedSvg;
        }
      }
    } catch (error) {
      reporter.error(
        `[gatsby-transformer-cloudinary] Could not generate placeholder (${args.placeholder}) for ${cldAssetData.cloudName} > ${cldAssetData.publicId}: ${error.message}`
      );
    }

    return generateImageData(gatsbyAssetDataArgs);
  };
