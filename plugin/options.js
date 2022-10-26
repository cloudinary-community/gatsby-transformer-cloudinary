let options = {};

exports.setPluginOptions = ({ pluginOptions }) => {
  // Set global options so they are available
  // when used by createRemoteImageNode
  Object.assign(options, pluginOptions);
};

exports.getPluginOptions = () => {
  return options;
};
