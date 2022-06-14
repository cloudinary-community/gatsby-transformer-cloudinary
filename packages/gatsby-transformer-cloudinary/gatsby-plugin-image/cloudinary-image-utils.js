const cloudinary = require('cloudinary').v2;
const {
  getLowResolutionImageURL,
  generateImageData,
} = require('gatsby-plugin-image');
const { getBase64Image } = require('./placeholders');

const generateCloudinaryRawTransformation = (transformations = []) => {
  return transformations.map((transformations) => {
    return { raw_transformation: transformations };
  });
};

// Create Cloudinary image URL with transformations.
const generateCloudinaryUrl = (
  filename,
  width,
  height,
  format,
  fit,
  options = {}
) => {
  console.log('FIT >>>> ', { fit });
  console.log('FORMAT >>>> ', { format });

  const url = cloudinary.url(filename, {
    transformation: [
      ...generateCloudinaryRawTransformation(options.preSizingTransformations),
      {
        fetch_format: format,
        width: width,
        height: height,
        // Default Gatsby Image Options
        aspect_ratio: options.aspectRatio,
        dpr: options.outputPixelDensities,
        // Cloudinary Specific Options
        gravity: options.gravity,
        crop: options.crop,
        x: options.x,
        y: options.y,
        zoom: options.zoom,
        quality: options.quality,
        raw_transformation: (options.transformations || []).join(','),
      },
      ...(options.chained || []).map((transformations) => {
        return { raw_transformation: transformations };
      }),
    ],
  });

  console.log('URL >>>> ', url);

  return url;
};

const generateCloudinaryImageSource = (
  filename,
  width,
  height,
  format,
  fit,
  options
) => {
  const cloudinarySrcUrl = generateCloudinaryUrl(
    filename,
    width,
    height,
    format,
    fit,
    options
  );

  const imageSource = {
    src: cloudinarySrcUrl,
    width: width,
    height: height,
    format: format,
  };

  return imageSource;
};

exports.resolveCloudinaryAssetData = async (source, args) => {
  const imageDataArgs = {
    ...args,
    filename: source.publicId,
    // Passing the plugin name allows for better error messages
    pluginName: `gatsby-transformer-cloudinary`,
    sourceMetadata: {
      width: source.originalWidth,
      height: source.originalHeight,
      format: source.originalFormat,
    },
    generateImageSource: generateCloudinaryImageSource,
    options: args,
  };

  // Generating placeholders is optional, but recommended
  if (args.placeholder === 'blurred') {
    if (source.defaultBase64) {
      imageDataArgs.placeholderURL = source.defaultBase64;
    } else {
      const lowResImageUrl = getLowResolutionImageURL(imageDataArgs);
      imageDataArgs.placeholderURL = await getBase64Image(lowResImageUrl);
    }
  }

  return generateImageData(imageDataArgs);
};
