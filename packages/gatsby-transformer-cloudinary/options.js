let options = null;

const DEFAULT_FLUID_MAX_WIDTH = 1000;
const DEFAULT_FLUID_MIN_WIDTH = 50;
const DEFAULT_BREAKPOINTS_MAX_IMAGES = 20;
const DEFAULT_CREATE_DERIVED = true;
const DEFAULT_USE_CLOUDINARY_BREAKPOINTS = true;
const DEFAULT_OVERWRITE_EXISTING = true;

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
    fluidMaxWidth: DEFAULT_FLUID_MAX_WIDTH,
    fluidMinWidth: DEFAULT_FLUID_MIN_WIDTH,
    breakpointsMaxImages: DEFAULT_BREAKPOINTS_MAX_IMAGES,
    createDerived: DEFAULT_CREATE_DERIVED,
    useCloudinaryBreakpoints: DEFAULT_USE_CLOUDINARY_BREAKPOINTS,
    overwriteExisting: DEFAULT_OVERWRITE_EXISTING,
    ...pluginOptions,
  };
};

exports.getPluginOptions = () => {
  return options;
};
