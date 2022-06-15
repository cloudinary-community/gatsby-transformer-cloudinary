const { setPluginOptions, getPluginOptions } = require('./options');
const {
  createCloudinaryAssetType,
  createCloudinaryAssetNodes,
} = require('./node-creation');
const {
  createGatsbyImageResolvers,
  addFragments,
  createGatsbyImageTypes,
} = require('./gatsby-image');

//import plugin options, used to check for API key before uploading assets to Cloudinary

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
    `Cannot check if Gatsby supports onPluginInit lifecycle: 💜 🐸 on🔌👸 life🚴‍♀️ `
  );
}

const pluginOptions = getPluginOptions();

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

exports.onPreExtractQueries = async (gatsbyUtils) => {
  // Fragments to be used with gatsby-image
  await addFragments(gatsbyUtils);
};

exports.createSchemaCustomization = (gatsbyUtils) => {
  // Type to be used for node creation
  createCloudinaryAssetType(gatsbyUtils);

  // Types to be used with gatsby-image
  createGatsbyImageTypes(gatsbyUtils);
};

exports.createResolvers = (gatsbyUtils) => {
  const { reporter } = gatsbyUtils;
  // Resolvers to be used with gatsby-image
  createGatsbyImageResolvers(gatsbyUtils);
};

exports.onCreateNode = async (gatsbyUtils) => {
  // Create Cloudinary Asset nodes if applicable
  await createCloudinaryAssetNodes(gatsbyUtils, pluginOptions);
};
