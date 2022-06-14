const cloudinary = require('cloudinary').v2;
const {
  getLowResolutionImageURL,
  generateImageData,
} = require('gatsby-plugin-image');
const { getBase64Image, getSvgImage } = require('./placeholders');

// Create Cloudinary image URL with transformations.
const generateCloudinaryUrl = ({
  publicId,
  width,
  height,
  format,
  options = {},
}) => {
  console.log('FORMAT >>>> ', { format });

  const transformations = [
    {
      fetch_format: format,
      width: width,
      height: height,
      // Default Gatsby Image Options
      aspect_ratio: options.aspectRatio, // Might not need this since its calculated...
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
  ];

  if (options.tracedSvg) {
    const effectOptions = Object.keys(options.tracedSvgOptions).reduce(
      (acc, key) => {
        const value = options.tracedSvgOptions[key];
        console.log({ key, value, acc });
        return value ? acc + `:${key}:${value}` : acc;
      },
      'vectorize'
    );

    transformations.push({
      effect: effectOptions,
      width: options.tracedSvgMaxWidth,
    });
  }

  const url = cloudinary.url(publicId, {
    transformation: transformations,
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
  const cloudinarySrcUrl = generateCloudinaryUrl({
    publicId: filename,
    width,
    height,
    format,
    options,
  });

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
  } else if (args.placeholder === 'tracedSVG') {
    if (source.defaultTracedSVG) {
      imageDataArgs.placeholderURL = source.defaultTracedSVG;
    } else {
      const vectorizedImageUrl = generateCloudinaryUrl({
        publicId: source.publicId,
        format: 'svg',
        options: {
          ...args,
          tracedSvg: true,
          tracedSvgOptions: {
            colors: 2,
            detail: 0.3,
            despeckle: 0.1,
          },
          tracedSvgMaxWidth: 300,
        },
      });
      imageDataArgs.placeholderURL = await getSvgImage(vectorizedImageUrl);
    }
  }

  return generateImageData(imageDataArgs);
};
