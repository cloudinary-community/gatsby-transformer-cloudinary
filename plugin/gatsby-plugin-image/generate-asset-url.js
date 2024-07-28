const cloudinary = require('cloudinary').v2;
const pluginPkg = require('../package.json');
const gatsbyPkg = require('gatsby/package.json');

const SDK_CODE = 'X';
const SDK_SEMVER = pluginPkg.version;
const TECH_VERSION = gatsbyPkg.version;

const generateTransformations = ({ width, height, format, options = {} }) => {
  return [
    {
      fetch_format: format || 'auto',
      width: width,
      height: height,
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
  width,
  height,
  format,
  cldAssetData = {},
  options = {},
  flags,
  tracedSvg,
}) => {
  const transformation = generateTransformations({
    width,
    height,
    format,
    options,
  });

  if (tracedSvg) {
    transformation.push(generateTracedSVGTransformation(tracedSvg));
  }

  const url = cloudinary.url(cldAssetData.publicId, {
    cloud_name: cldAssetData.cloudName,
    // Secure and privateCdn is a boolean, so important to check if it's undefined
    secure: options.secure === undefined ? cldAssetData.secure : options.secure,
    private_cdn:
      options.privateCdn == undefined
        ? cldAssetData.privateCdn
        : options.privateCdn,
    cname: options.cname || cldAssetData.cname,
    secure_distribution:
      options.secureDistribution || cldAssetData.secureDistribution,
    transformation: transformation,
    flags: flags,
    urlAnalytics: true,
    sdkCode: SDK_CODE,
    sdkSemver: SDK_SEMVER,
    techVersion: TECH_VERSION,
  });

  return url;
};
