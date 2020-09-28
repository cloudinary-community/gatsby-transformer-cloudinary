let options = null;

const defaultOptions = {
  fluidMaxWidth: 1000,
  fluidMinWidth: 50,
  breakpointsMaxImages: 20,
  createDerived: false,
  useCloudinaryBreakpoints: false,
  overwriteExisting: false,
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

  // Set default transformations based on plugin option sent by the user
  const defaultTransformations = ['f_auto', 'q_auto'];
  if(pluginOptions.enableDefaultTransformations === true){
    pluginOptions.defaultTransformations = defaultTransformations;
  }else{
    pluginOptions.defaultTransformations = [];
  }

  options = {
    ...defaultOptions,
    ...pluginOptions,
  };
};

exports.getPluginOptions = () => {
  return options;
};
