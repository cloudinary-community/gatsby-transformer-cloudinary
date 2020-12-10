let options = null;

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

const requiredOptions = ['apiKey', 'apiSecret', 'cloudName'];

exports.setPluginOptions = ({ pluginOptions, reporter }) => {
  requiredOptions.forEach(optionKey => {
    if (pluginOptions[optionKey] == null) {
      reporter.panic(
        `[gatsby-transformer-cloudinary] "${optionKey}" is a required plugin option. You can add it to the options object for "gatsby-transformer-cloudinary" in your gatsby-config file.`,
      );
    }
  });

  if (
    pluginOptions.breakpointsMaxImages &&
    pluginOptions.breakpointsMaxImages < 1
  ) {
    reporter.panic(
      `[gatsby-transformer-cloudinary] "breakpointsMaxImages" must be at least 1. You can modify it in your gatsby-config file.`,
    );
  }

  options = {
    ...defaultOptions,
    ...pluginOptions,
  };
};

exports.getPluginOptions = () => {
  return options;
};
