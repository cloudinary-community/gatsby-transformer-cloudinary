let options = null;

const defaultOptions = {
  fluidMaxWidth: 1000,
  fluidMinWidth: 50,
  breakpointsMaxImages: 20,
  createDerived: true,
  useCloudinaryBreakpoints: true,
  overwriteExisting: true,
};

const requiredOptions = ['cloudName', 'apiKey', 'apiSecret'];

exports.setPluginOptions = pluginOptions => {
  requiredOptions.forEach(optionKey => {
    if (pluginOptions[optionKey] == null) {
      throw Error(
        `${optionKey} is a required plugin option for gatsby-transformer-cloudinary.`,
      );
    }
  });

  if (
    pluginOptions.breakpointsMaxImages &&
    pluginOptions.breakpointsMaxImages < 1
  ) {
    throw Error(`breakpointsMaxImages must be at least 1.`);
  }

  options = {
    ...defaultOptions,
    ...pluginOptions,
  };
};

exports.getPluginOptions = () => {
  return options;
};
