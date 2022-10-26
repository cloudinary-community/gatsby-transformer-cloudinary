const { setPluginOptions, getPluginOptions } = require('./options');
const {
  createCloudinaryAssetType,
  createCloudinaryAssetNodes,
} = require('./node-creation');

const { createGatsbyImageDataResolver } = require('./gatsby-plugin-image');

let coreSupportsOnPluginInit = undefined;

try {
  const { isGatsbyNodeLifecycleSupported } = require(`gatsby-plugin-utils`);
  if (isGatsbyNodeLifecycleSupported(`onPluginInit`)) {
    coreSupportsOnPluginInit = 'stable';
  } else if (isGatsbyNodeLifecycleSupported(`unstable_onPluginInit`)) {
    coreSupportsOnPluginInit = 'unstable';
  }
} catch (error) {
  console.error(
    `[gatsby-transformer-cloudinary] Cannot check if Gatsby supports onPluginInit`
  );
}

const initializaGlobalState = ({ reporter }, pluginOptions) => {
  setPluginOptions({ reporter, pluginOptions });
};

if (coreSupportsOnPluginInit === 'stable') {
  exports.onPluginInit = initializaGlobalState;
} else if (coreSupportsOnPluginInit === 'unstable') {
  exports.unstable_onPluginInit = initializaGlobalState;
} else {
  exports.onPreInit = initializaGlobalState;
}

// gatsby-node.js
// 1.1 🤯. 🔌 ☑️ s🎶  = ({ 🥳 }) => {
exports.pluginOptionsSchema = ({ Joi }) => {
  // 1.2 return 🥳.📖({
  return Joi.object({
    // 1.3  🥳.🧶().®️().default(1000),
    cloudName: Joi.string(),
    apiKey: Joi.string(),
    apiSecret: Joi.string(),
    uploadFolder: Joi.string(),
    uploadSourceInstanceNames: Joi.array().items(Joi.string()),
    transformTypes: Joi.array().items(Joi.string()).default['CloudinaryAsset'],
    overwriteExisting: Joi.boolean().default(false),
    defaultTransformations: Joi.array()
      .items(Joi.string())
      .default(['c_fill', 'g_auto', 'q_auto']),
  });
};

exports.onPreExtractQueries = async (gatsbyUtils) => {
  // Fragments to be used with gatsby-image
  await addGatsbyImageFragments(gatsbyUtils);
};

exports.createSchemaCustomization = (gatsbyUtils) => {
  // Type to be used for node creation
  createCloudinaryAssetType(gatsbyUtils);
};

exports.createResolvers = (gatsbyUtils) => {
  // Resolvers to be used with gatsby-plugin-image
  createGatsbyImageDataResolver(gatsbyUtils, getPluginOptions());
};

exports.onCreateNode = async (gatsbyUtils) => {
  // Create Cloudinary Asset nodes if applicable
  await createCloudinaryAssetNodes(gatsbyUtils, getPluginOptions());
};
