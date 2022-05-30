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
};

// Assign defaultOptions to options for run time operations
Object.assign(options, defaultOptions);

exports.setPluginOptions = ({ pluginOptions, reporter }) => {
  if (
    pluginOptions.breakpointsMaxImages &&
    pluginOptions.breakpointsMaxImages < 1
  ) {
    reporter.panic(
      `[gatsby-transformer-cloudinary] "breakpointsMaxImages" must be at least 1. You can modify it in your gatsby-config file.`
    );
  }

  // options = {
  //   ...defaultOptions,
  //   ...pluginOptions,
  // };

  Object.assign(options, pluginOptions);
};

exports.getPluginOptions = () => {
  return options;
};
