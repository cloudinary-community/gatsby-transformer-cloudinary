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

const validateMetadataAndFetchIfNeeded = async (
  cldAssetSource,
  args,
  reporter
) => {
  const schema = Joi.object({
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    format: Joi.string().default('auto'),
  }).required();

  const { value, error } = schema.validate(cldAssetSource, {
    stripUnknown: true,
  });

  if (!error) {
    return value;
  }

  try {
    reporter.verbose(
      `[gatsby-transformer-cloudinary] Missing metadata fields on ${cldAssetSource.type}: cloudName=${cldAssetSource.cloudName}, publicId=${cldAssetSource.publicId} >>> To save on network requests add width, height and format to ${cldAssetSource.transformType}`
    );

    const fetchedMetadata = await getAssetMetadata({
      source: cldAssetSource,
      args,
    });
    const { value, error } = schema.validate(fetchedMetadata);

    if (!error) {
      // Fetched metadata is valid,
      // use validated value
      return value;
    } else {
      // Fetched metadata is not valid
      reporter.verbose(
        `[gatsby-transformer-cloudinary] Invalid fetched metadata for ${cldAssetSource.type}: cloudName=${cldAssetSource.cloudName}, publicId=${cldAssetSource.publicId} >>> ${error.message}`
      );
      return null;
    }
  } catch (error) {
    // Error fetching
    reporter.verbose(
      `[gatsby-transformer-cloudinary] Could not fetch metadata for ${cldAssetSource.type}: cloudName=${cldAssetSource.cloudName}, publicId=${cldAssetSource.publicId} >>> ${error.message}`
    );
    return null;
  }
};

const validateRequiredData = (cldAssetSource, reporter) => {
  const schema = Joi.object({
    cloudName: Joi.string().required(),
    publicId: Joi.string().required(),
  }).required();

  const { value, error } = schema.validate(cldAssetSource, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (!error) {
    return value;
  }

  if (error?.details.length < 2 && error?.details[0].path.length > 0) {
    // Probably a mistake as it has one of the required fields
    reporter.warn(
      `[gatsby-transformer-cloudinary] Missing required field on ${cldAssetSource.type}: cloudName=${cldAssetSource.cloudName}, publicId=${cldAssetSource.publicId} >>> gatsbyImageData will resolve to null`
    );
    return null;
  } else {
    // Probably a non Cloudinary asses as it has none of the required fields
    reporter.verbose(
      `[gatsby-transformer-cloudinary] Missing cloudName and publicId on ${cldAssetSource.type} >>> gatsbyImageData will resolve to null`
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
    source = source || {};
    const mapping = transformTypeConfig.mapping || {};

    let cldAssetSource = {
      type: transformTypeConfig.type,
      cloudName: mapping['cloudName'](source) || source['cloudName'],
      publicId: mapping['publicId'](source) || source['publicId'],
      height: mapping['height'](source) || source['originalHeight'],
      width: mapping['width'](source) || source['originalWidth'],
      format: mapping['format'](source) || source['originalFormat'],
      base64: mapping['base64'](source) || source['defaultBase64'],
      tracedSVG: mapping['tracedSVG'](source) || source['defaultTracedSVG'],
    };

    const cldAssetRequired = validateRequiredData(cldAssetSource, reporter);
    if (!cldAssetRequired) return null;

    cldAssetSource = {
      ...cldAssetSource,
      ...cldAssetRequired,
    };

    const cldAssetMetadata = await validateMetadataAndFetchIfNeeded(
      cldAssetSource,
      args,
      reporter
    );
    if (!cldAssetMetadata) return null;

    cldAssetSource = {
      ...cldAssetSource,
      ...cldAssetMetadata,
    };

    const gatsbyAssetDataArgs = {
      ...args,
      filename: cldAssetSource.cloudName + '>>>' + cldAssetSource.publicId,
      // Passing the plugin name allows for better error messages
      pluginName: `gatsby-transformer-cloudinary`,
      sourceMetadata: cldAssetMetadata,
      generateImageSource: generateCloudinaryAssetSource,
      options: args,
    };

    try {
      if (args.placeholder === 'blurred') {
        if (cldAssetSource.base64) {
          gatsbyAssetDataArgs.placeholderURL = cldAssetSource.base64;
        } else {
          const lowResolutionUrl =
            getLowResolutionImageURL(gatsbyAssetDataArgs);
          const base64 = await getUrlAsBase64Image(lowResolutionUrl);
          gatsbyAssetDataArgs.placeholderURL = base64;
        }
      } else if (args.placeholder === 'tracedSVG') {
        if (cldAssetSource.tracedSVG) {
          gatsbyAssetDataArgs.placeholderURL = cldAssetSource.tracedSVG;
        } else {
          const tracedSvg = await getAssetAsTracedSvg({
            source: cldAssetSource,
            args,
          });
          gatsbyAssetDataArgs.placeholderURL = tracedSvg;
        }
      }
    } catch (error) {
      reporter.error(
        `[gatsby-transformer-cloudinary] Could not generate placeholder (${args.placeholder}) for ${cldAssetSource.cloudName} > ${cldAssetSource.publicId}: ${error.message}`
      );
    }

    return generateImageData(gatsbyAssetDataArgs);
  };
