const cloudinary = require('cloudinary').v2;
const pluginPkg = require('../package.json');
const gatsbyPkg = require('gatsby/package.json');

const SDK_CODE = 'X';
const SDK_SEMVER = pluginPkg.version;
const TECH_VERSION = gatsbyPkg.version;

const generateTransformations = ({ source = {}, options = {} }) => {
  return [
    {
      fetch_format: source.format || 'auto',
      width: source.width,
      height: source.height,
      raw_transformation: (options.transformations || []).join(','),
    },
    ...(options.chained || []).map((transformations) => {
      return { raw_transformation: transformations };
    }),
  ];
};

const generateTracedSVGTransformation = ({ options, width }) => {
  const effectOptions = Object.keys(options).reduce((acc, key) => {
    const value = options[key];
    return value ? acc + `:${key}:${value}` : acc;
  }, 'vectorize');

  return {
    effect: effectOptions,
    width: width,
  };
};

// Create Cloudinary image URL with transformations.
exports.generateCloudinaryAssetUrl = ({
  source = {},
  options = {},
  flags,
  tracedSvg,
}) => {
  const transformation = generateTransformations({
    source,
    options,
  });

  if (tracedSvg) {
    transformation.push(generateTracedSVGTransformation(tracedSvg));
  }

  const url = cloudinary.url(source.publicId, {
    cloud_name: source.cloudName,
    // Secure and privateCdn is a boolean, so important to check if it's undefined
    secure: options.secure === undefined ? source.secure : options.secure,
    private_cdn:
      options.privateCdn == undefined ? source.privateCdn : options.privateCdn,
    cname: options.cname || source.cname,
    secure_distribution:
      options.secureDistribution || source.secureDistribution,
    transformation: transformation,
    flags: flags,
    urlAnalytics: true,
    sdkCode: SDK_CODE,
    sdkSemver: SDK_SEMVER,
    techVersion: TECH_VERSION,
  });

  return url;
};
