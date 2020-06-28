let options = null;

const DEFAULT_FLUID_MAX_WIDTH = 1000;
const DEFAULT_FLUID_MIN_WIDTH = 200;
const DEFAULT_BREAKPOINTS_MAX_IMAGES = 5;
const DEFAULT_CREATE_DERIVED = true;

exports.setPluginOptions = pluginOptions => {
  options = {
    fluidMaxWidth: DEFAULT_FLUID_MAX_WIDTH,
    fluidMinWidth: DEFAULT_FLUID_MIN_WIDTH,
    breakpointsMaxImages: DEFAULT_BREAKPOINTS_MAX_IMAGES,
    createDerived: DEFAULT_CREATE_DERIVED,
    ...pluginOptions,
  };
};

exports.getPluginOptions = () => {
  return options;
};
