const cloudinary = require('cloudinary').v2;

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
  publicId,
  cloudName,
  width,
  height,
  format,
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

  cloudinary.config({ cloud_name: cloudName, secure: options.secure });

  const url = cloudinary.url(publicId, {
    transformation,
    flags,
  });

  return url;
};
