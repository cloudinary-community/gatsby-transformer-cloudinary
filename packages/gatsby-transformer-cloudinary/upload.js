const cloudinary = require('cloudinary').v2;
const { getPluginOptions } = require('./options');

exports.uploadImageToCloudinary = async ({ url, publicId }) => {
  const {
    apiKey,
    apiSecret,
    breakpointsMaxImages,
    cloudName,
    createDerived,
    fluidMaxWidth,
    fluidMinWidth,
    overwriteExisting,
    uploadFolder,
    useCloudinaryBreakpoints,
  } = getPluginOptions();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  //can we save on transformations if we do omit responsive_breakpoints?

  const uploadOptions = {
    folder: uploadFolder,
    overwrite: overwriteExisting,
    public_id: publicId,
    resource_type: 'auto',
  };

  // Each time we ask Cloudinary to calculate the responsive breakpoints for an
  // image, Cloudinary bills us for one transformation. Since this API call
  // gets called for every image every time our Gatsby cache gets cleared, this
  // can get expensive very fast. This option should not be used outside of
  // production.
  if (useCloudinaryBreakpoints) {
    uploadOptions.responsive_breakpoints = [
      {
        create_derived: createDerived,
        bytes_step: 20000,
        min_width: fluidMinWidth,
        max_width: fluidMaxWidth,
        max_images: breakpointsMaxImages,
      },
    ];
  }

  let attempts = 1;

  while (attempts++ <= 3) {
    try {
      const result = await cloudinary.uploader.upload(url, uploadOptions);
      // console.log('exports.uploadImageToCloudinary -> result', result);
      return result;
    } catch (error) {
      console.log('Caught an error in uploadImageToCloudinary:', error);
    }
  }
  throw Error(`Unable to upload ${url} to Cloudinary.`);
};

exports.uploadImageNodeToCloudinary = async node => {
  const url = node.absolutePath;
  const publicId = node.name;
  const result = await exports.uploadImageToCloudinary({ url, publicId });
  return result;
};
