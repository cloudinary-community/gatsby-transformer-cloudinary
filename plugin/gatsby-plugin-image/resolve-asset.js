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

const generateCloudinaryImageSource =
  (cldAssetData) => (_filename, width, height, format, _fit, options) => {
    const cloudinarySrcUrl = generateCloudinaryAssetUrl({
      cldAssetData,
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
  cldAssetData,
  args,
  reporter
) => {
  const schema = Joi.object({
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    format: Joi.string().default('auto'),
  }).required();

  const { value, error } = schema.validate(cldAssetData, {
    stripUnknown: true,
  });

  if (!error) {
    return value;
  }

  try {
    reporter.verbose(
      `[gatsby-transformer-cloudinary] Missing metadata fields on ${cldAssetData.type}: cloudName=${cldAssetData.cloudName}, publicId=${cldAssetData.publicId} >>> To save on network requests add width, height and format to ${cldAssetData.transformType}`
    );

    const fetchedMetadata = await getAssetMetadata({
      cldAssetData,
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
        `[gatsby-transformer-cloudinary] Invalid fetched metadata for ${cldAssetData.type}: cloudName=${cldAssetData.cloudName}, publicId=${cldAssetData.publicId} >>> ${error.message}`
      );
      return null;
    }
  } catch (error) {
    // Error fetching
    reporter.verbose(
      `[gatsby-transformer-cloudinary] Could not fetch metadata for ${cldAssetData.type}: cloudName=${cldAssetData.cloudName}, publicId=${cldAssetData.publicId} >>> ${error.message}`
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

const generateCloudinaryAssetData = async ({ source, transformTypeConfig }) => {
  const pickFirstValue = (...values) => {
    for (const value of values) {
      if (value != undefined) {
        return value;
      }
    }
  };

  source = source || {};
  // Deprecated
  const mapping = transformTypeConfig.mapping || {};

  const cldAssetData = {
    type: transformTypeConfig.type,
    cloudName: pickFirstValue(
      transformTypeConfig['cloudName'](source),
      mapping['cloudName'](source), // Deprected
      source['cloud_name'],
      source['cloudName']
    ),
    secure: pickFirstValue(
      transformTypeConfig['secure'](source),
      source['secure'],
      true
    ),
    secureDistribution: pickFirstValue(
      transformTypeConfig['secureDistribution'](source),
      source['secure_distribution'],
      source['secureDistribution']
    ),
    cname: pickFirstValue(
      transformTypeConfig['cname'](source),
      source['cname']
    ),
    secureDistribution: pickFirstValue(
      transformTypeConfig['secureDistribution'](source),
      source['secure_distribution'],
      source['secureDistribution']
    ),
    privateCdn: pickFirstValue(
      transformTypeConfig['privateCdn'](source),
      source['private_cdn'],
      source['privateCdn'],
      false
    ),
    publicId: pickFirstValue(
      transformTypeConfig['publicId'](source),
      mapping['publicId'](source), // Deprecated
      source['public_id'],
      source['publicId']
    ),
    height: pickFirstValue(
      transformTypeConfig['height'](source),
      mapping['height'](source), // Deprecated
      source['height'],
      source['originalHeight']
    ),
    width: pickFirstValue(
      transformTypeConfig['width'](source),
      mapping['width'](source), // Deprecated
      source['width'],
      source['originalWidth']
    ),
    format: pickFirstValue(
      transformTypeConfig['format'](source),
      mapping['format'](source), // Deprecated
      source['format'],
      source['originalFormat']
    ),
    base64: pickFirstValue(
      transformTypeConfig['base64'](source),
      mapping['base64'](source), // Deprected
      source['base64'],
      source['defaultBase64']
    ),
    tracedSVG: pickFirstValue(
      transformTypeConfig['tracedSVG'](source),
      mapping['tracedSVG'](source), // Deprecated
      source['tracedSVG'],
      source['defaultTracedSVG']
    ),
  };

  return cldAssetData;
};

// Make it testable
exports._generateCloudinaryImageSource = generateCloudinaryImageSource;
exports._generateCloudinaryAssetData = generateCloudinaryAssetData;

exports.createResolveCloudinaryAssetData =
  (gatsbyUtils, transformTypeConfig) => async (source, args, _context) => {
    let { reporter } = gatsbyUtils;

    reporter = resolverReporter({ reporter, logLevel: args.logLevel });

    let cldAssetData = await generateCloudinaryAssetData({
      source,
      transformTypeConfig,
    });

    const cldAssetRequired = validateRequiredData(cldAssetData, reporter);
    if (!cldAssetRequired) return null;

    cldAssetData = {
      ...cldAssetData,
      ...cldAssetRequired,
    };

    const cldAssetMetadata = await validateMetadataAndFetchIfNeeded(
      cldAssetData,
      args,
      reporter
    );
    if (!cldAssetMetadata) return null;

    cldAssetData = {
      ...cldAssetData,
      ...cldAssetMetadata,
    };

    const gatsbyAssetDataArgs = {
      ...args,
      filename: cldAssetData.cloudName + '>>>' + cldAssetData.publicId,
      // Passing the plugin name allows for better error messages
      pluginName: `gatsby-transformer-cloudinary`,
      sourceMetadata: cldAssetMetadata,
      generateImageSource: generateCloudinaryImageSource(cldAssetData),
      options: args,
    };

    try {
      if (args.placeholder === 'blurred') {
        if (cldAssetData.base64) {
          gatsbyAssetDataArgs.placeholderURL = cldAssetData.base64;
        } else {
          const lowResolutionUrl =
            getLowResolutionImageURL(gatsbyAssetDataArgs);
          const base64 = await getUrlAsBase64Image(lowResolutionUrl);
          gatsbyAssetDataArgs.placeholderURL = base64;
        }
      } else if (args.placeholder === 'tracedSVG') {
        if (cldAssetData.tracedSVG) {
          gatsbyAssetDataArgs.placeholderURL = cldAssetData.tracedSVG;
        } else {
          const tracedSvg = await getAssetAsTracedSvg({
            cldAssetData,
            args,
          });
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
