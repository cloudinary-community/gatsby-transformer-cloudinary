const {
  initializaGlobalState,
  getCoreSupportsOnPluginInit,
} = require('./options');
const {
  createCloudinaryAssetType,
  createCloudinaryAssetNodes,
} = require('./node-creation');

const { createGatsbyImageDataResolver } = require('./gatsby-plugin-image');

let coreSupportsOnPluginInit = getCoreSupportsOnPluginInit();

if (coreSupportsOnPluginInit === 'stable') {
  exports.onPluginInit = initializaGlobalState;
} else if (coreSupportsOnPluginInit === 'unstable') {
  exports.unstable_onPluginInit = initializaGlobalState;
} else {
  exports.onPreInit = initializaGlobalState;
}

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    cloudName: Joi.string(),
    apiKey: Joi.string(),
    apiSecret: Joi.string(),
    uploadFolder: Joi.string(),
    uploadSourceInstanceNames: Joi.array().items(Joi.string()),
    transformTypes: Joi.array()
      .items(
        Joi.string(),
        Joi.object({
          type: Joi.string().required(),
          // Typically static for all sourced data of same type
          // Needs both dynamic and static oppertunities
          cloudName: Joi.alternatives().try(Joi.function(), Joi.string()),
          secure: Joi.alternatives().try(Joi.function(), Joi.boolean()),
          cname: Joi.alternatives().try(Joi.function(), Joi.string()),
          secureDistribution: Joi.alternatives().try(
            Joi.function(),
            Joi.string()
          ),
          privateCdn: Joi.alternatives().try(Joi.function(), Joi.boolean()),
          // Dynamic within the same type of sourced data, no need for static value
          publicId: Joi.function(),
          height: Joi.function(),
          width: Joi.function(),
          format: Joi.function(),
          base64: Joi.function(),
          tracedSVG: Joi.function(),
          // To be deprecated
          mapping: Joi.object({
            // Typically static for all sourced data of same type
            cloudName: Joi.alternatives()
              .try(Joi.function(), Joi.string())
              .default('cloud_name'),
            // Dynamic within the same type of sourced data
            publicId: Joi.alternatives()
              .try(Joi.function(), Joi.string())
              .default('public_id'),
            height: Joi.alternatives()
              .try(Joi.function(), Joi.string())
              .default('height'),
            width: Joi.alternatives()
              .try(Joi.function(), Joi.string())
              .default('width'),
            format: Joi.alternatives()
              .try(Joi.function(), Joi.string())
              .default('format'),
            base64: Joi.alternatives()
              .try(Joi.function(), Joi.string())
              .default('base64'),
            tracedSVG: Joi.alternatives()
              .try(Joi.function(), Joi.string())
              .default('tracedSVG'),
          }),
        })
      )
      .default(['CloudinaryAsset']),
    overwriteExisting: Joi.boolean().default(false),
    defaultTransformations: Joi.array()
      .items(Joi.string())
      .default(['c_fill', 'g_auto', 'q_auto']),
  });
};

exports.createSchemaCustomization = (gatsbyUtils) => {
  // Type to be used for node creation
  createCloudinaryAssetType(gatsbyUtils);
};

exports.createResolvers = (gatsbyUtils, pluginOptions) => {
  // Resolvers to be used with gatsby-plugin-image
  createGatsbyImageDataResolver(gatsbyUtils, pluginOptions);
};

exports.onCreateNode = async (gatsbyUtils, pluginOptions) => {
  // Upload and create Cloudinary Asset nodes if applicable
  await createCloudinaryAssetNodes(gatsbyUtils, pluginOptions);
};
