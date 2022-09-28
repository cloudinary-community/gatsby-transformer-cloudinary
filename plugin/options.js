const { isArray } = require('lodash');

let options = {};

const defaultOptions = {
  fluidMaxWidth: 1000,
  fluidMinWidth: 50,
  breakpointsMaxImages: 20,
  createDerived: false,
  useCloudinaryBreakpoints: false,
  overwriteExisting: false,
  enableDefaultTransformations: false,
  alwaysUseDefaultBase64: false,
  defaultTransformations: ['c_fill', 'g_auto', 'q_auto'],
  transformTypes: ['CloudinaryAsset'],
};

// Assign defaultOptions to options for run time operations
Object.assign(options, defaultOptions);

exports.setPluginOptions = ({ pluginOptions, reporter }) => {
  Object.assign(options, pluginOptions);

  if (!isArray(options.defaultTransformations)) {
    reporter.panic(
      `[gatsby-transformer-cloudinary] "defaultTransformations" must be an array. You can modify it in your gatsby-config file.`
    );
  }

  if (options.breakpointsMaxImages && options.breakpointsMaxImages < 1) {
    reporter.panic(
      `[gatsby-transformer-cloudinary] "breakpointsMaxImages" must be at least 1. You can modify it in your gatsby-config file.`
    );
  }

  if (options.apiKey && options.apiSecret && options.cloudName) {
    const sourceInstanceNamesInfo = options.uploadSourceInstanceNames
      ? `(with source instance names: ${options.uploadSourceInstanceNames})`
      : '';

    const locationInfo = options.uploadFolder
      ? `folder ${options.uploadFolder} in ${options.cloudName}`
      : options.cloudName;

    reporter.info(
      `[gatsby-transformer-cloudinary] Local files ${sourceInstanceNamesInfo} will be uploaded to ${locationInfo} `
    );
  } else {
    reporter.info(
      `[gatsby-transformer-cloudinary] Local files will not be uploaded`
    );
  }
};

exports.getPluginOptions = () => {
  return options;
};
