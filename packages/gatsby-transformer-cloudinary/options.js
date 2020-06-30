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

  options = {
    ...defaultOptions,
    ...pluginOptions,
  };
};

exports.getPluginOptions = () => {
  return options;
};
