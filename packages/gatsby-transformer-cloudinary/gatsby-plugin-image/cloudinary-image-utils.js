const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const {
  getLowResolutionImageURL,
  generateImageData,
} = require('gatsby-plugin-image');
const { getBase64Image, getSvgImage } = require('./placeholders');

// Create Cloudinary image URL with transformations.
const generateCloudinaryUrl = ({
  publicId,
  cloudName,
  width,
  height,
  format,
  options = {},
  flags,
  tracedSvg,
}) => {
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

  if (tracedSvg) {
    const effectOptions = Object.keys(tracedSvg.options).reduce((acc, key) => {
      const value = tracedSvg.options[key];
      return value ? acc + `:${key}:${value}` : acc;
    }, 'vectorize');

    transformations.push({
      effect: effectOptions,
      width: tracedSvg.width,
    });
  }

  cloudinary.config({ cloud_name: cloudName });

  const url = cloudinary.url(publicId, {
    transformation: transformations,
    flags: flags,
  });

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
  const [cloudName, publicId] = filename.split('>>>');
  const cloudinarySrcUrl = generateCloudinaryUrl({
    cloudName: cloudName,
    publicId: publicId,
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
  let sourceMataData = {
    width: source.originalWidth,
    height: source.originalHeight,
    format: source.originalFormat,
  };

  if (
    !sourceMataData.width ||
    !sourceMataData.height ||
    !sourceMataData.format
  ) {
    // Lacking metadata, so lets fetch it
    const metaDataUrl = generateCloudinaryUrl({
      publicId: source.publicId,
      cloudName: source.cloudName,
      options: args,
      flags: 'getinfo',
    });

    const {
      data: { output = {} },
    } = await axios.get(metaDataUrl);
    sourceMataData = output;
  }

  const imageDataArgs = {
    ...args,
    filename: source.cloudName + '>>>' + source.publicId,
    // Passing the plugin name allows for better error messages
    pluginName: `gatsby-transformer-cloudinary`,
    sourceMetadata: sourceMataData,
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
        cloudName: source.cloudName,
        format: 'svg',
        options: args,
        tracedSvg: {
          options: {
            colors: 2,
            detail: 0.3,
            despeckle: 0.1,
          },
          width: 300,
        },
      });
      imageDataArgs.placeholderURL = await getSvgImage(vectorizedImageUrl);
    }
  }

  return generateImageData(imageDataArgs);
};
